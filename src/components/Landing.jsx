import { useEffect, useState } from "react";
import { BRAND, SUBTITLE } from "../lib/constants";

/* ---------------------------------------------------------------------- */
/* Simple fade transition (landing -> login)                              */
/* ---------------------------------------------------------------------- */

export function PixelTransition({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 400); // Quick fade time
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="cg-fade-in"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "var(--bg)",
      }}
    />
  );
}

/* ---------------------------------------------------------------------- */
/* Landing                                                                */
/* ---------------------------------------------------------------------- */

export default function Landing({ onEnter }) {
  return (
    <div 
      className="cg-fade-in" 
      style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        justifyContent: "center",
        position: "relative", 
        zIndex: 3, 
        padding: "24px",
        background: "var(--bg)"
      }}
    >
      <div className="landing-glass-card">
        <span className="cg-logo-hero">FFCS</span>
        <div style={{ marginTop: 12, marginBottom: 46, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-dim)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>
          BY CYSCOM
        </div>
        <button className="cg-btn cg-btn-solid" onClick={onEnter} style={{ fontSize: 12, padding: "12px 32px", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>
          INITIALIZE SYSTEM
        </button>
      </div>
    </div>
  );
}