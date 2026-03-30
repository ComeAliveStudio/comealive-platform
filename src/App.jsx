import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { loadStripe } from '@stripe/stripe-js'

const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY
const PRICES = {
  professional: 'price_1XXXXXXX',
  mastery: 'price_2XXXXXXX',
}

export default function Home() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState(null)
  const [stripe, setStripe] = useState(null)

  // Caricamento Stripe una sola volta
  useEffect(() => {
    loadStripe(STRIPE_KEY).then((s) => setStripe(s))
  }, [])

  // Recupera utente loggato e piano
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        // recupera piano dall'utente nel DB
        const { data } = await supabase.from('members').select('plan').eq('id', session.user.id).single()
        setPlan(data?.plan || null)
      }
    }
    getUser()
  }, [])

  const isPremium = plan === 'professional' || plan === 'mastery'

  const handleJoin = async (priceId) => {
    if (!user) { alert('Devi prima accedere'); return }
    if (!stripe) { alert('Stripe sta caricando...'); return }

    console.log('Price ID:', priceId)
    console.log('Stripe Key:', STRIPE_KEY)

    await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/?payment=success`,
      cancelUrl: `${window.location.origin}/`,
    })
  }

  // Controlla query param success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('payment') === 'success') {
      alert('Pagamento completato!');
      // ricarica piano dall'API Supabase
      supabase.from('members').select('plan').eq('id', user.id).single().then(({ data }) => setPlan(data?.plan))
    }
  }, [user])

  return (
    <div>
      <header>
        <nav>
          <a href="#hero">Home</a>
          <a href="#about">About</a>
          <a href="#library">Library</a>
          <a href="#booking">Booking</a>
          <a href="#tiers">Join</a>
        </nav>
      </header>

      <section id="hero">
        <h1>Benvenuto alla piattaforma</h1>
        {!user && <button onClick={() => supabase.auth.signInWithOtp({ email: prompt('Inserisci la tua email') })}>Accedi / Registrati</button>}
      </section>

      <section id="about">
        <h2>About</h2>
        <p>Informazioni sulla piattaforma e sui corsi.</p>
      </section>

      <section id="library">
        <h2>Library</h2>
        <div>
          <div>
            <h3>Video Base</h3>
            <video src="/video-base.mp4" controls />
          </div>
          {isPremium && (
            <div>
              <h3>Video Professional / Mastery</h3>
              <video src="/video-premium.mp4" controls />
            </div>
          )}
          {!isPremium && <p>Iscriviti a Professional o Mastery per accedere ai contenuti premium!</p>}
        </div>
      </section>

      <section id="booking">
        <h2>Booking</h2>
        <form action="https://formspree.io/f/yourformid" method="POST">
          <input type="text" name="name" placeholder="Nome" required />
          <input type="email" name="email" placeholder="Email" required />
          <select name="session" required>
            <option value="session1">Session 1</option>
            <option value="session2">Session 2</option>
          </select>
          <textarea name="message" placeholder="Messaggio"></textarea>
          <button type="submit">Prenota</button>
        </form>
      </section>

      <section id="tiers">
        <h2>Join</h2>
        <button className="tier-btn tier-btn-filled" onClick={() => handleJoin(PRICES.professional)}>Join Professional</button>
        <button className="tier-btn tier-btn-outline" onClick={() => handleJoin(PRICES.mastery)}>Join Mastery</button>
      </section>
    </div>
  )
}
