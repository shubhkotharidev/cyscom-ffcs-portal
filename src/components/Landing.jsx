import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { BRAND, SUBTITLE } from "../lib/constants";
import DysonSphere from "./DysonSphere";

/* ---------------------------------------------------------------------- */
/* Brutalist B&W static wipe transition                                   */
/* ---------------------------------------------------------------------- */
export function PixelTransition({ onDone }) {
  const COLS = 14;
  const ROWS = 10;
  
  useEffect(() => {
    const tl = gsap.timeline();
    tl.to('.tb', {
      scale: 1.05,
      duration: 0.15,
      stagger: { amount: 0.5, from: 'random', grid: [ROWS, COLS] },
      ease: 'power1.inOut'
    })
    .to('.tb', {
      scale: 0,
      duration: 0.15,
      stagger: { amount: 0.5, from: 'random', grid: [ROWS, COLS] },
      ease: 'power1.inOut',
      onComplete: onDone,
      delay: 0.1
    });

    return () => tl.kill();
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`
      }}
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <div 
          key={i} 
          className="tb" 
          style={{ 
            background: "#000", 
            transform: "scale(0)",
            transformOrigin: "center"
          }} 
        />
      ))}
    </div>
  );
}


export default function Landing({ onEnter }) {
  return (
    <div className="cg-fade-in" style={{ minHeight: "100vh", background: "#fff", color: "#000", position: "relative", zIndex: 3 }}>
      
      <div className="landing-hero" style={{ alignItems: "center", textAlign: "center", paddingTop: "8vh" }}>
        <h1 style={{ fontFamily: "'Barrio', cursive", fontSize: "clamp(48px, 10vw, 96px)", lineHeight: 1, margin: 0 }}>{BRAND} FFCS</h1>

        <div className="pixel-pc-setup" style={{ transform: "scale(1.4)", transformOrigin: "top center", marginTop: 20 }}>
          <div className="pixel-pc">
            <div className="pixel-pc-screen" style={{ flexDirection: "column", justifyContent: "space-between" }}>
              <div className="pixel-pc-text">C:\&gt;_</div>
              
              <DysonSphere />

              <button className="pixel-pc-enter-btn" onClick={onEnter}>
                [ENTER_PORTAL]
              </button>

            </div>
            <div className="pixel-pc-drive"></div>
            <div className="pixel-pc-drive-btn"></div>
          </div>
          <div className="pixel-pc-peripherals">
            <div className="pixel-pc-keyboard"></div>
            <div className="pixel-pc-mouse"></div>
          </div>
        </div>
      </div>
      
    </div>
  );
}