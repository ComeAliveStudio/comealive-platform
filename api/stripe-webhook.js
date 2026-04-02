import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function getPlanFromAmount(amount) {
  if (amount === 2900) return 'professional'
  if (amount === 9700) return 'mastery'
  return 'explorer'
}

function toIsoDate(unixSeconds) {
  if (!unixSeconds) return null
  return new Date(unixSeconds * 1000).toISOString()
}

async function getRawBody(req) {
  const chunks = []

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    const rawBody = await getRawBody(req)

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    // CHECKOUT COMPLETED
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      if (session.payment_status !== 'paid') {
        return res.status(200).json({ skipped: 'not paid' })
      }

      const email =
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.email ||
        null

      if (!email) {
        return res.status(200).json({ skipped: 'no email' })
      }

      const normalizedEmail = email.trim().toLowerCase()
      const plan = session.metadata?.plan || getPlanFromAmount(session.amount_total)
      const stripeCustomerId = session.customer || null

      const { data: existing, error: findError } = await supabase
        .from('members')
        .select('id, email')
        .ilike('email', normalizedEmail)
        .maybeSingle()

      if (findError) {
        console.error('Find member error:', findError.message)
        return res.status(500).json({ error: findError.message })
      }

      const payload = {
        email: normalizedEmail,
        plan,
        plan_status: 'active',
        stripe_customer_id: stripeCustomerId
      }

      let updateError = null

      if (existing) {
        const { error } = await supabase
          .from('members')
          .update(payload)
          .eq('id', existing.id)

        updateError = error
      } else {
        const { error } = await supabase
          .from('members')
          .insert(payload)

        updateError = error
      }

      if (updateError) {
        console.error('Checkout update error:', updateError.message)
        return res.status(500).json({ error: updateError.message })
      }

      console.log(`Checkout completed: ${normalizedEmail} -> ${plan}`)
    }

    // SUBSCRIPTION CREATED / UPDATED
    if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated'
    ) {
      const subscription = event.data.object
      const customerId = subscription.customer

      const amount =
        subscription.items?.data?.[0]?.price?.unit_amount || null

      const plan = getPlanFromAmount(amount)
      const planStatus = subscription.status || null
      const planExpiresAt = toIsoDate(subscription.current_period_end)
      const trialEndsAt = toIsoDate(subscription.trial_end)
      const cancelAtPeriodEnd = subscription.cancel_at_period_end || false

      const { data: existing, error: findError } = await supabase
        .from('members')
        .select('id, email')
        .eq('stripe_customer_id', customerId)
        .maybeSingle()

      if (findError) {
        console.error('Subscription find error:', findError.message)
        return res.status(500).json({ error: findError.message })
      }

      if (!existing) {
        console.log('No member found for customer:', customerId)
        return res.status(200).json({ skipped: 'member not found' })
      }

      const { error: updateError } = await supabase
        .from('members')
        .update({
          plan,
          plan_status: planStatus,
          plan_expires_at: planExpiresAt,
          trial_ends_at: trialEndsAt,
          cancel_at_period_end: cancelAtPeriodEnd
        })
        .eq('id', existing.id)

      if (updateError) {
        console.error('Subscription update error:', updateError.message)
        return res.status(500).json({ error: updateError.message })
      }

      console.log(`Subscription synced: ${existing.email} -> ${plan} (${planStatus})`)
    }

    // SUBSCRIPTION DELETED
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object
      const customerId = subscription.customer

      const { data: existing, error: findError } = await supabase
        .from('members')
        .select('id, email')
        .eq('stripe_customer_id', customerId)
        .maybeSingle()

      if (findError) {
        console.error('Delete find error:', findError.message)
        return res.status(500).json({ error: findError.message })
      }

      if (!existing) {
        return res.status(200).json({ skipped: 'member not found' })
      }

      const { error: updateError } = await supabase
        .from('members')
        .update({
          plan: 'explorer',
          plan_status: 'canceled',
          cancel_at_period_end: false
        })
        .eq('id', existing.id)

      if (updateError) {
        console.error('Delete update error:', updateError.message)
        return res.status(500).json({ error: updateError.message })
      }

      console.log(`Subscription deleted: ${existing.email} -> explorer`)
    }

    // PAYMENT FAILED
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object
      const customerId = invoice.customer

      const { data: existing, error: findError } = await supabase
        .from('members')
        .select('id, email')
        .eq('stripe_customer_id', customerId)
        .maybeSingle()

      if (findError) {
        console.error('Invoice failed find error:', findError.message)
        return res.status(500).json({ error: findError.message })
      }

      if (!existing) {
        return res.status(200).json({ skipped: 'member not found' })
      }

      const { error: updateError } = await supabase
        .from('members')
        .update({
          plan_status: 'past_due'
        })
        .eq('id', existing.id)

      if (updateError) {
        console.error('Invoice failed update error:', updateError.message)
        return res.status(500).json({ error: updateError.message })
      }

      console.log(`Invoice failed: ${existing.email} -> past_due`)
    }

    // PAYMENT SUCCEEDED / RENEWAL
   if (event.type === 'invoice.paid') {
  const invoice = event.data.object
  const customerId = invoice.customer

  const subscriptionId =
    invoice.subscription ||
    invoice.lines?.data?.[0]?.subscription ||
    null

  let planExpiresAt = null

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    planExpiresAt = toIsoDate(subscription.current_period_end)
  }

  console.log('Invoice paid debug:', {
    customerId,
    subscriptionId,
    planExpiresAt
  })

  const { data: existing, error: findError } = await supabase
    .from('members')
    .select('id, email')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()

  if (findError) {
    console.error('Invoice paid find error:', findError.message)
    return res.status(500).json({ error: findError.message })
  }

  if (!existing) {
    return res.status(200).json({ skipped: 'member not found' })
  }

  const updatePayload = {
    plan_status: 'active'
  }

  if (planExpiresAt) {
    updatePayload.plan_expires_at = planExpiresAt
  }

  const { error: updateError } = await supabase
    .from('members')
    .update(updatePayload)
    .eq('id', existing.id)

  if (updateError) {
    console.error('Invoice paid update error:', updateError.message)
    return res.status(500).json({ error: updateError.message })
  }

  console.log(`Invoice paid: ${existing.email} -> active`)
}
    
return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Handler error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
