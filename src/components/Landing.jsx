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

        <div className="pixel-pc-wrapper">
          <div className="pixel-pc-setup">
          
          <div className="pixel-pc-container" style={{ position: "relative" }}>
            {/* Pen Stand */}
            <div className="pc-pen-stand">
              <div className="pc-pens">
                <div className="pc-pen pen-1"></div>
                <div className="pc-pen pen-2"></div>
                <div className="pc-pen pen-3"></div>
              </div>
              <div className="pc-pen-cup">
                <img src="/logo1.png" style={{ width: 24, opacity: 0.9 }} alt="" />
              </div>
            </div>

            {/* Monitor */}
            <div className="pixel-pc">
              {/* Sticky Note */}
              <div className="pc-sticky-note">
                Nihara<br/>Please<br/>Approve<br/>Design<br/>:)
              </div>
              
              <div className="pc-screen-bezel">
                <div className="pixel-pc-screen" style={{ flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ alignSelf: "center", position: "relative", width: 80, height: 80, flexShrink: 0, perspective: 800, zIndex: 4, display: "flex", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                    <img src="/logo1.png" alt="Cyscom" style={{ position: "absolute", width: 44, height: 44, objectFit: "contain", zIndex: 10, pointerEvents: "none", transform: "translateZ(0px)" }} />
                    
                    <div style={{ position: "absolute", inset: 5, transformStyle: "preserve-3d", animation: "cgCoreSpin 40s linear infinite" }}>
                      <div style={{ position: "absolute", inset: 5, border: "2px dashed #0ea5e9", borderRadius: "50%", animation: "cgSpin1 8s linear infinite" }} />
                      <div style={{ position: "absolute", inset: 5, border: "2px dashed #0ea5e9", borderRadius: "50%", animation: "cgSpin2 12s linear infinite" }} />
                      <div style={{ position: "absolute", inset: 5, border: "2px solid #0ea5e9", borderRadius: "50%", animation: "cgSpin3 10s linear infinite" }} />
                      <div style={{ position: "absolute", inset: 5, border: "2px solid #0ea5e9", borderRadius: "50%", animation: "cgSpin4 15s linear infinite" }} />
                    </div>

                    <style>
                      {`
                        @keyframes cgSpin1 { 0% { transform: rotateX(90deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(90deg) rotateY(0deg) rotateZ(360deg); } }
                        @keyframes cgSpin2 { 0% { transform: rotateX(0deg) rotateY(90deg) rotateZ(0deg); } 100% { transform: rotateX(0deg) rotateY(90deg) rotateZ(-360deg); } }
                        @keyframes cgSpin3 { 0% { transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg); } 100% { transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg); } }
                        @keyframes cgSpin4 { 0% { transform: rotateX(-45deg) rotateY(-45deg) rotateZ(0deg); } 100% { transform: rotateX(-45deg) rotateY(-45deg) rotateZ(-360deg); } }
                        @keyframes cgCoreSpin { 0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); } }
                      `}
                    </style>
                  </div>

                  <button className="pixel-pc-enter-btn" onClick={onEnter}>
                    <div style={{ fontSize: 20, letterSpacing: "2px" }}>[ ENTER PORTAL ]</div>
                    <div className="pc-cursor-blink">-</div>
                  </button>

                </div>
              </div>
            </div>

            {/* Base / PC Case */}
            <div className="pc-base">
              <div className="pc-drive-slot"></div>
              <div className="pc-drive-btn"></div>
            </div>
          </div>

          <div className="pixel-pc-peripherals">
            <div className="pixel-pc-keyboard">
              <div className="pc-keys"></div>
            </div>
            <div className="pixel-pc-mouse">
              <div className="pc-mouse-wire"></div>
            </div>
          </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}