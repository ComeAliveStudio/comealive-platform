import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const email = session.customer_details?.email

    let plan = 'explorer'

    if (session.metadata?.plan) {
      plan = session.metadata.plan
    } else if (session.amount_total === 2900) {
      plan = 'professional'
    } else if (session.amount_total === 9700) {
      plan = 'mastery'
    }

    if (email) {
      const { data: existing, error: findError } = await supabase
        .from('members')
        .select('email')
        .eq('email', email)
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
          .eq('email', email)

        updateError = error
      } else {
        const { error } = await supabase
          .from('members')
          .insert({ email, plan })

        updateError = error
      }

      if (updateError) {
        console.error('Supabase update error:', updateError.message)
        return res.status(500).json({ error: updateError.message })
      }

      console.log(`Updated ${email} -> ${plan}`)
    }
  }

  return res.status(200).json({ received: true })
}
