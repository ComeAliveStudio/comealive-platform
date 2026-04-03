import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body || {}

    if (!email) {
      return res.status(400).json({ error: 'Missing email' })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const { data: member, error } = await supabase
      .from('members')
      .select('stripe_customer_id')
      .ilike('email', normalizedEmail)
      .maybeSingle()

    if (error) {
      console.error('Portal member lookup error:', error.message)
      return res.status(500).json({ error: error.message })
    }

    if (!member?.stripe_customer_id) {
      return res.status(404).json({ error: 'No Stripe customer found' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: member.stripe_customer_id,
           return_url: `${req.headers.origin || process.env.APP_URL || 'https://app.comealive.vision'}/?page=dashboard`
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Create portal session error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
