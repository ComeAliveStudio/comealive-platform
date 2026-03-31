import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

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
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      const email =
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.email ||
        null

      let plan = 'explorer'

      if (session.metadata?.plan) {
        plan = session.metadata.plan
      } else if (session.amount_total === 2900) {
        plan = 'professional'
      } else if (session.amount_total === 9700) {
        plan = 'mastery'
      }

      console.log('Stripe session debug:', {
        email,
        amount_total: session.amount_total,
        metadata: session.metadata,
        mode: session.mode
      })

      if (!email) {
        return res.status(200).json({ received: true, skipped: 'no email' })
      }

      const normalizedEmail = email.trim().toLowerCase()

      const { data: existing, error: findError } = await supabase
        .from('members')
        .select('id, email, plan')
        .ilike('email', normalizedEmail)
        .maybeSingle()

      if (findError) {
        console.error('Supabase find error:', findError.message)
        return res.status(500).json({ error: findError.message })
      }

      let updateError = null

      if (existing) {
        const { error } = await supabase
          .from('members')
          .update({ plan })
          .eq('id', existing.id)

        updateError = error
      } else {
        const { error } = await supabase
          .from('members')
          .insert({ email: normalizedEmail, plan })

        updateError = error
      }

      if (updateError) {
        console.error('Supabase update error:', updateError.message)
        return res.status(500).json({ error: updateError.message })
      }

      console.log(`Updated ${normalizedEmail} -> ${plan}`)
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Handler error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
