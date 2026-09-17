import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { BRAND, SUBTITLE, SEED_PROJECTS } from "../lib/constants";

/* ---------------------------------------------------------------------- */
/* Pixel cover transition (landing -> login)                              */
/* ---------------------------------------------------------------------- */

const COLS = 22;
const ROWS = 13;

export function PixelTransition({ onDone }) {
  const gridRef = useRef(null);
  const tiles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      const tone = Math.random();
      arr.push({ color: tone > 0.88 ? "#60a5fa" : tone > 0.55 ? "#2563eb" : "#081026" });
    }
    return arr;
  }, []);

  useEffect(() => {
    const tilesEls = gridRef.current.querySelectorAll(".cg-pixel-tile");
    gsap.set(tilesEls, { scale: 0 });

    const tl = gsap.timeline({ onComplete: onDone });

    tl.to(tilesEls, {
      scale: 1,
      duration: 0.12,
      stagger: { each: 0.03, from: "center", grid: [ROWS, COLS] },
      ease: "power2.in",
    }).to(
      tilesEls,
      {
        scale: 0,
        duration: 0.15,
        stagger: { each: 0.02, from: "edges", grid: [ROWS, COLS] },
        ease: "power2.out",
      },
      "+=0.9"
    );

    return () => tl.kill();
  }, [onDone]);

  return (
    <div
      ref={gridRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        background: "#000",
      }}
    >
      {tiles.map((tile, i) => (
        <div key={i} className="cg-pixel-tile" style={{ background: tile.color }} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Terminal prompt — type /enter to proceed                               */
/* ---------------------------------------------------------------------- */

function TerminalPrompt({ onEnter }) {
  const [cmd, setCmd] = useState("");
  const [state, setState] = useState("idle"); // idle | focused | error

  function handleSubmit(e) {
    e.preventDefault();
    if (cmd.trim().toLowerCase() === "/enter") {
      onEnter();
    } else {
      setState("error");
      setCmd("");
      setTimeout(() => setState("focused"), 400);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`cg-terminal-shell ${state}`}>
      <span className="cg-corner tl" />
      <span className="cg-corner tr" />
      <span className="cg-corner bl" />
      <span className="cg-corner br" />
      <span className="cg-terminal-prompt">&gt;</span>
      <input
        className="cg-terminal-input"
        type="text"
        value={cmd}
        onChange={(e) => setCmd(e.target.value)}
        onFocus={() => setState("focused")}
        onBlur={() => setState((s) => (s === "error" ? s : "idle"))}
        placeholder="/enter"
        size={Math.max(cmd.length, 6)}
        autoFocus
        spellCheck={false}
        autoComplete="off"
      />
    </form>
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
        padding: "24px" 
      }}
    >
      {/* Background Dyson Sphere */}
      <div className="landing-dyson-bg">
        <div className="dyson-container">
          <div className="dyson-sphere">
            <div className="dyson-ring r1"></div>
            <div className="dyson-ring r2"></div>
            <div className="dyson-ring r3"></div>
            <div className="dyson-ring r4"></div>
          </div>
          <img src="/logo1.png" alt={BRAND} className="dyson-logo" />
        </div>
      </div>

      {/* Foreground Glassmorphism Card */}
      <div className="landing-glass-card">
        <span className="cg-logo-hero">CYSCOM</span>
        <div className="cg-label" style={{ marginTop: 14, marginBottom: 46, textAlign: "center" }}>
          {SUBTITLE}
        </div>

        <TerminalPrompt onEnter={onEnter} />
      </div>
    </div>
  );
}