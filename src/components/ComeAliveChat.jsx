"use client";
/**
 * COME ALIVE GUIDE — Universal Chat Widget
 * ─────────────────────────────────────────────────────────────────
 * File: components/ComeAliveChat.jsx
 *
 * Usage:
 *   import ComeAliveChat from "./components/ComeAliveChat";
 *   <ComeAliveChat />
 *
 * Features:
 *   - Onboarding step: user pastes their website or LinkedIn URL
 *   - The API uses that URL to personalise interview questions
 *   - Bilingual IT/EN auto-detection
 *   - Gold floating button, dark theme matching Come Alive Studio
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from "react";

// ─── Design tokens — match Come Alive Studio palette ─────────────
const C = {
  bg:       "#0f0f0f",
  surface:  "#1a1a1a",
  surfaceAlt: "#141414",
  border:   "rgba(0,85,117,0.35)",
  accent:   "#4f889f",       // --gold in the app
  accentLight: "#6fa0b2",
  text:     "#e8eff2",
  muted:    "#7fa5b5",
  userBg:   "rgba(79,136,159,0.12)",
  botBg:    "#1a2530",
  fontMono: "'DM Mono', monospace",
  fontSerif:"'Cormorant Garamond', serif",
  fontSans: "'Outfit', sans-serif",
};

// ─── Helpers ──────────────────────────────────────────────────────

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function isValidUrl(str) {
  try { new URL(str.startsWith("http") ? str : "https://" + str); return true; }
  catch { return false; }
}

function normaliseUrl(str) {
  if (!str) return "";
  return str.startsWith("http") ? str : "https://" + str;
}

/** Minimal markdown: **bold** and line breaks */
function Txt({ children }) {
  const text = children || "";
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <span key={li}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={pi} style={{ color: C.accent }}>{part.slice(2, -2)}</strong>
              : <span key={pi}>{part}</span>
          )}
          {li < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

function Dots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "8px 14px", alignSelf: "flex-start" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          display: "inline-block", width: 6, height: 6,
          borderRadius: "50%", background: C.muted,
          animation: `ca-bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Onboarding screen ────────────────────────────────────────────

function OnboardingScreen({ onSubmit, lang }) {
  const [url, setUrl]       = useState("");
  const [error, setError]   = useState("");
  const inputRef            = useRef(null);

  const IT = lang === "it";

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleSkip() { onSubmit(""); }

  function handleGo() {
    const trimmed = url.trim();
    if (!trimmed) { onSubmit(""); return; }
    if (!isValidUrl(trimmed)) {
      setError(IT ? "Inserisci un URL valido (es. linkedin.com/in/tuoprofilo)" : "Please enter a valid URL (e.g. linkedin.com/in/yourprofile)");
      return;
    }
    setError("");
    onSubmit(normaliseUrl(trimmed));
  }

  function handleKey(e) {
    if (e.key === "Enter") handleGo();
  }

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      padding: "24px 20px", gap: 20,
    }}>
      <div style={{ fontFamily: C.fontSerif, fontSize: 20, color: C.text, lineHeight: 1.3 }}>
        {IT ? <>Ciao. Prima di iniziare,<br /><em style={{ color: C.accent }}>parliamo di te.</em></>
             : <>Hello. Before we start,<br /><em style={{ color: C.accent }}>let's make this about you.</em></>}
      </div>

      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
        {IT
          ? "Se incolli il link del tuo sito o del tuo profilo LinkedIn, potrò personalizzare l'intervista in base al tuo lavoro e al tuo percorso."
          : "Paste your website or LinkedIn URL and I'll tailor the interview to your work, background, and where you're headed."}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label style={{
          fontFamily: C.fontMono, fontSize: 10,
          letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted,
        }}>
          {IT ? "Il tuo sito o profilo LinkedIn" : "Your website or LinkedIn profile"}
        </label>
        <input
          ref={inputRef}
          value={url}
          onChange={e => { setUrl(e.target.value); setError(""); }}
          onKeyDown={handleKey}
          placeholder={IT ? "es. linkedin.com/in/tuonome" : "e.g. linkedin.com/in/yourname"}
          style={{
            background: C.surfaceAlt, border: `1px solid ${error ? "#c0392b" : C.border}`,
            borderRadius: 8, padding: "10px 14px",
            color: C.text, fontSize: 13.5, fontFamily: C.fontSans, outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e => e.target.style.borderColor = error ? "#c0392b" : C.border}
        />
        {error && (
          <span style={{ fontSize: 11.5, color: "#e07070" }}>{error}</span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
        <button
          onClick={handleGo}
          style={{
            background: C.accent, color: C.bg, border: "none",
            borderRadius: 8, padding: "11px 0",
            fontFamily: C.fontSans, fontWeight: 500,
            fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={e => e.target.style.background = C.accentLight}
          onMouseLeave={e => e.target.style.background = C.accent}
        >
          {IT ? "Inizia l'intervista →" : "Start the interview →"}
        </button>
        <button
          onClick={handleSkip}
          style={{
            background: "transparent", color: C.muted,
            border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 0",
            fontFamily: C.fontSans, fontSize: 12.5,
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer", transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.target.style.color = C.text; e.target.style.borderColor = C.muted; }}
          onMouseLeave={e => { e.target.style.color = C.muted; e.target.style.borderColor = C.border; }}
        >
          {IT ? "Salta — procedi senza" : "Skip — continue without"}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────

export default function ComeAliveChat({ defaultOpen = false }) {
  const [open, setOpen]         = useState(defaultOpen);
  const [stage, setStage]       = useState("onboarding"); // onboarding | chat
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [cta, setCta]           = useState(null);
  const [userUrl, setUserUrl]   = useState("");
  const [sessionId, setSessionId] = useState(uid);
  const [lang, setLang]         = useState("en"); // detected after first message
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  // Detect rough language preference from browser
  useEffect(() => {
    const nav = (navigator.language || navigator.userLanguage || "en").slice(0, 2).toLowerCase();
    if (nav === "it") setLang("it");
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when chat stage opens
  useEffect(() => {
    if (stage === "chat") setTimeout(() => inputRef.current?.focus(), 80);
  }, [stage]);

  // ── API call ────────────────────────────────────────────────────
  async function sendToApi(text, contextUrl = "") {
  setLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        message: text,
        userUrl: contextUrl || userUrl,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || data?.reply || `HTTP ${res.status}`);
    }

    if (data.lang) setLang(data.lang);

    console.log("Provider used:", data.provider);

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: data.reply }
    ]);

    if (data.cta) setCta(data.cta);
  } catch (err) {
    console.error("ComeAliveChat frontend error:", err);

    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        content:
          lang === "it"
            ? "Qualcosa non ha funzionato. Riprova tra un momento."
            : "Something went wrong. Please try again."
      }
    ]);
  } finally {
    setLoading(false);
  }
}

  // ── Onboarding complete ─────────────────────────────────────────
  function handleOnboardingSubmit(url) {
    setUserUrl(url);
    setStage("chat");
    // Greet — pass the URL as context in the opening ping
    sendToApi("hi", url);
  }

  // ── Send a chat message ─────────────────────────────────────────
  function handleSubmit(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    sendToApi(text);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  }

  // ── Launcher button ─────────────────────────────────────────────
  if (!open) return (
    <>
      <style>{KEYFRAMES}</style>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Come Alive Guide"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          background: C.accent, color: C.bg,
          border: "none", borderRadius: 50,
          padding: "13px 22px", cursor: "pointer",
          fontFamily: C.fontSans, fontWeight: 500,
          fontSize: 13.5, letterSpacing: "0.08em", textTransform: "uppercase",
          boxShadow: "0 4px 24px rgba(79,136,159,0.45)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(79,136,159,0.65)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "0 4px 24px rgba(79,136,159,0.45)"; }}
      >
        Come Alive Guide ✦
      </button>
    </>
  );

  // ── Chat window ─────────────────────────────────────────────────
  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        role="dialog"
        aria-label="Come Alive Guide"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          width: 380, maxWidth: "calc(100vw - 32px)", maxHeight: "82vh",
          display: "flex", flexDirection: "column",
          background: C.bg, border: `1px solid ${C.border}`,
          borderRadius: 18, overflow: "hidden",
          boxShadow: "0 12px 48px rgba(0,0,0,0.75)",
          fontFamily: C.fontSans,
          animation: "ca-slide-up 0.2s ease",
        }}
      >
        {/* ── Header ───────────────────────────────────────── */}
        <div style={{
          padding: "14px 18px", flexShrink: 0,
          borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: C.surface,
        }}>
          <div>
            <div style={{ color: C.accent, fontFamily: C.fontMono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Come Alive Guide
            </div>
            <div style={{ color: C.muted, fontFamily: C.fontSerif, fontSize: 12.5, marginTop: 2, fontStyle: "italic" }}>
              by Angelo D'Agostino
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Reset button — goes back to onboarding */}
            {stage === "chat" && (
              <button
                onClick={() => { setStage("onboarding"); setMessages([]); setCta(null); setUserUrl(""); }}
                title="Start over"
                aria-label="Start over"
                style={{
                  background: "none", border: "none",
                  color: C.muted, cursor: "pointer",
                  fontSize: 13, padding: 4, lineHeight: 1,
                }}
              >
                ↺
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, padding: 4, lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        </div>

        {/* ── Onboarding or Chat ────────────────────────── */}
        {stage === "onboarding" ? (
          <OnboardingScreen onSubmit={handleOnboardingSubmit} lang={lang} />
        ) : (
          <>
            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto",
              padding: "16px 14px",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  background: m.role === "user" ? C.userBg : C.botBg,
                  border: `1px solid ${m.role === "user" ? C.accent + "55" : C.border}`,
                  borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  padding: "10px 14px",
                  fontSize: 13.5, lineHeight: 1.62, color: C.text,
                }}>
                  <Txt>{m.content}</Txt>
                </div>
              ))}

              {loading && <Dots />}

              {cta && !loading && (
                <a href={cta.url} style={{
                  alignSelf: "center", marginTop: 6,
                  background: C.accent, color: C.bg,
                  padding: "11px 22px", borderRadius: 10,
                  textDecoration: "none",
                  fontFamily: C.fontSans, fontWeight: 500,
                  fontSize: 12.5, letterSpacing: "0.1em", textTransform: "uppercase",
                  boxShadow: "0 2px 14px rgba(79,136,159,0.3)",
                }}>
                  {cta.text} →
                </a>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} style={{
              borderTop: `1px solid ${C.border}`,
              display: "flex", gap: 8, padding: "10px 12px",
              background: C.surface, flexShrink: 0,
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={lang === "it" ? "Scrivi qui…" : "Write here…"}
                disabled={loading}
                rows={1}
                style={{
                  flex: 1, background: C.bg,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: "9px 12px", color: C.text,
                  fontSize: 13.5, fontFamily: C.fontSans,
                  outline: "none", resize: "none", lineHeight: 1.5,
                  maxHeight: 80, overflowY: "auto",
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                style={{
                  background: C.accent, color: C.bg,
                  border: "none", borderRadius: 8,
                  padding: "9px 14px", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  fontSize: 16, opacity: loading || !input.trim() ? 0.4 : 1,
                  transition: "opacity 0.15s", flexShrink: 0,
                }}
              >
                ↑
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

const KEYFRAMES = `
  @keyframes ca-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
    40%            { transform: translateY(-5px); opacity: 1; }
  }
  @keyframes ca-slide-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
