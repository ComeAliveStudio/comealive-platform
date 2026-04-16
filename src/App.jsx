import { useState, useEffect, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY
const STRIPE_KEY    = import.meta.env.VITE_STRIPE_KEY
const FORMSPREE = "https://formspree.io/f/xgopawdr"
const SPOTIFY_URL = "https://player.vimeo.com/video/958087223?h=c3900df67f"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const ADDONS = {
  1: "filmmaking_book",
  2: "pro_growth_book",
  3: "relationship_book",
  4: "mindset_book",
  5: "advanced_relationship_book"
}

const PRICES = {
  professional: "price_1TGMXNE72B8UAf4G0JSemNG5",
  mastery:      "price_1TGMaOE72B8UAf4Gjks176aW",
  discovery:    "price_1TGR3BE72B8UAf4GM1udhJHX",
  filmmaking:   "price_1TGMflE72B8UAf4GqOpfrAXO",
  relationship: "price_1TGMgME72B8UAf4GkqcoJwBQ",
  mindset:      "price_1TGMggE72B8UAf4GWCzUx3gF",
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&family=Outfit:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0e0d0b; --parchment: #f5f0e8; --warm-white: #faf8f3;
    --gold: #b8955a; --gold-light: #d4b07a; --gold-dim: #7a5f35;
    --slate: #2a2825; --mist: #9e9890; --border: rgba(184,149,90,0.25);
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'Outfit', sans-serif; background: var(--ink); color: var(--parchment); font-weight: 300; line-height: 1.6; overflow-x: hidden; }
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 3rem; background: rgba(14,13,11,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
  .nav-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 400; letter-spacing: 0.15em; color: var(--gold); text-transform: uppercase; cursor: pointer; }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a { font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mist); text-decoration: none; transition: color 0.2s; cursor: pointer; }
  .nav-links a:hover { color: var(--gold); }
  .nav-cta { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.6rem 1.4rem; border: 1px solid var(--gold); background: transparent; color: var(--gold); cursor: pointer; transition: all 0.2s; font-family: 'Outfit', sans-serif; }
  .nav-cta:hover { background: var(--gold); color: var(--ink); }
  .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 8rem 3rem 4rem; position: relative; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 70% 50%, rgba(184,149,90,0.06) 0%, transparent 70%), linear-gradient(160deg, #0e0d0b 0%, #1a1713 50%, #0e0d0b 100%); }
  .hero-grain { position: absolute; inset: 0; opacity: 0.035; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
  .hero-content { position: relative; z-index: 1; max-width: 760px; }
  .hero-eyebrow { font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; }
  .hero-eyebrow::after { content: ''; display: block; width: 40px; height: 1px; background: var(--gold); }
  .hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(3.2rem, 7vw, 6rem); font-weight: 300; line-height: 1.05; color: var(--parchment); margin-bottom: 1rem; }
  .hero h1 em { font-style: italic; color: var(--gold); }
  .hero-sub { font-size: 1rem; color: var(--mist); max-width: 480px; margin-bottom: 2.5rem; font-weight: 300; line-height: 1.7; }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn-primary { padding: 0.9rem 2.2rem; background: var(--gold); color: var(--ink); border: none; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; transition: all 0.2s; }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); }
  .btn-ghost { padding: 0.9rem 2.2rem; background: transparent; color: var(--parchment); border: 1px solid rgba(245,240,232,0.3); cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 300; transition: all 0.2s; }
  .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
  .hero-scroll { position: absolute; bottom: 2.5rem; left: 3rem; font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; color: var(--mist); text-transform: uppercase; display: flex; align-items: center; gap: 0.8rem; }
  .hero-scroll::before { content: ''; display: block; width: 1px; height: 40px; background: var(--mist); animation: scrollPulse 2s ease-in-out infinite; }
  @keyframes scrollPulse { 0%,100%{opacity:0.3}50%{opacity:1} }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmerPulse { 0%,100%{opacity:0.3;transform:scaleX(0.92)} 50%{opacity:1;transform:scaleX(1)} }
  @keyframes badgeSheen { 0%{background-position:100% 0} 50%{background-position:0% 0} 100%{background-position:100% 0} }
  .loading-screen { min-height:100vh; background:var(--ink); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.6rem; }
  .loading-wordmark { font-family:'Cormorant Garamond', serif; font-size:1.2rem; letter-spacing:0.28em; color:var(--gold-dim); text-transform:uppercase; }
  .loading-bar { width:120px; height:1px; background:var(--gold); animation:shimmerPulse 1.8s ease-in-out infinite; transform-origin:center; }
  section { padding: 6rem 3rem; }
  .section-label { font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 3rem; display: flex; align-items: center; gap: 1rem; }
  .section-label::after { content: ''; flex: 1; max-width: 60px; height: 1px; background: var(--border); }
  h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 300; color: var(--parchment); line-height: 1.15; margin-bottom: 1.2rem; }
  h2 em { font-style: italic; color: var(--gold); }
  .about { background: var(--slate); }
  .about-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 5rem; align-items: center; max-width: 1100px; margin: 0 auto; }
  .about-portrait { aspect-ratio: 3/4; background: var(--ink); border: 1px solid var(--border); position: relative; overflow: hidden; }
  .about-portrait-inner { width: 100%; height: 100%; background: linear-gradient(160deg, #2a2825 0%, #1a1713 100%); display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 4rem; color: var(--gold-dim); }
  .about-portrait::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 40%; background: linear-gradient(transparent, var(--slate)); }
  .about-text p { color: var(--mist); margin-bottom: 1.2rem; font-size: 0.95rem; }
  .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2.5rem; }
  .stat { border-left: 1px solid var(--border); padding-left: 1.2rem; }
  .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; color: var(--gold); font-weight: 300; line-height: 1; }
  .stat-label { font-size: 0.72rem; color: var(--mist); letter-spacing: 0.08em; margin-top: 0.3rem; }
  .tiers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1000px; margin: 3rem auto 0; }
  .tier-card { border: 1px solid var(--border); padding: 2.5rem; position: relative; transition: border-color 0.2s; background: var(--slate); }
  .tier-card:hover { border-color: var(--gold); }
  .tier-card.featured { border-color: var(--gold); background: #1e1c18; }
  .tier-card.featured::before { content: 'Most Popular'; position: absolute; top: -1px; left: 50%; transform: translateX(-50%); background: linear-gradient(90deg, var(--gold-dim) 0%, var(--gold) 40%, var(--gold-light) 60%, var(--gold) 100%); background-size: 200% 100%; animation: badgeSheen 3s ease-in-out infinite; color: var(--ink); font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; padding: 0.3rem 1rem; font-weight: 500; white-space: nowrap; }
  .tier-name { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: var(--parchment); margin-bottom: 0.5rem; }
  .tier-price { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; color: var(--gold); font-weight: 300; line-height: 1; margin: 1rem 0 0.3rem; }
  .tier-price span { font-size: 1rem; color: var(--mist); }
  .tier-desc { font-size: 0.82rem; color: var(--mist); margin-bottom: 1.8rem; }
  .tier-features { list-style: none; margin-bottom: 2rem; }
  .tier-features li { font-size: 0.83rem; color: var(--mist); padding: 0.5rem 0; border-bottom: 1px solid rgba(184,149,90,0.1); display: flex; align-items: center; gap: 0.6rem; }
  .tier-features li::before { content: '→'; color: var(--gold); font-size: 0.7rem; }
  .tier-btn { width: 100%; padding: 0.85rem; font-family: 'Outfit', sans-serif; font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .tier-btn-outline { background: transparent; border: 1px solid var(--border); color: var(--mist); }
  .tier-btn-outline:hover { border-color: var(--gold); color: var(--gold); }
  .tier-btn-filled { background: var(--gold); border: 1px solid var(--gold); color: var(--ink); font-weight: 500; }
  .tier-btn-filled:hover { background: var(--gold-light); }
  .library { background: var(--ink); }
  .course-tabs { display: flex; gap: 0; margin-bottom: 3rem; border-bottom: 1px solid var(--border); }
  .course-tab { padding: 0.8rem 1.8rem; background: none; border: none; font-family: 'Outfit', sans-serif; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; color: var(--mist); border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; }
  .course-tab.active { color: var(--gold); border-bottom-color: var(--gold); }
  .videos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
  .video-card { background: var(--slate); border: 1px solid var(--border); overflow: hidden; cursor: pointer; transition: all 0.2s; }
  .video-card:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(184,149,90,0.12); }
  .video-thumb { aspect-ratio: 16/9; background: linear-gradient(135deg, #1a1713 0%, #2a2825 100%); display: flex; align-items: center; justify-content: center; position: relative; }
  .video-thumb-icon { width: 44px; height: 44px; border-radius: 50%; background: rgba(184,149,90,0.15); border: 1px solid var(--gold); display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: 1rem; }
  .video-lock { position: absolute; top: 0.8rem; right: 0.8rem; background: rgba(14,13,11,0.8); padding: 0.3rem 0.6rem; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mist); border: 1px solid var(--border); font-family: 'DM Mono', monospace; }
  .video-free { background: rgba(184,149,90,0.15); color: var(--gold); border-color: var(--gold-dim); }
  .video-info { padding: 1.2rem; }
  .video-duration { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--mist); letter-spacing: 0.1em; margin-bottom: 0.4rem; }
  .video-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: var(--parchment); line-height: 1.3; margin-bottom: 0.4rem; }
  .video-desc { font-size: 0.78rem; color: var(--mist); }
  .booking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; max-width: 900px; margin: 2rem auto 0; }
  .session-type { border: 1px solid var(--border); padding: 1.5rem; cursor: pointer; transition: all 0.2s; background: var(--ink); margin-bottom: 1rem; }
  .session-type:hover, .session-type.active { border-color: var(--gold); }
  .session-type.active { background: rgba(184,149,90,0.05); }
  .session-name { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: var(--parchment); margin-bottom: 0.3rem; }
  .session-meta { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: var(--gold); letter-spacing: 0.1em; }
  .booking-form { display: flex; flex-direction: column; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-label { font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mist); font-family: 'DM Mono', monospace; }
  .form-input, .form-select, .form-textarea { background: var(--ink); border: 1px solid var(--border); color: var(--parchment); padding: 0.75rem 1rem; font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 300; transition: border-color 0.2s; width: 100%; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--gold); }
  .form-textarea { resize: vertical; min-height: 100px; }
  .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 5rem; max-width: 950px; margin: 2rem auto 0; align-items: start; }
  .contact-detail { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  .contact-detail-icon { width: 36px; height: 36px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: 0.9rem; flex-shrink: 0; }
  .contact-detail-text { font-size: 0.85rem; color: var(--mist); }
  .contact-detail-text strong { color: var(--parchment); display: block; font-weight: 400; }
  .dashboard { min-height: 100vh; background: var(--ink); padding-top: 5rem; }
  .dash-grid { display: grid; grid-template-columns: 260px 1fr; min-height: calc(100vh - 5rem); }
  .dash-sidebar { background: var(--slate); border-right: 1px solid var(--border); padding: 2rem 0; }
  .dash-nav-item { display: flex; align-items: center; gap: 0.8rem; padding: 0.9rem 1.8rem; cursor: pointer; transition: all 0.15s; font-size: 0.8rem; letter-spacing: 0.08em; color: var(--mist); border-left: 2px solid transparent; }
  .dash-nav-item:hover { color: var(--parchment); background: rgba(184,149,90,0.05); }
  .dash-nav-item.active { color: var(--gold); border-left-color: var(--gold); background: rgba(184,149,90,0.05); }
  .dash-content { padding: 2.5rem 3rem; }
  .dash-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
  .dash-card { background: var(--slate); border: 1px solid var(--border); padding: 1.8rem; }
  .dash-card-label { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mist); margin-bottom: 0.8rem; }
  .dash-card-value { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; color: var(--gold); font-weight: 300; line-height: 1; }
  .dash-card-sub { font-size: 0.75rem; color: var(--mist); margin-top: 0.4rem; }
  .progress-bar { height: 3px; background: var(--border); margin-top: 1rem; border-radius: 2px; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--gold-dim), var(--gold)); border-radius: 2px; transition: width 0.6s ease; box-shadow: 0 0 6px rgba(184,149,90,0.4); }
  .plan-badge { display:inline-flex; align-items:center; padding:0.3rem 0.8rem; border:1px solid var(--border); font-family:'DM Mono', monospace; font-size:0.62rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--mist); }
  .plan-badge.active { border-color:var(--gold); color:var(--gold); background:rgba(184,149,90,0.06); }
  footer { padding: 3rem; background: var(--slate); border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
  .footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 1rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); }
  .footer-links { display: flex; gap: 2rem; }
  .footer-links a { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--mist); text-decoration: none; transition: color 0.2s; cursor: pointer; }
  .footer-links a:hover { color: var(--gold); }
  .footer-copy { font-size: 0.7rem; color: var(--mist); }
  .success-msg { background: rgba(184,149,90,0.1); border: 1px solid var(--gold); padding: 2rem; text-align: center; font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: var(--gold); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(14,13,11,0.92); z-index: 200; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
  .modal-box { background: var(--slate); border: 1px solid var(--gold); padding: 3rem; max-width: 420px; width: 90%; animation: slideUp 0.25s ease; }
  .max-w { max-width: 1100px; margin: 0 auto; }
  .text-center { text-align: center; }
  @media (max-width: 768px) {
    nav { padding: 1rem 1.5rem; } .nav-links { display: none; } section { padding: 4rem 1.5rem; }
    .about-grid, .booking-grid, .contact-grid, .tiers-grid, .dash-grid { grid-template-columns: 1fr; }
    .hero { padding: 6rem 1.5rem 3rem; } .dash-cards { grid-template-columns: 1fr; }
  }
`

const courses = {
  "Filmmaking": [
    { id:1,  title:"The Budget Myth",                    duration:"18 min", free:true,  desc:"Why money is not the answer, and what to look for instead.", url:"https://player.vimeo.com/video/958087223?h=c3900df67f" },
    { id:2,  title:"Hire for Attitude, Trade for Skill", duration:"22 min", free:true,  desc:"Building your team from scratch, find the right alchemy." },
    { id:3,  title:"Preparation is Key",                 duration:"25 min", free:false, desc:"The moment you start preparing you are close to the goal." },
    { id:4,  title:"Post-Production Survival Guide",     duration:"30 min", free:false, desc:"The way to picture lock is never straight." },
    { id:5,  title:"Festivals & Distribution Decoded",   duration:"28 min", free:false, desc:"Where to send your film and how to get it seen." },
    { id:6,  title:"Make Money With Your Film",          duration:"20 min", free:false, desc:"Revenue streams most indie filmmakers never consider." },
  ],
  "Mindset": [
    { id:7,  title:"Stop Thinking Negative",             duration:"16 min", free:true,  desc:"The science of negativity and how to rewire it." },
    { id:8,  title:"The Growth Mindset in Practice",     duration:"19 min", free:false, desc:"Fixed vs growth for identity-based habits." },
    { id:9,  title:"Visualisation for Real Results",     duration:"21 min", free:false, desc:"How elite performers use mental rehearsal." },
    { id:10, title:"Goal Setting That Works",            duration:"17 min", free:false, desc:"SMART goals, DUMB goals, and the 10-minute rule." },
  ],
  "Relationships": [
    { id:11, title:"Dating in the Post-Narcissistic Era",duration:"24 min", free:true,  desc:"How to spot patterns before they become drama." },
    { id:12, title:"Attachment Styles Explained",        duration:"22 min", free:false, desc:"Anxious, avoidant or secure?" },
    { id:13, title:"The 4 Gates Model",                  duration:"26 min", free:false, desc:"A practical framework for choosing your next partner." },
    { id:14, title:"The 90-Day Reset Plan",              duration:"20 min", free:false, desc:"Structured recovery from toxic relational patterns." },
  ],
  "Coaching": [
    { id:15, title:"Coach Yourself to Mastery",          duration:"23 min", free:true,  desc:"The self-coaching toolkit for lasting confidence." },
    { id:16, title:"Building Unshakeable Confidence",    duration:"18 min", free:false, desc:"Action loops and the science of self-belief." },
    { id:17, title:"Boundaries Without Guilt",           duration:"20 min", free:false, desc:"Why saying no is an act of self-respect." },
    { id:18, title:"Emotional Mastery in Relationships", duration:"25 min", free:false, desc:"Triggers, patterns, and conscious response." },
  ],
}

const sessions = [
  { id:1, name:"Discovery Session",    meta:"45 min · Free",  planKey: null },
  { id:2, name:"Filmmaking Strategy",  meta:"60 min · €60",   planKey: 'filmmaking' },
  { id:3, name:"Relationship Clarity", meta:"60 min · €90",   planKey: 'relationship' },
  { id:4, name:"Mindset Coaching",     meta:"60 min · €120",  planKey: 'mindset' },
]

const COURSE_ADDONS = {
  filmmaking: [1],
  relationship: [3, 5],
  mindset: [2, 4],
  professional: [2],
  mastery: [2]
}

// ── STRIPE PAYMENT LINKS ─────────────────────────────────────────────────────
// Replace these with your actual Stripe Payment Links
// Stripe Dashboard → Products → [product] → "Create payment link"
const PAYMENT_LINKS = {
  professional: "https://buy.stripe.com/test_dRmeVd8IDdED5R00TggUM00",
  mastery:      "https://buy.stripe.com/test_6oUbJ15wr8kjenwgSegUM01",
  filmmaking:   "https://buy.stripe.com/test_28E7sL9MHdED3ISfOagUM02",
  relationship: "https://buy.stripe.com/test_00w4gz0c77gfdjs6dAgUM03",
  mindset:      "https://buy.stripe.com/test_bJe3cv7Ez587djs0TggUM04",
}

function goToStripe(planKey, addons = []) {
  const url = PAYMENT_LINKS[planKey]

  if (!url || url.includes("REPLACE")) {
    alert("Payment link not configured yet.")
    return
  }

  // Stripe Payment Links do not support success_url / cancel_url as query params
  // Those must be configured directly in the Stripe dashboard per payment link
  // We just redirect cleanly to the payment link URL
  window.location.href = url
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function useAuth() {
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState("explorer")
  const [planStatus, setPlanStatus] = useState(null)
  const [planExpiresAt, setPlanExpiresAt] = useState(null)
  const [trialEndsAt, setTrialEndsAt] = useState(null)
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false)
  const [stripeCustomerId, setStripeCustomerId] = useState(null)
  const [loading, setLoading] = useState(true)

  // useCallback gives a stable reference — prevents infinite loops in useEffect deps
  const fetchPlan = useCallback(async (email) => {
    const { data, error } = await supabase
      .from("members")
      .select("plan, plan_status, plan_expires_at, trial_ends_at, cancel_at_period_end, stripe_customer_id")
      .eq("email", email)
      .single()

    if (!error && data) {
      setPlan(data.plan ?? "explorer")
      setPlanStatus(data.plan_status ?? null)
      setPlanExpiresAt(data.plan_expires_at ?? null)
      setTrialEndsAt(data.trial_ends_at ?? null)
      setCancelAtPeriodEnd(data.cancel_at_period_end ?? false)
      setStripeCustomerId(data.stripe_customer_id ?? null)
    } else {
      setPlan("explorer")
      setPlanStatus(null)
      setPlanExpiresAt(null)
      setTrialEndsAt(null)
      setCancelAtPeriodEnd(false)
      setStripeCustomerId(null)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null
      setUser(currentUser)
      if (currentUser?.email) fetchPlan(currentUser.email)
      else setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser?.email) fetchPlan(currentUser.email)
      else {
        setPlan("explorer")
        setPlanStatus(null)
        setPlanExpiresAt(null)
        setTrialEndsAt(null)
        setCancelAtPeriodEnd(false)
        setStripeCustomerId(null)
        setLoading(false)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [fetchPlan])

  // isPremium: check plan field only — planStatus may be null if webhook is slow
  const isPremium = plan === "professional" || plan === "mastery"

  return {
    user,
    plan,
    planStatus,
    planExpiresAt,
    trialEndsAt,
    cancelAtPeriodEnd,
    stripeCustomerId,
    isPremium,
    loading,
    fetchPlan
  }
}

function useVideoProgress(user) {
  const [progressMap, setProgressMap] = useState({})
  const [progressLoading, setProgressLoading] = useState(false)

  const fetchProgress = async () => {
    if (!user?.email) {
      setProgressMap({})
      return
    }

    setProgressLoading(true)

    const { data, error } = await supabase
      .from("video_progress")
      .select("video_id, progress, updated_at")
      .eq("user_email", user.email)

    if (!error && data) {
      const map = {}
      data.forEach((row) => {
        map[String(row.video_id)] = {
          progress: row.progress ?? 0,
          updated_at: row.updated_at ?? null
        }
      })
      setProgressMap(map)
    }

    setProgressLoading(false)
  }

  const saveProgress = async (videoId, progress) => {
    if (!user?.email || !videoId) return

    const safeProgress = Math.max(0, Math.min(100, progress))

    const { error } = await supabase
      .from("video_progress")
      .upsert(
        {
          user_email: user.email,
          video_id: String(videoId),
          progress: safeProgress,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: "user_email,video_id"
        }
      )

    if (!error) {
      setProgressMap((prev) => ({
        ...prev,
        [videoId]: {
          progress: safeProgress,
          updated_at: new Date().toISOString()
        }
      }))
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [user?.email])

  return { progressMap, progressLoading, fetchProgress, saveProgress }
}

// ── AUTH MODAL ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, defaultMode = "signin" }) {
  const [mode, setMode]   = useState(defaultMode)
  const [email, setEmail] = useState("")
  const [sent, setSent]   = useState(false)
  const [err, setErr]     = useState("")

  const handle = async () => {
    setErr("")
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin }
      })
      if (error) { setErr(error.message); return }
      setSent(true)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {sent ? (
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:'Cormorant Garamond', fontSize:'1.8rem', color:'var(--gold)', marginBottom:'1rem'}}>Check your email.</div>
            <p style={{color:'var(--mist)', fontSize:'0.88rem'}}>We sent a magic link to <strong style={{color:'var(--parchment)'}}>{email}</strong>. Click it to sign in — no password needed.</p>
          </div>
        ) : (
          <>
            <div style={{fontFamily:'Cormorant Garamond', fontSize:'1.6rem', color:'var(--parchment)', marginBottom:'0.4rem'}}>
              {mode === "signin" ? "Sign in" : "Create account"}
            </div>
            <p style={{color:'var(--mist)', fontSize:'0.82rem', marginBottom:'1.5rem'}}>We'll send a magic link to your email — no password needed.</p>
            {err && <p style={{color:'#e24b4a', fontSize:'0.82rem', marginBottom:'1rem'}}>{err}</p>}
            <div className="form-group" style={{marginBottom:'1rem'}}>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e=>e.key==='Enter'&&handle()} />
            </div>
            <button className="btn-primary" style={{width:'100%'}} onClick={handle}>
              {mode === "signin" ? "Send magic link" : "Create account"}
            </button>
            <button onClick={onClose} style={{width:'100%', marginTop:'0.8rem', background:'none', border:'none', color:'var(--mist)', cursor:'pointer', fontSize:'0.78rem'}}>Cancel</button>
          </>
        )}
      </div>
    </div>
  )
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function NavBar({ setPage, user, onSignIn, onSignOut }) {
  return (
    <nav>
      <span className="nav-logo" onClick={() => setPage('home')}>Come Alive Studio</span>
     <ul className="nav-links">
  {['Library','Booking','Contact'].map(p => (
    <li key={p}>
      <a onClick={() => setPage(p.toLowerCase())}>{p}</a>
    </li>
  ))}

  {user && (
    <li>
      <a onClick={() => setPage('dashboard')}>Dashboard</a>
    </li>
  )}
</ul>
      {user
        ? <button className="nav-cta" onClick={onSignOut}>Sign Out</button>
        : <button className="nav-cta" onClick={onSignIn}>Member Area</button>
      }
    </nav>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero({ setPage }) {
  return (
    <section className="hero">
      <div className="hero-bg" /><div className="hero-grain" />
      <div className="hero-content">
        <div className="hero-eyebrow">Come Alive Studio · Vienna</div>
        <h1>Make it<br /><em>Happen.</em></h1>
        <p className="hero-sub">Coaching, courses, and frameworks for independent filmmakers, creative professionals, and anyone ready to stop waiting for permission. Book a free session now for an introductory overview.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage('library')}>Explore Courses</button>
          <button className="btn-ghost" onClick={() => setPage('booking')}>Book a Session</button>
        </div>
      </div>
      <div className="hero-scroll">Scroll</div>
    </section>
  )
}

// ── TIERS ─────────────────────────────────────────────────────────────────────
function Tiers({ setPage }) {
  const handleJoin = (planKey) => goToStripe(planKey)
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
              <li>Priority booking & 20% discount</li>
              <li>Progress tracking dashboard</li>
            </ul>
            <button className="tier-btn tier-btn-filled" onClick={() => handleJoin('professional')}>Join Professional</button>
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
            <button className="tier-btn tier-btn-outline" onClick={() => handleJoin('mastery')}>Join Mastery</button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="about">
      <div className="about-grid max-w">
        <div>
          <div className="about-portrait"><div className="about-portrait-inner">A.D.</div></div>
        </div>
        <div className="about-text">
          <div className="section-label">About</div>
          <h2>My experience ranges from<br /><em>consultancy to film production</em></h2>
          <p>My experience ranges from consultancy to film production and mentoring. Having lived across two continents, I completed my engineering thesis in California before working as sales trainer and consultant in the automotive business.</p>
          <p>As my career evolved into film production, I moved to Vienna where I worked as film & media producer, participating in 10 consecutive Cannes and Berlin Film Festivals and 6 editions of the World Public Forum in Rhodes, recording more than 150 interviews and 200 hours of live conferences.</p>
          <p>In recent years I developed a deep interest in personal growth and relationship psychology, while finishing an MBA in Entrepreneurship, Innovation and Leadership in Vienna, and a coaching certification with MindValley University.</p>
          <div className="about-stats">
            <div className="stat"><div className="stat-num">20+</div><div className="stat-label">Years international experience</div></div>
            <div className="stat"><div className="stat-num">5</div><div className="stat-label">Books published</div></div>
            <div className="stat"><div className="stat-num">450+</div><div className="stat-label">Festival screenings</div></div>
            <div className="stat"><div className="stat-num">6</div><div className="stat-label">World Public Forums</div></div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── LIBRARY ───────────────────────────────────────────────────────────────────
function Library({ user, isPremium, setPage, progressMap, saveProgress }) {
  const [activeTab, setActiveTab] = useState("Filmmaking")
  const [activeVideo, setActiveVideo] = useState(null)

  return (
    <div className="library" style={{ paddingTop:'6rem' }}>
      <div className="max-w" style={{ padding:'0 3rem' }}>
        <div className="section-label">Course Library</div>
        <h2>Everything in one place.<br /><em>Organised by track.</em></h2>
        <p style={{ color:'var(--mist)', marginBottom:'2.5rem', fontSize:'0.9rem', maxWidth:520 }}>
          Free episodes available to all. <br />
          Premium content unlocks with Professional membership.
        </p>

        <div className="course-tabs">
          {Object.keys(courses).map(tab => (
            <button
              key={tab}
              className={`course-tab ${activeTab===tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="videos-grid">
          {courses[activeTab].map(v => {
            const locked = !v.free && !isPremium
            const currentProgress = progressMap?.[String(v.id)]?.progress ?? 0

            return (
              <div
                className="video-card"
                key={v.id}
                style={{
                  opacity: locked ? 0.45 : 1,
                  cursor: locked ? 'default' : 'pointer'
                }}
                onClick={() => {
                  if (locked) return

                  if (user) {
                    const nextProgress =
                      currentProgress >= 100 ? 100 :
                      currentProgress > 0 ? currentProgress :
                      10

                    saveProgress(String(v.id), nextProgress)
                  }

                  if (v.url) {
                    setActiveVideo(v)
                  }
                }}
              >
                <div className="video-thumb">
                  <div className="video-thumb-icon">{locked ? '🔒' : '▶'}</div>
                  <div className={`video-lock ${v.free ? 'video-free' : ''}`}>
                    {v.free ? 'Free' : 'Premium'}
                  </div>
                </div>

                <div className="video-info">
                  <div className="video-duration">{v.duration}</div>
                  <div className="video-title">{v.title}</div>
                  <div className="video-desc">{v.desc}</div>

                  {user && !locked && currentProgress > 0 && (
                    <div style={{ marginTop:'0.8rem' }}>
                      <div style={{
                        fontSize:'0.72rem',
                        color:'var(--gold)',
                        fontFamily:'DM Mono',
                        letterSpacing:'0.08em',
                        marginBottom:'0.35rem'
                      }}>
                        Progress: {currentProgress}%
                      </div>

                      <div style={{
                        height:'4px',
                        background:'var(--border)',
                        borderRadius:'999px',
                        overflow:'hidden'
                      }}>
                        <div className="progress-fill" style={{
                          width:`${currentProgress}%`,
                          height:'100%'
                        }} />
                      </div>
                    </div>
                  )}

                  {user && !locked && currentProgress < 100 && (
                    <button
                      style={{
                        marginTop:'0.8rem',
                        background:'none',
                        border:'1px solid var(--border)',
                        color:'var(--mist)',
                        padding:'0.45rem 0.75rem',
                        cursor:'pointer',
                        fontSize:'0.7rem',
                        letterSpacing:'0.06em',
                        textTransform:'uppercase'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        saveProgress(String(v.id), 100)
                      }}
                    >
                      Mark complete
                    </button>
                  )}

                  {user && !locked && currentProgress >= 100 && (
                    <div style={{
                      marginTop:'0.8rem',
                      fontSize:'0.72rem',
                      color:'var(--gold)',
                      fontFamily:'DM Mono',
                      letterSpacing:'0.08em'
                    }}>
                      ✓ Completed
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {!isPremium && (
          <div style={{
            marginTop:'3rem',
            padding:'2rem',
            border:'1px solid var(--border)',
            textAlign:'center',
            background:'var(--slate)'
          }}>
            <div style={{
              fontFamily:'Cormorant Garamond',
              fontSize:'1.4rem',
              color:'var(--parchment)',
              marginBottom:'0.8rem'
            }}>
              Ready to go deeper?
            </div>
            <p style={{ color:'var(--mist)', fontSize:'0.88rem', marginBottom:'1.5rem' }}>
              Join Professional to unlock all premium episodes across every track.
            </p>
            <button className="btn-primary" onClick={() => setPage('home')}>
              View Membership Plans
            </button>
          </div>
        )}

        {activeVideo && (
          <div
            style={{
              position:'fixed',
              inset:0,
              background:'rgba(0,0,0,0.9)',
              zIndex:999,
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              padding:'2rem'
            }}
            onClick={() => {
              if (user && activeVideo) {
                const currentProgress = progressMap?.[String(activeVideo.id)]?.progress ?? 0

                const nextProgress = Math.min(currentProgress + 30, 100)

                saveProgress(String(activeVideo.id), nextProgress)
               }

              setActiveVideo(null)
            }}
          >
            <div
              style={{
                width:'100%',
                maxWidth:'960px',
                aspectRatio:'16/9',
                background:'#000',
                position:'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={activeVideo.url}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── BOOKING ───────────────────────────────────────────────────────────────────
function Booking({ isPremium }) {
  const [selected, setSelected]   = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending]     = useState(false)
  const [form, setForm] = useState({ name:'', email:'', timezone:'', message:'' })

  const handleSubmit = async () => {
    setSending(true)
    const s = sessions[selected]
    if (s.planKey) {
      goToStripe(s.planKey)
      return
    }
    try {
      await fetch(FORMSPREE, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, session: s.name + ' — ' + s.meta, _subject: 'Booking Request — ' + s.name })
      })
      setSubmitted(true)
    } catch(e) { setSending(false) }
  }

  return (
    <div style={{background:'var(--slate)', paddingTop:'6rem', minHeight:'100vh'}}>
      <div className="max-w" style={{padding:'4rem 3rem'}}>
        <div className="section-label">Book a Session</div>
        <h2>Work directly <em>with Angelo</em></h2>
        <div className="booking-grid">
          <div>
            <p style={{color:'var(--mist)', fontSize:'0.88rem', marginBottom:'1.5rem'}}>The Discovery call is always free. Contact me first and we can discuss the best option for you during the introductory sesssion. Paid sessions open Stripe checkout directly. </p>
            <div>
              {sessions.map((s,i) => {
                const locked = s.planKey && !isPremium
                return (
                  <div key={s.id}
                    className={`session-type ${selected===i&&!locked?'active':''}`}
                    onClick={() => !locked && setSelected(i)}
                    style={{opacity: locked ? 0.4 : 1, cursor: locked ? 'default' : 'pointer'}}>
                    <div className="session-name">{s.name}</div>
                    <div className="session-meta">{s.meta}</div>
                    {locked && <div style={{fontSize:'0.7rem', color:'var(--gold)', fontFamily:'DM Mono', marginTop:'0.4rem'}}>→ Register to unlock</div>}
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            {submitted ? (
              <div className="success-msg">Request received.<br /><span style={{fontSize:'1rem', color:'var(--mist)'}}>Angelo will be in touch within 24 hours.</span></div>
            ) : (
              <div className="booking-form">
                <div className="form-group"><label className="form-label">Your Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" /></div>
                <div className="form-group"><label className="form-label">Timezone</label><input className="form-input" value={form.timezone} onChange={e=>setForm({...form,timezone:e.target.value})} placeholder="e.g. CET, GMT+1" /></div>
                <div className="form-group"><label className="form-label">Tell me where you are</label><textarea className="form-textarea" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="What are you working on?" /></div>
                <button className="btn-primary" style={{width:'100%'}} onClick={handleSubmit} disabled={sending}>
                  {sessions[selected].planKey ? 'Proceed to Payment →' : sending ? 'Sending…' : 'Request Session'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending]     = useState(false)
  const [form, setForm] = useState({ name:'', email:'', subject:'Filmmaking question', message:'' })

  const handleSubmit = async () => {
    setSending(true)
    try {
      await fetch(FORMSPREE, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, _subject: 'Contact: ' + form.subject }) })
      setSubmitted(true)
    } catch(e) { setSending(false) }
  }

  return (
    <div style={{background:'var(--ink)', paddingTop:'6rem', minHeight:'100vh'}}>
      <div className="max-w" style={{padding:'4rem 3rem'}}>
        <div className="section-label">Contact</div>
        <h2>Let's start a <em>conversation</em></h2>
        <div className="contact-grid">
          <div>
            <p style={{color:'var(--mist)', fontSize:'0.92rem', marginBottom:'2rem'}}>Whether you have a question about the courses, want to collaborate on a film project, or just want to say hello, the door is open.</p>
            {[{icon:'✉',label:'Email',value:'office@comealive.vision'},{icon:'🌐',label:'Website',value:'comealive.vision'},{icon:'📍',label:'Based in',value:'Vienna, Austria'},{icon:'📸',label:'Instagram',value:'@comealivestudio'}].map(d => (
              <div className="contact-detail" key={d.label}>
                <div className="contact-detail-icon">{d.icon}</div>
                <div className="contact-detail-text"><strong>{d.label}</strong>{d.value}</div>
              </div>
            ))}
          </div>
          <div>
            {submitted ? (
              <div className="success-msg">Message sent.<br /><span style={{fontSize:'1rem', color:'var(--mist)'}}>I'll reply within 48 hours.</span></div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" /></div>
                <div className="form-group"><label className="form-label">Subject</label>
                  <select className="form-select" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
                    <option>Filmmaking question</option><option>Coaching enquiry</option><option>Collaboration proposal</option><option>Something else</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Message</label><textarea className="form-textarea" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="What's on your mind?" /></div>
                <button className="btn-primary" onClick={handleSubmit} disabled={sending}>{sending?'Sending…':'Send Message'}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── DOWNLOADS SECTION ─────────────────────────────────────────────────────────────────
function DownloadsSection({ plan }) {
  const [assets, setAssets] = useState([])
  const [loadingAssets, setLoadingAssets] = useState(true)

  useEffect(() => {
    const fetchAssets = async () => {
      setLoadingAssets(true)

      const { data, error } = await supabase
        .from('digital_assets')
        .select('id, title, description, file_url, plan_required, category')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAssets(data)
      }

      setLoadingAssets(false)
    }

    fetchAssets()
  }, [])

  const canAccess = (requiredPlan) => {
    if (requiredPlan === 'explorer') return true
    if (requiredPlan === 'professional') return plan === 'professional' || plan === 'mastery'
    if (requiredPlan === 'mastery') return plan === 'mastery'
    return false
  }

  if (loadingAssets) {
    return (
      <div style={{padding:'2rem', border:'1px solid var(--border)', color:'var(--mist)'}}>
        Loading downloads...
      </div>
    )
  }

  return (
    <div>
      <div className="section-label">Downloads</div>

      {assets.length === 0 ? (
        <div style={{padding:'2rem', border:'1px solid var(--border)', color:'var(--mist)'}}>
          No files available yet.
        </div>
      ) : (
        <div style={{display:'grid', gap:'1rem', maxWidth:'820px'}}>
          {assets.map((asset) => {
            const locked = !canAccess(asset.plan_required)

            return (
              <div
                key={asset.id}
                style={{
                  border:'1px solid var(--border)',
                  background:'var(--slate)',
                  padding:'1.4rem'
                }}
              >
                <div style={{
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'flex-start',
                  gap:'1rem'
                }}>
                  <div>
                    <div style={{
                      fontFamily:'Cormorant Garamond',
                      fontSize:'1.4rem',
                      color:'var(--parchment)',
                      marginBottom:'0.35rem'
                    }}>
                      {asset.title}
                    </div>

                    {asset.description && (
                      <div style={{color:'var(--mist)', fontSize:'0.88rem'}}>
                        {asset.description}
                      </div>
                    )}

                    <div style={{
                      marginTop:'0.55rem',
                      fontFamily:'DM Mono',
                      fontSize:'0.65rem',
                      color:'var(--gold)',
                      letterSpacing:'0.08em',
                      textTransform:'uppercase'
                    }}>
                      {asset.plan_required}
                    </div>
                  </div>

                  {locked ? (
                    <button
                      className="btn-ghost"
                      onClick={() => window.alert('Upgrade your membership to unlock this download.')}
                    >
                      Locked
                    </button>
                  ) : (
                    <a
                      href={asset.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                      style={{textDecoration:'none', display:'inline-flex', alignItems:'center'}}
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({
  user,
  plan,
  planStatus,
  planExpiresAt,
  trialEndsAt,
  cancelAtPeriodEnd,
  stripeCustomerId,
  progressMap,
  saveProgress,
  isPremium
}) {
  const [activeSection, setActiveSection] = useState('overview')

  const navItems = [
    { id:'overview', label:'Overview', icon:'◈' },
    { id:'courses', label:'My Courses', icon:'▤' },
    { id:'downloads', label:'Downloads', icon:'⇩' },
    { id:'billing', label:'Billing', icon:'◧' },
    { id:'sessions', label:'Sessions', icon:'◷' },
    { id:'profile', label:'Profile', icon:'◯' }
  ]

  const allVideos = Object.values(courses).flat()
  const watchedVideos = allVideos.filter(v => (progressMap?.[String(v.id)]?.progress ?? 0) > 0)
  const completedVideos = allVideos.filter(v => (progressMap?.[String(v.id)]?.progress ?? 0) >= 100)
  const totalProgress = allVideos.length
    ? Math.round(
        allVideos.reduce((sum, v) => sum + (progressMap?.[String(v.id)]?.progress ?? 0), 0) / allVideos.length
      )
    : 0

  const trackProgress = Object.fromEntries(
    Object.entries(courses).map(([track, items]) => {
      const pct = items.length
        ? Math.round(
            items.reduce((sum, v) => sum + (progressMap?.[String(v.id)]?.progress ?? 0), 0) / items.length
          )
        : 0
      return [track, pct]
    })
  )

  const continueWatching = watchedVideos
    .sort((a, b) => {
      const aDate = progressMap?.[String(a.id)]?.updated_at ?? ''
      const bDate = progressMap?.[String(b.id)]?.updated_at ?? ''
      return new Date(bDate) - new Date(aDate)
    })
    .slice(0, 6)

  const formatDate = (value) => {
    if (!value) return "—"
    try {
      return new Date(value).toLocaleDateString()
    } catch {
      return "—"
    }
  }

  const billingMessage = () => {
    if (cancelAtPeriodEnd) {
      return `Your subscription will end on ${formatDate(planExpiresAt)}`
    }

    if (planStatus === 'trialing') {
      return `You're on a trial until ${formatDate(trialEndsAt)}`
    }

    if (planStatus === 'past_due') {
      return "Payment failed - please update your billing method"
    }

    if (planStatus === 'canceled') {
      return "Your subscription has been cancelled"
    }

    if (planStatus === 'active') {
      return `Your plan renews on ${formatDate(planExpiresAt)}`
    }

    return "You are currently on the free plan"
  }

  const [openingPortal, setOpeningPortal] = useState(false)

  const openBillingPortal = async () => {
    try {
      setOpeningPortal(true)

      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email })
      })

      const data = await res.json()

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Unable to open billing portal')
      }

      window.location.href = data.url
        } catch (err) {
      console.error(err)
      alert(err?.message || 'Unable to open billing portal')
    } finally {
      setOpeningPortal(false)
    }
  }

  return (
    <div className="dashboard">
      <div style={{
        padding:'2rem 3rem',
        borderBottom:'1px solid var(--border)',
        background:'var(--slate)',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
      }}>
        <div style={{fontFamily:'Cormorant Garamond', fontSize:'1.6rem', fontWeight:300}}>
          Welcome back, <span style={{color:'var(--gold)'}}>{user?.email?.split('@')[0]}</span>
        </div>
        <div className={`plan-badge ${planStatus==='active'||planStatus==='trialing'?'active':''}`}>
          {plan} · {planStatus || 'free'}
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-sidebar">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`dash-nav-item ${activeSection===item.id?'active':''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>

        <div className="dash-content">
          {activeSection==='overview' && (
            <>
              <div className="dash-cards">
                <div className="dash-card">
                  <div className="dash-card-label">Episodes Watched</div>
                  <div className="dash-card-value">{watchedVideos.length}</div>
                  <div className="dash-card-sub">of {allVideos.length} total</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width:`${Math.round((watchedVideos.length / allVideos.length) * 100 || 0)}%`}} />
                  </div>
                </div>

                <div className="dash-card">
                  <div className="dash-card-label">Completed</div>
                  <div className="dash-card-value">{completedVideos.length}</div>
                  <div className="dash-card-sub">videos completed</div>
                </div>

                <div className="dash-card">
                  <div className="dash-card-label">Membership</div>
                  <div className="dash-card-value" style={{fontSize:'1.4rem', marginTop:'0.3rem', textTransform:'capitalize'}}>
                    {plan}
                  </div>
                  <div className="dash-card-sub">{billingMessage()}</div>
                </div>
              </div>

              <div className="section-label">Progress by Track</div>
              {Object.entries(trackProgress).map(([track, pct]) => (
                <div key={track} style={{marginBottom:'1.5rem'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}>
                    <span style={{fontSize:'0.85rem', color:'var(--parchment)'}}>{track}</span>
                    <span style={{fontFamily:'DM Mono', fontSize:'0.65rem', color:'var(--gold)'}}>{pct}%</span>
                  </div>
                  <div className="progress-bar" style={{height:'4px'}}>
                    <div className="progress-fill" style={{width:`${pct}%`}} />
                  </div>
                </div>
              ))}
            </>
          )}

          {activeSection==='courses' && (
            <>
              <div className="section-label">Continue Watching</div>

              {continueWatching.length === 0 ? (
                <div style={{padding:'3rem', border:'1px solid var(--border)', textAlign:'center'}}>
                  <div style={{fontFamily:'Cormorant Garamond', fontSize:'1.4rem', color:'var(--mist)', marginBottom:'0.8rem'}}>
                    No progress yet
                  </div>
                  <p style={{fontSize:'0.82rem', color:'var(--mist)'}}>
                    Start a course in the Library and your progress will appear here.
                  </p>
                </div>
              ) : (
                <div className="videos-grid">
                  {continueWatching.map(v => {
                    const currentProgress = progressMap?.[String(v.id)]?.progress ?? 0
                    const locked = !v.free && !isPremium

                    return (
                      <div className="video-card" key={v.id} style={{opacity: locked ? 0.45 : 1}}>
                        <div className="video-thumb">
                          <div className="video-thumb-icon">{locked ? '🔒' : '▶'}</div>
                        </div>

                        <div className="video-info">
                          <div className="video-duration">{v.duration}</div>
                          <div className="video-title">{v.title}</div>
                          <div className="video-desc">{v.desc}</div>

                          <div style={{ marginTop:'0.8rem' }}>
                            <div style={{
                              fontSize:'0.72rem',
                              color:'var(--gold)',
                              fontFamily:'DM Mono',
                              letterSpacing:'0.08em',
                              marginBottom:'0.35rem'
                            }}>
                              Progress: {currentProgress}%
                            </div>

                            <div style={{
                              height:'4px',
                              background:'var(--border)',
                              borderRadius:'999px',
                              overflow:'hidden'
                            }}>
                              <div className="progress-fill" style={{
                                width:`${currentProgress}%`,
                                height:'100%'
                              }} />
                            </div>
                          </div>

                          {!locked && currentProgress < 100 && (
                            <button
                              style={{
                                marginTop:'0.8rem',
                                background:'none',
                                border:'1px solid var(--border)',
                                color:'var(--mist)',
                                padding:'0.45rem 0.75rem',
                                cursor:'pointer',
                                fontSize:'0.7rem',
                                letterSpacing:'0.06em',
                                textTransform:'uppercase'
                              }}
                              onClick={() => saveProgress(String(v.id), 100)}
                            >
                              Mark complete
                            </button>
                          )}

                          {currentProgress >= 100 && (
                            <div style={{
                              marginTop:'0.8rem',
                              fontSize:'0.72rem',
                              color:'var(--gold)',
                              fontFamily:'DM Mono',
                              letterSpacing:'0.08em'
                            }}>
                              ✓ Completed
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {activeSection==='downloads' && (
            <DownloadsSection plan={plan} />
          )}

          {activeSection==='billing' && (
            <>
              <div className="section-label">Billing</div>

              <div style={{
                border:'1px solid var(--border)',
                background:'var(--slate)',
                padding:'2rem',
                maxWidth:'720px'
              }}>
                <div style={{
                  fontFamily:'Cormorant Garamond',
                  fontSize:'1.8rem',
                  color:'var(--parchment)',
                  marginBottom:'1.2rem'
                }}>
                  Your subscription
                </div>

                <div style={{display:'grid', gap:'1rem'}}>
                  <div>
                    <div className="form-label">Plan</div>
                    <div style={{color:'var(--parchment)', textTransform:'capitalize'}}>
                      {plan}
                    </div>
                  </div>

                  <div>
                    <div className="form-label">Status</div>
                    <div style={{color:'var(--parchment)', textTransform:'capitalize'}}>
                      {planStatus || 'free'}
                    </div>
                  </div>

                  <div>
                    <div className="form-label">Renews / Expires</div>
                    <div style={{color:'var(--parchment)'}}>
                      {formatDate(planExpiresAt)}
                    </div>
                  </div>

                  {trialEndsAt && (
                    <div>
                      <div className="form-label">Trial ends</div>
                      <div style={{color:'var(--parchment)'}}>
                        {formatDate(trialEndsAt)}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="form-label">Cancel at period end</div>
                    <div style={{color:'var(--parchment)'}}>
                      {cancelAtPeriodEnd ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop:'1.5rem',
                  padding:'1rem 1.2rem',
                  border:'1px solid var(--border)',
                  background:'var(--ink)'
                }}>
                  <div style={{
                    fontFamily:'DM Mono',
                    fontSize:'0.72rem',
                    color:'var(--gold)',
                    letterSpacing:'0.08em',
                    marginBottom:'0.4rem'
                  }}>
                    Subscription message
                  </div>
                  <div style={{color:'var(--mist)', fontSize:'0.9rem'}}>
                    {billingMessage()}
                  </div>
                </div>

                <div style={{
                  display:'flex',
                  flexDirection:'column',
                  gap:'0.8rem',
                  marginTop:'1.5rem'
                }}>
                  {plan === 'explorer' && (
                    <button
                      className="btn-primary"
                      onClick={() => goToStripe('professional')}
                      style={{width:'100%'}}
                    >
                      Upgrade to Professional
                    </button>
                  )}

                  {plan !== 'mastery' && (
                    <button
                      className="btn-ghost"
                      onClick={() => goToStripe('mastery')}
                      style={{width:'100%'}}
                    >
                      Upgrade to Mastery
                    </button>
                  )}

                  {!!stripeCustomerId && (
                    <button
                      className="btn-ghost"
                      onClick={openBillingPortal}
                      disabled={openingPortal}
                      style={{width:'100%'}}
                    >
                      {openingPortal ? 'Opening…' : 'Manage subscription'}
                    </button>
                  )}

                  {!stripeCustomerId && (
                    <div style={{
                      padding:'0.9rem 1rem',
                      border:'1px solid var(--border)',
                      color:'var(--mist)',
                      fontSize:'0.82rem'
                    }}>
                      No billing account connected yet.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeSection==='sessions' && (
            <div style={{padding:'3rem', border:'1px solid var(--border)', textAlign:'center'}}>
              <div style={{fontFamily:'Cormorant Garamond', fontSize:'1.4rem', color:'var(--mist)', marginBottom:'0.8rem'}}>
                No sessions booked yet
              </div>
              <p style={{fontSize:'0.82rem', color:'var(--mist)'}}>
                Head to the Booking page to schedule your first session.
              </p>
            </div>
          )}

          {activeSection==='profile' && (
            <>
              <div className="section-label">Your Profile</div>
              <div style={{display:'flex', flexDirection:'column', gap:'1rem', maxWidth:480}}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="text" defaultValue={user?.email} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Plan</label>
                  <input className="form-input" type="text" defaultValue={plan} readOnly style={{textTransform:'capitalize'}} />
                </div>
                <div className="form-group">
                  <label className="form-label">Overall Progress</label>
                  <input className="form-input" type="text" defaultValue={`${totalProgress}%`} readOnly />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]         = useState('home')
  const [showAuth, setShowAuth] = useState(false)
  const {
  user,
  plan,
  planStatus,
  planExpiresAt,
  trialEndsAt,
  cancelAtPeriodEnd,
  stripeCustomerId,
  isPremium,
  loading,
  fetchPlan
} = useAuth()
  const { progressMap, saveProgress } = useVideoProgress(user)

useEffect(() => {
  if (localStorage.getItem('justPaid')) {
    setPage('dashboard')
    localStorage.removeItem('justPaid')
  }
}, [])
  useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const pageParam = params.get('page')

  if (pageParam && ['home','library','booking','contact','dashboard'].includes(pageParam)) {
  setPage(pageParam)
  window.history.replaceState({}, '', window.location.pathname)
  }
}, [])

  // Handle Stripe success redirect — retry fetchPlan up to 8x with 2s intervals
  // to give the webhook enough time to write to Supabase
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') !== 'success') return
    window.history.replaceState({}, '', '/')
    setPage('dashboard')
    if (!user?.email) return

    let attempts = 0
    const maxAttempts = 8
    const interval = setInterval(async () => {
      attempts++
      const { data } = await supabase
        .from("members")
        .select("plan")
        .eq("email", user.email)
        .single()
      const newPlan = data?.plan ?? "explorer"
      if (newPlan !== "explorer" || attempts >= maxAttempts) {
        clearInterval(interval)
        if (newPlan !== "explorer") fetchPlan(user.email)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [user?.email, fetchPlan])

  const signOut = () => supabase.auth.signOut()

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="loading-screen">
        <div className="loading-wordmark">Come Alive Studio</div>
        <div className="loading-bar" />
      </div>
    </>
  )

  return (
    <>
      <style>{css}</style>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <NavBar setPage={setPage} user={user} onSignIn={() => setShowAuth(true)} onSignOut={signOut} />
      {page==='home' && (
        <>
          <Hero setPage={setPage} />
          <Tiers setPage={setPage} />
          <About />
          <section style={{background:'var(--slate)', padding:'5rem 3rem', textAlign:'center'}}>
            <div className="section-label" style={{justifyContent:'center'}}>Podcast</div>
            <h2>Make It Happen<br /><em>premieres May 2026</em></h2>
            <p style={{color:'var(--mist)', maxWidth:460, margin:'0 auto 2rem', fontSize:'0.9rem'}}>
              The independent filmmaker's survival guide.<br />
              New episodes every week on Spotify.
            </p>
            <a
              href={SPOTIFY_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{textDecoration:'none', display:'inline-block'}}
            >
              Follow on Spotify
            </a>
          </section>
          <footer>
            <div className="footer-logo">Come Alive Studio</div>
            <div className="footer-links">
              {['Library','Booking','Contact'].map(l => (
                <a key={l} onClick={() => setPage(l.toLowerCase())}>{l}</a>
              ))}

              {user && (
                <a onClick={() => setPage('dashboard')}>Dashboard</a>
              )}
            </div>
            <div className="footer-copy">© 2026 Come Alive Vision · Vienna</div>
          </footer>
        </>
      )}
      {page==='library' && (
        <Library
          user={user}
          isPremium={isPremium}
          setPage={setPage}
          progressMap={progressMap}
          saveProgress={saveProgress}
        />
      )}
      {page==='booking'   && <Booking isPremium={isPremium} />}
      {page==='contact'   && <Contact />}
      {page==='dashboard' && (
        user ? (
          <Dashboard
            user={user}
            plan={plan}
            planStatus={planStatus}
            planExpiresAt={planExpiresAt}
            trialEndsAt={trialEndsAt}
            cancelAtPeriodEnd={cancelAtPeriodEnd}
            stripeCustomerId={stripeCustomerId}
            progressMap={progressMap}
            saveProgress={saveProgress}
            isPremium={isPremium}
          />
        ) : (
          <div style={{paddingTop:'8rem', textAlign:'center', color:'var(--mist)'}}>
            Please sign in to access your dashboard.
          </div>
        )
      )}
    </>
  )
}
