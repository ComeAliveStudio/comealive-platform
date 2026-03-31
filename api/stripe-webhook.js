
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
    const plan = session.metadata?.plan || 'explorer'

    if (email) {
      const { error } = await supabase
        .from('members')
        .upsert({ email, plan }, { onConflict: 'email' })

      if (error) {
        console.error('Supabase update error:', error.message)
        return res.status(500).json({ error: error.message })
      }

      console.log(`Updated ${email} -> ${plan}`)
    }
  }

  return res.status(200).json({ received: true })
}
