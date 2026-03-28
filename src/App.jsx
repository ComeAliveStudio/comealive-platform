import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&family=Outfit:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0e0d0b; --parchment: #f5f0e8; --warm-white: #faf8f3;
    --gold: #b8955a; --gold-light: #d4b07a; --gold-dim: #7a5f35;
    --slate: #2a2825; --mist: #9e9890; --border: rgba(184,149,90,0.25); --radius: 4px;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'Outfit', sans-serif; background: var(--ink); color: var(--parchment); font-weight: 300; line-height: 1.6; overflow-x: hidden; }
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 3rem; background: rgba(14,13,11,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
  .nav-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 400; letter-spacing: 0.15em; color: var(--gold); text-decoration: none; text-transform: uppercase; cursor: pointer; }
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
  @keyframes scrollPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
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
  .tier-card.featured::before { content: 'Most Popular'; position: absolute; top: -1px; left: 50%; transform: translateX(-50%); background: var(--gold); color: var(--ink); font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; padding: 0.3rem 1rem; font-weight: 500; }
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
  .course-tab:hover { color: var(--parchment); }
  .videos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
  .video-card { background: var(--slate); border: 1px solid var(--border); overflow: hidden; cursor: pointer; transition: all 0.2s; position: relative; }
  .video-card:hover { border-color: var(--gold); transform: translateY(-2px); }
  .video-thumb { aspect-ratio: 16/9; background: linear-gradient(135deg, #1a1713 0%, #2a2825 100%); display: flex; align-items: center; justify-content: center; position: relative; }
  .video-thumb-icon { width: 44px; height: 44px; border-radius: 50%; background: rgba(184,149,90,0.15); border: 1px solid var(--gold); display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: 1rem; }
  .video-lock { position: absolute; top: 0.8rem; right: 0.8rem; background: rgba(14,13,11,0.8); padding: 0.3rem 0.6rem; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mist); border: 1px solid var(--border); font-family: 'DM Mono', monospace; }
  .video-free { background: rgba(184,149,90,0.15); color: var(--gold); border-color: var(--gold-dim); }
  .video-info { padding: 1.2rem; }
  .video-duration { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--mist); letter-spacing: 0.1em; margin-bottom: 0.4rem; }
  .video-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: var(--parchment); line-height: 1.3; margin-bottom: 0.4rem; }
  .video-desc { font-size: 0.78rem; color: var(--mist); }
  .booking { background: var(--slate); }
  .booking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; max-width: 900px; margin: 2rem auto 0; }
  .session-types { display: flex; flex-direction: column; gap: 1rem; }
  .session-type { border: 1px solid var(--border); padding: 1.5rem; cursor: pointer; transition: all 0.2s; background: var(--ink); }
  .session-type:hover, .session-type.active { border-color: var(--gold); }
  .session-type.active { background: rgba(184,149,90,0.05); }
  .session-name { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: var(--parchment); margin-bottom: 0.3rem; }
  .session-meta { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: var(--gold); letter-spacing: 0.1em; }
  .booking-form { display: flex; flex-direction: column; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-label { font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mist); font-family: 'DM Mono', monospace; }
  .form-input, .form-select, .form-textarea { background: var(--ink); border: 1px solid var(--border); color: var(--parchment); padding: 0.75rem 1rem; font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 300; transition: border-color 0.2s; width: 100%; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--gold); }
  .form-select { appearance: none; }
  .form-textarea { resize: vertical; min-height: 100px; }
  .contact { background: var(--ink); }
  .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 5rem; max-width: 950px; margin: 2rem auto 0; align-items: start; }
  .contact-info p { color: var(--mist); font-size: 0.92rem; margin-bottom: 2rem; }
  .contact-detail { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  .contact-detail-icon { width: 36px; height: 36px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: 0.9rem; flex-shrink: 0; }
  .contact-detail-text { font-size: 0.85rem; color: var(--mist); }
  .contact-detail-text strong { color: var(--parchment); display: block; font-weight: 400; }
  .dashboard { min-height: 100vh; background: var(--ink); padding-top: 5rem; }
  .dash-header { padding: 2rem 3rem; border-bottom: 1px solid var(--border); background: var(--slate); display: flex; justify-content: space-between; align-items: center; }
  .dash-welcome { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 300; }
  .dash-welcome span { color: var(--gold); }
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
  .progress-fill { height: 100%; background: var(--gold); border-radius: 2px; }
  footer { padding: 3rem; background: var(--slate); border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
  .footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 1rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); }
  .footer-links { display: flex; gap: 2rem; }
  .footer-links a { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--mist); text-decoration: none; transition: color 0.2s; cursor: pointer; }
  .footer-links a:hover { color: var(--gold); }
  .footer-copy { font-size: 0.7rem; color: var(--mist); }
  .max-w { max-width: 1100px; margin: 0 auto; }
  .text-center { text-align: center; }
  .success-msg { background: rgba(184,149,90,0.1); border: 1px solid var(--gold); padding: 2rem; text-align: center; font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: var(--gold); }
  @media (max-width: 768px) {
    nav { padding: 1rem 1.5rem; } .nav-links { display: none; } section { padding: 4rem 1.5rem; }
    .about-grid, .booking-grid, .contact-grid, .tiers-grid, .dash-grid { grid-template-columns: 1fr; }
    .hero { padding: 6rem 1.5rem 3rem; } .dash-cards { grid-template-columns: 1fr; }
  }
`;

const courses = {
  "Filmmaking": [
    { id:1,  title:"The Myth of the Budget",               duration:"18 min", free:true,  desc:"Why money is not the answer, and what to ask instead." },
    { id:2,  title:"Hire for Attitude, Trade for Skill",   duration:"22 min", free:true,  desc:"Building your team from scratch, find the right alchemy." },
    { id:3,  title:"Preparation is Key",                   duration:"25 min", free:false, desc:"The moment you start preparing you are close to the goal." },
    { id:4,  title:"Post-Production Survival Guide",       duration:"30 min", free:false, desc:"The way to picture lock is never straight." },
    { id:5,  title:"Festivals & Distribution Decoded",     duration:"28 min", free:false, desc:"Where to send your film and how to get it seen." },
    { id:6,  title:"Make Money With Your Film",            duration:"20 min", free:false, desc:"Revenue streams most indie filmmakers never consider." },
  ],
  "Mindset": [
    { id:7,  title:"Stop Thinking Negative",               duration:"16 min", free:true,  desc:"The science of negativity and how to rewire it." },
    { id:8,  title:"The Growth Mindset in Practice",       duration:"19 min", free:false, desc:"Fixed vs growth for identity-based habits." },
    { id:9,  title:"Visualisation for Real Results",       duration:"21 min", free:false, desc:"How elite performers use mental rehearsal." },
    { id:10, title:"Goal Setting That Works",              duration:"17 min", free:false, desc:"SMART goals, DUMB goals, and the 10-minute rule." },
  ],
  "Relationships": [
    { id:11, title:"Dating in the Post-Narcissistic Era",  duration:"24 min", free:true,  desc:"How to spot patterns before they become drama." },
    { id:12, title:"Attachment Styles Explained",         duration:"22 min", free:false, desc:"Anxious, avoidant or secure?" },
    { id:13, title:"The 4 Gates Model",                   duration:"26 min", free:false, desc:"A practical framework for choosing your next partner." },
    { id:14, title:"The 90-Day Reset Plan",               duration:"20 min", free:false, desc:"Structured recovery from toxic relational patterns." },
  ],
  "Coaching": [
    { id:15, title:"Coach Yourself to Mastery",           duration:"23 min", free:true,  desc:"The self-coaching toolkit for lasting confidence." },
    { id:16, title:"Building Unshakeable Confidence",     duration:"18 min", free:false, desc:"Action loops and the science of self-belief." },
    { id:17, title:"Boundaries Without Guilt",            duration:"20 min", free:false, desc:"Why saying no is an act of self-respect." },
    { id:18, title:"Emotional Mastery in Relationships",  duration:"25 min", free:false, desc:"Triggers, patterns, and conscious response." },
  ],
};

const sessions = [
  { id:1, name:"Discovery Session",    meta:"45 min · Free", desc:"First conversation. We map where you are and where you want to go." },
  { id:2, name:"Filmmaking Strategy",  meta:"60 min · €60",  desc:"Script, budget, team, distribution. A full production roadmap for your project." },
  { id:3, name:"Relationship Clarity", meta:"60 min · €90",  desc:"Patterns, attachment styles, and a framework for what comes next." },
  { id:4, name:"Mindset Coaching",     meta:"60 min · €120", desc:"Limiting beliefs, growth habits, and a 30-day action plan." },
];

const FORMSPREE = "https://formspree.io/f/xgopawdr";

function NavBar({ setPage }) {
  return (
    <nav>
      <span className="nav-logo" onClick={() => setPage('home')}>Come Alive Studio</span>
      <ul className="nav-links">
        {['Library','Booking','Contact'].map(p => (
          <li key={p}><a onClick={() => setPage(p.toLowerCase())}>{p}</a></li>
        ))}
      </ul>
      <button className="nav-cta" onClick={() => setPage('dashboard')}>Member Area</button>
    </nav>
  );
}

function Hero({ setPage }) {
  return (
    <section className="hero">
      <div className="hero-bg" /><div className="hero-grain" />
      <div className="hero-content">
        <div className="hero-eyebrow">Come Alive Studio · Vienna</div>
        <h1>Make it<br /><em>Happen.</em></h1>
        <p className="hero-sub">
          As former business consultant, author and coach, I've produced indie films with no budget, worked for corporate clients all over Europe and co-interviewed former presidents and ministers in 7 consecutive world public forums. Over the course of these years, I learned to question many rules before rewriting my own.
        </p>
        <p className="hero-sub" style={{marginTop:'-1rem'}}>
          Two Decades. Hundreds of hours. One consistent belief: limitations can become an opportunity, once we learn to work with them. This platform exists because I spent years recording content for other people's channels — until I decided it was time to build something of my own.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage('library')}>Explore Courses</button>
          <button className="btn-ghost" onClick={() => setPage('booking')}>Book a Session</button>
        </div>
      </div>
      <div className="hero-scroll">Scroll</div>
    </section>
  );
}

function About() {
  return (
    <section className="about">
      <div className="about-grid max-w">
        <div>
          <div className="about-portrait">
            <div className="about-portrait-inner">A.D.</div>
          </div>
        </div>
        <div className="about-text">
          <div className="section-label">About</div>
          <h2>My work experience ranges from<br /><em>automotive to independent film</em></h2>
          <p>Having lived in Brazil, the UK, Italy, and the US, I completed my engineering thesis at UCR Riverside before joining Ford and BMW Italy as a sales trainer and innovation consultant.</p>
          <p>As my career evolved into film production, I moved to Vienna where I worked as film & media producer, coordinating content for the World Public Forum in Rhodes across 6 editions — more than 150 interviews and 200 hours of conferences.</p>
          <p>In recent years I developed a deep interest in personal growth and relationship psychology, publishing six books and obtaining an MBA and a coaching certification with EMCC Global.</p>
          <div className="about-stats">
            <div className="stat"><div className="stat-num">25+</div><div className="stat-label">Years international experience</div></div>
            <div className="stat"><div className="stat-num">6</div><div className="stat-label">Books published</div></div>
            <div className="stat"><div className="stat-num">450+</div><div className="stat-label">Festival screenings</div></div>
            <div className="stat"><div className="stat-num">7</div><div className="stat-label">World Public Forums</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tiers({ setPage }) {
  return (
    <section style={{background:'var(--ink)'}}>
      <div className="max-w text-center">
        <div className="section-label" style={{justifyContent:'center'}}>Membership</div>
        <h2>Choose your <em>level of access</em></h2>
        <p style={{color:'var(--mist)', maxWidth:480, margin:'0 auto', fontSize:'0.9rem'}}>
          Free content to start. Premium when you're ready to go deeper.
        </p>
        <div className="tiers-grid">
          <div className="tier-card">
            <div className="tier-name">Explorer</div>
            <div className="tier-price">€0 <span>/ forever</span></div>
            <div className="tier-desc">Access to all free episodes across every track.</div>
            <ul className="tier-features">
              <li>Free episodes in all 4 tracks</li>
              <li>Podcast access on Spotify</li>
              <li>Newsletter & updates</li>
              <li>Community access</li>
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
            <button className="tier-btn tier-btn-filled">Join Professional — €29/mo</button>
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
            <button className="tier-btn tier-btn-outline" onClick={() => setPage('booking')}>Apply for Mastery</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Library() {
  const [activeTab, setActiveTab] = useState("Filmmaking");
  return (
    <div className="library" style={{paddingTop:'6rem'}}>
      <div className="max-w" style={{padding:'0 3rem'}}>
        <div className="section-label">Course Library</div>
        <h2>Everything in one place.<br /><em>Organised by track.</em></h2>
        <p style={{color:'var(--mist)', marginBottom:'2.5rem', fontSize:'0.9rem', maxWidth:520}}>
          Free episodes marked clearly. Premium content unlocks with Professional membership.
        </p>
        <div className="course-tabs">
          {Object.keys(courses).map(tab => (
            <button key={tab} className={`course-tab ${activeTab===tab?'active':''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>
        <div className="videos-grid">
          {courses[activeTab].map(v => (
            <div className="video-card" key={v.id}>
              <div className="video-thumb">
                <div className="video-thumb-icon">▶</div>
                <div className={`video-lock ${v.free?'video-free':''}`}>{v.free?'Free':'Premium'}</div>
              </div>
              <div className="video-info">
                <div className="video-duration">{v.duration}</div>
                <div className="video-title">{v.title}</div>
                <div className="video-desc">{v.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Booking() {
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', timezone:'', message:'' });

  const handleSubmit = async () => {
    setSending(true);
    try {
      await fetch(FORMSPREE, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          session: sessions[selected].name + ' — ' + sessions[selected].meta,
          timezone: form.timezone,
          message: form.message,
          _subject: 'New Booking Request — ' + sessions[selected].name
        })
      });
      setSubmitted(true);
    } catch(e) { setSending(false); }
  };

  return (
    <div style={{background:'var(--slate)', paddingTop:'6rem', minHeight:'100vh'}}>
      <div className="max-w" style={{padding:'4rem 3rem'}}>
        <div className="section-label">Book a Session</div>
        <h2>Work directly <em>with Angelo</em></h2>
        <div className="booking-grid">
          <div>
            <p style={{color:'var(--mist)', fontSize:'0.88rem', marginBottom:'1.5rem'}}>Choose the session that fits where you are right now. The Discovery call is always free.</p>
            <div className="session-types">
              {sessions.map((s,i) => (
                <div key={s.id} className={`session-type ${selected===i?'active':''}`} onClick={() => setSelected(i)}>
                  <div className="session-name">{s.name}</div>
                  <div className="session-meta">{s.meta}</div>
                </div>
              ))}
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
                <div className="form-group"><label className="form-label">Tell me where you are</label><textarea className="form-textarea" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="What are you working on? Where are you stuck?" /></div>
                <button className="btn-primary" style={{width:'100%'}} onClick={handleSubmit} disabled={sending}>{sending?'Sending…':'Request Session'}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', subject:'Filmmaking question', message:'' });

  const handleSubmit = async () => {
    setSending(true);
    try {
      await fetch(FORMSPREE, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, _subject: 'Contact: ' + form.subject })
      });
      setSubmitted(true);
    } catch(e) { setSending(false); }
  };

  return (
    <div className="contact" style={{paddingTop:'6rem', minHeight:'100vh'}}>
      <div className="max-w" style={{padding:'4rem 3rem'}}>
        <div className="section-label">Contact</div>
        <h2>Let's start a <em>conversation</em></h2>
        <div className="contact-grid">
          <div className="contact-info">
            <p>Whether you have a question about the courses, want to collaborate on a film project, or just want to say hello — the door is open.</p>
            {[
              {icon:'✉', label:'Email', value:'office@comealive.vision'},
              {icon:'🌐', label:'Website', value:'comealive.vision'},
              {icon:'📍', label:'Based in', value:'Vienna, Austria'},
              {icon:'📸', label:'Instagram', value:'@comealivestudio'},
            ].map(d => (
              <div className="contact-detail" key={d.label}>
                <div className="contact-detail-icon">{d.icon}</div>
                <div className="contact-detail-text"><strong>{d.label}</strong>{d.value}</div>
              </div>
            ))}
          </div>
          <div>
            {submitted ? (
              <div className="success-msg">Message sent.<br /><span style={{fontSize:'1rem', color:'var(--mist)'}}>I'll reply within 48 hours. Usually much faster.</span></div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" /></div>
                <div className="form-group"><label className="form-label">Subject</label>
                  <select className="form-select" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
                    <option>Filmmaking question</option>
                    <option>Coaching enquiry</option>
                    <option>Collaboration proposal</option>
                    <option>Something else</option>
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
  );
}

function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const navItems = [
    {id:'overview', label:'Overview', icon:'◈'},
    {id:'courses',  label:'My Courses', icon:'▤'},
    {id:'sessions', label:'Sessions', icon:'◷'},
    {id:'messages', label:'Messages', icon:'◻'},
    {id:'profile',  label:'Profile', icon:'◯'},
  ];
  const progress = { Filmmaking:40, Mindset:15, Relationships:65, Coaching:20 };
  return (
    <div className="dashboard">
      <div className="dash-header">
        <div className="dash-welcome">Welcome back, <span>Angelo</span></div>
        <div style={{fontFamily:'DM Mono', fontSize:'0.65rem', color:'var(--mist)', letterSpacing:'0.1em'}}>Professional Plan · Active</div>
      </div>
      <div className="dash-grid">
        <div className="dash-sidebar">
          {navItems.map(item => (
            <div key={item.id} className={`dash-nav-item ${activeSection===item.id?'active':''}`} onClick={() => setActiveSection(item.id)}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>
        <div className="dash-content">
          {activeSection==='overview' && (
            <>
              <div className="dash-cards">
                <div className="dash-card"><div className="dash-card-label">Episodes Watched</div><div className="dash-card-value">7</div><div className="dash-card-sub">of 18 total</div><div className="progress-bar"><div className="progress-fill" style={{width:'38%'}} /></div></div>
                <div className="dash-card"><div className="dash-card-label">Sessions Completed</div><div className="dash-card-value">2</div><div className="dash-card-sub">Next: April 7th</div></div>
                <div className="dash-card"><div className="dash-card-label">Membership</div><div className="dash-card-value" style={{fontSize:'1.4rem', marginTop:'0.3rem'}}>Professional</div><div className="dash-card-sub">Renews May 1st</div></div>
              </div>
              <div className="section-label">Progress by Track</div>
              {Object.entries(progress).map(([track, pct]) => (
                <div key={track} style={{marginBottom:'1.5rem'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}>
                    <span style={{fontSize:'0.85rem', color:'var(--parchment)'}}>{track}</span>
                    <span style={{fontFamily:'DM Mono', fontSize:'0.65rem', color:'var(--gold)'}}>{pct}%</span>
                  </div>
                  <div className="progress-bar" style={{height:'4px'}}><div className="progress-fill" style={{width:`${pct}%`}} /></div>
                </div>
              ))}
            </>
          )}
          {activeSection==='courses' && (
            <>
              <div className="section-label">Continue Watching</div>
              <div className="videos-grid">
                {courses["Filmmaking"].slice(0,3).map(v => (
                  <div className="video-card" key={v.id}>
                    <div className="video-thumb"><div className="video-thumb-icon">▶</div></div>
                    <div className="video-info"><div className="video-duration">{v.duration}</div><div className="video-title">{v.title}</div></div>
                  </div>
                ))}
              </div>
            </>
          )}
          {activeSection==='sessions' && (
            <>
              <div className="section-label">Upcoming Sessions</div>
              <div style={{background:'var(--slate)', border:'1px solid var(--border)', padding:'1.8rem', marginBottom:'1rem'}}>
                <div style={{fontFamily:'Cormorant Garamond', fontSize:'1.2rem', color:'var(--parchment)', marginBottom:'0.4rem'}}>Filmmaking Strategy Session</div>
                <div style={{fontFamily:'DM Mono', fontSize:'0.65rem', color:'var(--gold)', marginBottom:'0.8rem'}}>April 7, 2026 · 14:00 CET · 60 min</div>
                <div style={{fontSize:'0.8rem', color:'var(--mist)'}}>Via Zoom · Link sent to email</div>
              </div>
            </>
          )}
          {activeSection==='messages' && (
            <>
              <div className="section-label">Direct Messages</div>
              <div style={{padding:'3rem', border:'1px solid var(--border)', textAlign:'center'}}>
                <div style={{fontFamily:'Cormorant Garamond', fontSize:'1.4rem', color:'var(--mist)', marginBottom:'0.8rem'}}>No messages yet</div>
                <p style={{fontSize:'0.82rem', color:'var(--mist)'}}>Mastery members can message Angelo directly here.</p>
              </div>
            </>
          )}
          {activeSection==='profile' && (
            <>
              <div className="section-label">Your Profile</div>
              <div style={{display:'flex', flexDirection:'column', gap:'1rem', maxWidth:480}}>
                {['Full Name','Email','Location','Timezone'].map(f => (
                  <div className="form-group" key={f}><label className="form-label">{f}</label><input className="form-input" type="text" /></div>
                ))}
                <button className="btn-primary" style={{alignSelf:'flex-start'}}>Save Changes</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  return (
    <>
      <style>{css}</style>
      <NavBar setPage={setPage} />
      {page==='home' && (
        <>
          <Hero setPage={setPage} />
          <About />
          <Tiers setPage={setPage} />
          <section style={{background:'var(--slate)', padding:'5rem 3rem', textAlign:'center'}}>
            <div className="section-label" style={{justifyContent:'center'}}>Podcast</div>
            <h2>Make It Happen<br /><em>premieres May 2026</em></h2>
            <p style={{color:'var(--mist)', maxWidth:460, margin:'0 auto 2rem', fontSize:'0.9rem'}}>
              The independent filmmaker's survival guide. New episodes every week on Spotify.
            </p>
            <button className="btn-primary">Follow on Spotify</button>
          </section>
          <footer>
            <div className="footer-logo">Come Alive Studio</div>
            <div className="footer-links">
              {['Library','Booking','Contact'].map(l => (
                <a key={l} onClick={() => setPage(l.toLowerCase())}>{l}</a>
              ))}
            </div>
            <div className="footer-copy">© 2026 Come Alive Vision · Vienna</div>
          </footer>
        </>
      )}
      {page==='library'   && <Library />}
      {page==='booking'   && <Booking />}
      {page==='contact'   && <Contact />}
      {page==='dashboard' && <Dashboard />}
    </>
  );
}
