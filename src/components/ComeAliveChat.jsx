"use client";
/**
 * COME ALIVE GUIDE — Chat Widget
 * ─────────────────────────────────────────────────────────────────
 * File location in your project:  components/ComeAliveChat.jsx
 *
 * Usage — add to any page or to your root layout:
 *   import ComeAliveChat from "@/components/ComeAliveChat";
 *   ...
 *   <ComeAliveChat />
 *
 * The widget renders as a floating button (bottom-right).
 * On click it opens a chat window that calls /api/chat.
 * It handles bilingual responses automatically (IT / EN).
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from "react";

// ─── Design tokens ────────────────────────────────────────────────
const C = {
  bg:       "#0f0f0f",
  surface:  "#1a1a1a",
  border:   "#2a2a2a",
  accent:   "#c8a96e",   // warm gold
  text:     "#e8e8e8",
  muted:    "#777",
  userBg:   "rgba(200,169,110,0.12)",
  botBg:    "#1f1f1f",
};

// ─── Helpers ──────────────────────────────────────────────────────

function uuid() {
  return (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Minimal markdown renderer: **bold** and newlines.
 * Returns an array of React nodes.
 */
function renderText(text) {
  return text.split("\n").map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} style={{ color: C.accent }}>{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
    return (
      <span key={lineIdx}>
        {parts}
        {lineIdx < text.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

// Typing indicator dots
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "8px 14px", alignSelf: "flex-start" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: C.muted,
            animation: `ca-bounce 1.2s ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────

export default function ComeAliveChat({ defaultOpen = false }) {
  const [open, setOpen]         = useState(defaultOpen);
  const [messages, setMessages] = useState([]);   // { role, content }[]
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [cta, setCta]           = useState(null); // { text, url }
  const [sessionId]             = useState(uuid);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  // Send the opening greeting as soon as the chat opens for the first time
  useEffect(() => {
    if (open && messages.length === 0) {
      sendToApi("hi");
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function sendToApi(text) {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      if (data.cta) setCta(data.cta);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong. Please try again. / Qualcosa non ha funzionato. Riprova.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    sendToApi(text);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  // ── Launcher button ──────────────────────────────────────────────
  if (!open) {
    return (
      <>
        <style>{keyframeCSS}</style>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Come Alive Guide"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 9999,
            background: C.accent, color: "#000",
            border: "none", borderRadius: 50,
            padding: "13px 22px",
            cursor: "pointer",
            fontWeight: 700, fontSize: 13.5, letterSpacing: 0.3,
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            boxShadow: "0 4px 24px rgba(200,169,110,0.45)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 30px rgba(200,169,110,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 24px rgba(200,169,110,0.45)";
          }}
        >
          Come Alive Guide ✦
        </button>
      </>
    );
  }

  // ── Chat window ──────────────────────────────────────────────────
  return (
    <>
      <style>{keyframeCSS}</style>
      <div
        role="dialog"
        aria-label="Come Alive Guide chat"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          width: 380, maxWidth: "calc(100vw - 32px)",
          maxHeight: "82vh",
          display: "flex", flexDirection: "column",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 18,
          boxShadow: "0 12px 48px rgba(0,0,0,0.7)",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          overflow: "hidden",
          animation: "ca-slide-up 0.2s ease",
        }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{
          padding: "14px 18px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: C.surface,
          flexShrink: 0,
        }}>
          <div>
            <div style={{ color: C.accent, fontWeight: 700, fontSize: 14, letterSpacing: 0.2 }}>
              Come Alive Guide
            </div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
              by Angelo D'Agostino
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            style={{
              background: "none", border: "none",
              color: C.muted, cursor: "pointer",
              fontSize: 20, lineHeight: 1, padding: 4,
              borderRadius: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* ── Messages ───────────────────────────────────────── */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "16px 14px",
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "88%",
                background: m.role === "user" ? C.userBg : C.botBg,
                border: `1px solid ${m.role === "user" ? C.accent + "44" : C.border}`,
                borderRadius:
                  m.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                padding: "10px 14px",
                fontSize: 13.5,
                lineHeight: 1.6,
                color: C.text,
              }}
            >
              {renderText(m.content)}
            </div>
          ))}

          {loading && <TypingDots />}

          {/* CTA button — appears after synthesis */}
          {cta && !loading && (
            <a
              href={cta.url}
              style={{
                alignSelf: "center", marginTop: 6,
                background: C.accent, color: "#000",
                padding: "11px 22px", borderRadius: 10,
                textDecoration: "none",
                fontWeight: 700, fontSize: 13,
                boxShadow: "0 2px 14px rgba(200,169,110,0.35)",
                transition: "opacity 0.15s",
              }}
            >
              {cta.text} →
            </a>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input ──────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          style={{
            borderTop: `1px solid ${C.border}`,
            display: "flex", gap: 8, padding: "10px 12px",
            background: C.surface,
            flexShrink: 0,
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write here… / Scrivi qui…"
            disabled={loading}
            rows={1}
            style={{
              flex: 1,
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "9px 12px",
              color: C.text,
              fontSize: 13.5,
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
              lineHeight: 1.5,
              maxHeight: 80,
              overflowY: "auto",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              background: C.accent,
              color: "#000",
              border: "none",
              borderRadius: 10,
              padding: "9px 16px",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: 16,
              opacity: loading || !input.trim() ? 0.45 : 1,
              transition: "opacity 0.15s",
              flexShrink: 0,
            }}
            aria-label="Send message"
          >
            ↑
          </button>
        </form>
      </div>
    </>
  );
}

// ─── Keyframe CSS injected once ───────────────────────────────────
const keyframeCSS = `
  @keyframes ca-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40%            { transform: translateY(-5px); opacity: 1; }
  }
  @keyframes ca-slide-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
