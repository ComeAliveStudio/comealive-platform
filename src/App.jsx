import React, { useState } from "react"
import "./App.css"

// ── STRIPE PAYMENT LINKS ─────────────────────────────────────────────────────
const PAYMENT_LINKS = {
  professional: "https://buy.stripe.com/test_dRmeVd8IDdED5R00TggUM00",
  mastery:      "https://buy.stripe.com/test_6oUbJ15wr8kjenwgSegUM01",
  filmmaking:   "https://buy.stripe.com/test_28E7sL9MHdED3ISfOagUM02",
  relationship: "https://buy.stripe.com/test_00w4gz0c77gfdjs6dAgUM03",
  mindset:      "https://buy.stripe.com/test_bJe3cv7Ez587djs0TggUM04",
}

// ── FUNZIONE PER APRIRE STRIPE ───────────────────────────────────────────────
function goToStripe(planKey) {
  const url = PAYMENT_LINKS[planKey]
  if (!url || url.includes("REPLACE")) {
    alert("Payment link not configured yet. Please add your Stripe Payment Links.")
    return
  }
  window.location.href =
    url +
    "?success_url=" +
    encodeURIComponent(window.location.origin + "/?payment=success") +
    "&cancel_url=" +
    encodeURIComponent(window.location.origin)
}

// ── COMPONENTE PRINCIPALE ───────────────────────────────────────────────────
export default function App() {
  const [selectedTab, setSelectedTab] = useState("library")

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Coaching App</h1>
        <nav>
          <button onClick={() => setSelectedTab("library")}>Library</button>
          <button onClick={() => setSelectedTab("membership")}>Membership</button>
        </nav>
      </header>

      <main>
        {selectedTab === "library" && (
          <section className="library">
            <h2>Library</h2>
            <div className="library-grid">
              {/* Qui rimane tutto il tuo layout originale */}
            </div>
          </section>
        )}

        {selectedTab === "membership" && (
          <section className="membership">
            <h2>Membership & Sessions</h2>

            <div className="membership-tiers">
              <div className="tier-card">
                <h3>Professional Membership</h3>
                <button
                  className="tier-btn tier-btn-filled"
                  onClick={() => goToStripe("professional")}
                >
                  Join Professional
                </button>
              </div>

              <div className="tier-card">
                <h3>Mastery Membership</h3>
                <button
                  className="tier-btn tier-btn-outline"
                  onClick={() => goToStripe("mastery")}
                >
                  Join Mastery
                </button>
              </div>
            </div>

            <div className="sessions">
              <h3>Book a Session</h3>
              <button
                className="session-type"
                onClick={() => goToStripe("filmmaking")}
              >
                Filmmaking Strategy
              </button>

              <button
                className="session-type"
                onClick={() => goToStripe("relationship")}
              >
                Relationship Clarity
              </button>

              <button
                className="session-type"
                onClick={() => goToStripe("mindset")}
              >
                Mindset Coaching
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
