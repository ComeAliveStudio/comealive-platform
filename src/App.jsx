// ── IMPORTS ────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── ENV ─────────────────────────────────────────────────────────────────────
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY;
const STRIPE_KEY    = import.meta.env.VITE_STRIPE_KEY;
const FORMSPREE     = "https://formspree.io/f/xgopawdr";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── PRICES ──────────────────────────────────────────────────────────────────
const PRICES = {
  professional: "price_1TGMXNE72B8UAf4G0JSemNG5",
  mastery:      "price_1TGMaOE72B8UAf4Gjks176aW",
  discovery:    "price_1TGR3BE72B8UAf4GM1udhJHX",
  filmmaking:   "price_1TGMflE72B8UAf4GqOpfrAXO",
  relationship: "price_1TGMgME72B8UAf4GkqcoJwBQ",
  mindset:      "price_1TGMggE72B8UAf4GWCzUx3gF",
};

// ── STRIPE PAYMENT LINKS ─────────────────────────────────────────────────────
const PAYMENT_LINKS = {
  professional: "https://buy.stripe.com/test_dRmeVd8IDdED5R00TggUM00",
  mastery:      "https://buy.stripe.com/test_6oUbJ15wr8kjenwgSegUM01",
  filmmaking:   "https://buy.stripe.com/test_28E7sL9MHdED3ISfOagUM02",
  relationship: "https://buy.stripe.com/test_00w4gz0c77gfdjs6dAgUM03",
  mindset:      "https://buy.stripe.com/test_bJe3cv7Ez587djs0TggUM04",
};

function goToStripe(planKey) {
  const url = PAYMENT_LINKS[planKey];
  if (!url || url.includes("REPLACE")) {
    alert("Payment link not configured yet. Please add your Stripe Payment Links.");
    return;
  }
  window.location.href = url + "?success_url=" + encodeURIComponent(window.location.origin + "/?payment=success") + "&cancel_url=" + encodeURIComponent(window.location.origin);
}

// ── AUTH ─────────────────────────────────────────────────────────────────────
function useAuth() {
  const [user, setUser]   = useState(null);
  const [plan, setPlan]   = useState("explorer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) fetchPlan(data.session.user.email);
      else setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPlan(session.user.email);
      else { setPlan("explorer"); setLoading(false); }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchPlan = async (email) => {
    const { data } = await supabase.from("members").select("plan").eq("email", email).single();
    setPlan(data?.plan ?? "explorer");
    setLoading(false);
  };

  const isPremium = plan === "professional" || plan === "mastery";
  return { user, plan, isPremium, loading };
}

// ── COMPONENTS ───────────────────────────────────────────────────────────────
function NavBar({ user }) {
  return (
    <nav className="navbar">
      <a href="#hero">Home</a>
      <a href="#tiers">Memberships</a>
      <a href="#library">Library</a>
      <a href="#booking">Booking</a>
      {user ? <span>Welcome, {user.email}</span> : <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>Login</button>}
    </nav>
  );
}

function Hero() {
  return (
    <section id="hero">
      <h1>Welcome to Our Platform</h1>
      <p>Choose your membership or session below.</p>
    </section>
  );
}

function Tiers() {
  return (
    <section id="tiers">
      <h2>Memberships</h2>
      <div className="tier-list">
        <div className="tier">
          <h3>Professional</h3>
          <button className="tier-btn tier-btn-filled" onClick={() => goToStripe('professional')}>Join Professional</button>
        </div>
        <div className="tier">
          <h3>Mastery</h3>
          <button className="tier-btn tier-btn-outline" onClick={() => goToStripe('mastery')}>Join Mastery</button>
        </div>
      </div>
      <h2>Sessions</h2>
      <div className="session-list">
        <button onClick={() => goToStripe('filmmaking')}>Filmmaking Strategy</button>
        <button onClick={() => goToStripe('relationship')}>Relationship Clarity</button>
        <button onClick={() => goToStripe('mindset')}>Mindset Coaching</button>
      </div>
    </section>
  );
}

function Library() {
  return (
    <section id="library">
      <h2>Library</h2>
      <p>Access resources even before membership. You can return later to join a plan.</p>
    </section>
  );
}

function Booking() {
  return (
    <section id="booking">
      <h2>Book a Call</h2>
      <form action={FORMSPREE} method="POST">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <textarea name="message" placeholder="Message"></textarea>
        <button type="submit">Send</button>
      </form>
    </section>
  );
}

// ── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { user, plan, isPremium, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <NavBar user={user} />
      <Hero />
      <Tiers />
      <Library />
      <Booking />
      <footer>
        <p>&copy; 2026 Your Company</p>
      </footer>
    </div>
  );
}
