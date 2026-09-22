import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { BRAND, SUBTITLE } from "../lib/constants";

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
              
              <div style={{ alignSelf: "center", position: "relative", width: 64, height: 64, flexShrink: 0, perspective: 300, zIndex: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src="/logo1.png" alt="Cyscom" style={{ position: "absolute", width: 44, height: 44, objectFit: "contain", zIndex: 2, pointerEvents: "none", transform: "translateZ(0px)" }} />
                <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", animation: "cgDysonOrbitA 7s linear infinite" }}>
                  <div style={{ position: "absolute", inset: 0, border: "1px dashed rgba(33,212,253,0.5)", borderRadius: "50%", animation: "cgDysonSpin 6s linear infinite" }}>
                    <div style={{ position: "absolute", top: -2, left: "calc(50% - 2px)", width: 4, height: 4, borderRadius: "50%", background: "#dcfffa", boxShadow: "0 0 6px rgba(33,212,253,0.9)" }} />
                  </div>
                </div>
                <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", animation: "cgDysonOrbitB 11s linear infinite" }}>
                  <div style={{ position: "absolute", inset: -10, border: "1px dashed rgba(57,255,156,0.45)", borderRadius: "50%", animation: "cgDysonSpin 9s linear infinite reverse" }}>
                    <div style={{ position: "absolute", top: -2, left: "calc(50% - 2px)", width: 4, height: 4, borderRadius: "50%", background: "#dcfffa", boxShadow: "0 0 6px rgba(33,212,253,0.9)" }} />
                  </div>
                </div>
                <style>
                  {`
                    @keyframes cgDysonSpin { from { transform: rotateZ(0deg); } to { transform: rotateZ(360deg); } }
                    @keyframes cgDysonOrbitA { 0% { transform: rotateX(75deg) rotateY(0deg); } 50% { transform: rotateX(75deg) rotateY(180deg); } 100% { transform: rotateX(75deg) rotateY(360deg); } }
                    @keyframes cgDysonOrbitB { 0% { transform: rotateX(60deg) rotateY(0deg); } 50% { transform: rotateX(60deg) rotateY(-180deg); } 100% { transform: rotateX(60deg) rotateY(-360deg); } }
                  `}
                </style>
              </div>

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