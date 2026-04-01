import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PRICE_TO_PLAN = {
  'price_1TGMXNE72B8UAf4G0JSemNG5': 'professional',
  'price_1TGMaOE72B8UAf4Gjks176aW': 'mastery'
}

async function getRawBody(req) {
  const chunks = []

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

function toIsoOrNull(unixSeconds) {
  return unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null
}

async function findMemberByEmail(email) {
  if (!email) return { data: null, error: null }

  const normalizedEmail = email.trim().toLowerCase()

  return await supabase
    .from('members')
    .select('id, email, plan, stripe_customer_id, stripe_session_id')
    .ilike('email', normalizedEmail)
    .maybeSingle()
}

async function findMemberByCustomerId(customerId) {
  if (!customerId) return { data: null, error: null }

  return await supabase
    .from('members')
    .select('id, email, plan, stripe_customer_id, stripe_session_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()
}

async function updateMemberById(id, updates) {
  return await supabase
    .from('members')
    .update(updates)
    .eq('id', id)
}

async function insertMember(payload) {
  return await supabase
    .from('members')
    .insert(payload)
}

async function upsertMemberByEmail(email, updates) {
  const normalizedEmail = email.trim().toLowerCase()
  const { data: existing, error: findError } = await findMemberByEmail(normalizedEmail)

  if (findError) return { error: findError }

  if (existing) {
    return await updateMemberById(existing.id, updates)
  }

  return await insertMember({
    email: normalizedEmail,
    ...updates
  })
}

function getPlanFromPriceId(priceId) {
  return PRICE_TO_PLAN[priceId] || null
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
    // 1) Checkout completed
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

      const normalizedEmail = email?.trim().toLowerCase() || null
      const stripeCustomerId = session.customer || null
      const stripeSessionId = session.id || null
      const stripeSubscriptionId = session.subscription || null

      let plan = null

      if (session.metadata?.plan) {
        plan = session.metadata.plan
      } else {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 10
        })

        const firstPriceId = lineItems.data?.[0]?.price?.id || null
        plan = getPlanFromPriceId(firstPriceId)
      }

      if (!normalizedEmail || !plan) {
        return res.status(200).json({
          received: true,
          skipped: 'missing email or plan'
        })
      }

      const { error } = await upsertMemberByEmail(normalizedEmail, {
        plan,
        plan_status: 'active',
        stripe_customer_id: stripeCustomerId,
        stripe_session_id: stripeSessionId,
        plan_expires_at: null
      })

      if (error) {
        console.error('Checkout update error:', error.message)
        return res.status(500).json({ error: error.message })
      }

      console.log(`Checkout completed: ${normalizedEmail} -> ${plan}`)
    }

    // 2) Subscription created or updated
    if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated'
    ) {
      const subscription = event.data.object

      const stripeCustomerId = subscription.customer
      const stripeSubscriptionId = subscription.id
      const planStatus = subscription.status
      const cancelAtPeriodEnd = subscription.cancel_at_period_end || false
      const trialEndsAt = toIsoOrNull(subscription.trial_end)
      const planExpiresAt = toIsoOrNull(subscription.current_period_end)

      const priceId = subscription.items?.data?.[0]?.price?.id || null
      const plan = getPlanFromPriceId(priceId)

      const { data: member, error: findError } = await findMemberByCustomerId(stripeCustomerId)

      if (findError) {
        console.error('Subscription find error:', findError.message)
        return res.status(500).json({ error: findError.message })
      }

      if (!member) {
        console.log('No member found for subscription event', {
          stripeCustomerId,
          stripeSubscriptionId
        })
        return res.status(200).json({ skipped: 'member not found for customer' })
      }

      const updates = {
        stripe_customer_id: stripeCustomerId,
        stripe_session_id: stripeSubscriptionId,
        plan_status: planStatus,
        cancel_at_period_end: cancelAtPeriodEnd,
        trial_ends_at: trialEndsAt,
        plan_expires_at: planExpiresAt
      }

      if (plan) {
        updates.plan = plan
      }

      if (planStatus === 'canceled' || event.type === 'customer.subscription.deleted') {
        updates.plan = 'explorer'
      }

      const { error } = await updateMemberById(member.id, updates)

      if (error) {
        console.error('Subscription update error:', error.message)
        return res.status(500).json({ error: error.message })
      }

      console.log(`Subscription synced: ${member.email} -> ${updates.plan || member.plan} (${planStatus})`)
    }

    // 3) Subscription deleted
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object
      const stripeCustomerId = subscription.customer

      const { data: member, error: findError } = await findMemberByCustomerId(stripeCustomerId)

      if (findError) {
        console.error('Subscription delete find error:', findError.message)
        return res.status(500).json({ error: findError.message })
      }

      if (!member) {
        return res.status(200).json({ skipped: 'member not found for delete' })
      }

      const { error } = await updateMemberById(member.id, {
        plan: 'explorer',
        plan_status: 'canceled',
        stripe_session_id: null,
        cancel_at_period_end: false,
        trial_ends_at: null
      })

      if (error) {
        console.error('Subscription delete update error:', error.message)
        return res.status(500).json({ error: error.message })
      }

      console.log(`Subscription deleted: ${member.email} -> explorer`)
    }

    // 4) Invoice paid (renewal success)
    if (event.type === 'invoice.paid') {
      const invoice = event.data.object
      const stripeCustomerId = invoice.customer
      const stripeSubscriptionId = invoice.subscription || null

      const { data: member, error: findError } = await findMemberByCustomerId(stripeCustomerId)

      if (findError) {
        console.error('Invoice paid find error:', findError.message)
        return res.status(500).json({ error: findError.message })
      }

      if (!member) {
        return res.status(200).json({ skipped: 'member not found for invoice.paid' })
      }

      let planExpiresAt = null

      if (stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
        planExpiresAt = toIsoOrNull(subscription.current_period_end)
      }

      const { error } = await updateMemberById(member.id, {
        plan_status: 'active',
        plan_expires_at: planExpiresAt
      })

      if (error) {
        console.error('Invoice paid update error:', error.message)
        return res.status(500).json({ error: error.message })
      }

      console.log(`Invoice paid: ${member.email} remains active`)
    }

    // 5) Invoice payment failed
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object
      const stripeCustomerId = invoice.customer

      const { data: member, error: findError } = await findMemberByCustomerId(stripeCustomerId)

      if (findError) {
        console.error('Invoice failed find error:', findError.message)
        return res.status(500).json({ error: findError.message })
      }

      if (!member) {
        return res.status(200).json({ skipped: 'member not found for invoice.payment_failed' })
      }

      const { error } = await updateMemberById(member.id, {
        plan_status: 'past_due'
      })

      if (error) {
        console.error('Invoice failed update error:', error.message)
        return res.status(500).json({ error: error.message })
      }

      console.log(`Invoice failed: ${member.email} -> past_due`)
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Handler error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
