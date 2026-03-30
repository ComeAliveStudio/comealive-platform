// ── STRIPE CHECKOUT DIRETTO ─────────────────────────────────────────────────────
const STRIPE_LINKS = {
  filmmaking:   "https://buy.stripe.com/test_4gwfY5fXx5LQ4VQcMM", // link diretto a Stripe per Filmmaking Strategy
  relationship: "https://buy.stripe.com/test_8wM9B3aQy5LQ4VQfZ0", // link diretto per Relationship Clarity
  mindset:      "https://buy.stripe.com/test_6oE8B3bQy5LQ4VQdRS", // link diretto per Mindset Coaching
  professional: "https://buy.stripe.com/test_9AQeY5fXx5LQ4VQ8wZ", // link diretto Professional membership
  mastery:      "https://buy.stripe.com/test_7gwfY5fXx5LQ4VQh1R"  // link diretto Mastery membership
}

// ── TIERS ─────────────────────────────────────────────────────────────────────
function Tiers({ setPage }) {
  return (
    <section style={{background:'var(--ink)'}}>
      <div className="max-w text-center">
        <div className="section-label" style={{justifyContent:'center'}}>Membership</div>
        <h2>Choose your <em>level of access</em></h2>
        <p style={{color:'var(--mist)', maxWidth:480, margin:'0 auto', fontSize:'0.9rem'}}>Free content to start. Premium when you're ready to go deeper.</p>
        <div className="tiers-grid">
          <div className="tier-card">
            <div className="tier-name">Explorer</div>
            <div className="tier-price">€0 <span>/ forever</span></div>
            <div className="tier-desc">Access to all free episodes across every track.</div>
            <ul className="tier-features">
              <li>Free episodes in all 4 tracks</li>
              <li>Podcast access on Spotify</li>
              <li>Newsletter & updates</li>
            </ul>
            <button className="tier-btn tier-btn-outline" onClick={() => setPage('library')}>Start Free</button>
          </div>
          <div className="tier-card featured">
            <div className="tier-name">Professional</div>
            <div className="tier-price">€29 <span>/ month</span></div>
            <div className="tier-desc">Full library access plus monthly live session.</div>
            <ul className="tier-features">
              <li>All free + premium episodes</li>
              <li>Monthly group live Q&A</li>
              <li>Downloadable frameworks & PDFs</li>
              <li>Priority booking — 20% discount</li>
              <li>Progress tracking dashboard</li>
            </ul>
            <button className="tier-btn tier-btn-filled" onClick={() => window.location.href = STRIPE_LINKS.professional}>Join Professional</button>
          </div>
          <div className="tier-card">
            <div className="tier-name">Mastery</div>
            <div className="tier-price">€97 <span>/ month</span></div>
            <div className="tier-desc">Full access plus 1-on-1 coaching session per month.</div>
            <ul className="tier-features">
              <li>Everything in Professional</li>
              <li>1× private coaching session/month</li>
              <li>Direct messaging access</li>
              <li>Custom growth roadmap</li>
              <li>Early access to new courses</li>
            </ul>
            <button className="tier-btn tier-btn-outline" onClick={() => window.location.href = STRIPE_LINKS.mastery}>Join Mastery</button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── BOOKING ───────────────────────────────────────────────────────────────────
function Booking({ isPremium }) {
  const [selected, setSelected]   = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const sessions = [
    { id:1, name:"Discovery Session",    meta:"45 min · Free",  link: null },
    { id:2, name:"Filmmaking Strategy",  meta:"60 min · €60",   link: STRIPE_LINKS.filmmaking },
    { id:3, name:"Relationship Clarity", meta:"60 min · €90",   link: STRIPE_LINKS.relationship },
    { id:4, name:"Mindset Coaching",     meta:"60 min · €120",  link: STRIPE_LINKS.mindset },
  ]

  return (
    <section style={{padding:'6rem 3rem'}}>
      <div className="max-w text-center">
        <div className="section-label" style={{justifyContent:'center'}}>Book a Session</div>
        <h2>Pick your <em>session</em></h2>
        <p style={{color:'var(--mist)', maxWidth:480, margin:'0 auto', fontSize:'0.9rem'}}>
          Free sessions available for everyone. Paid sessions unlock with booking.
        </p>
        <div className="booking-grid">
          {sessions.map((s, idx) => (
            <div key={s.id} className={`session-type ${selected===idx?'active':''}`} onClick={() => setSelected(idx)}>
              <div className="session-name">{s.name}</div>
              <div className="session-meta">{s.meta}</div>
              {s.link && (
                <button className="btn-primary" style={{marginTop:'0.8rem'}} onClick={() => window.location.href = s.link}>
                  Book Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
