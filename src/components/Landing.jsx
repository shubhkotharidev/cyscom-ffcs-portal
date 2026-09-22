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
              
              <div style={{ alignSelf: "center", position: "relative", width: 80, height: 80, flexShrink: 0, perspective: 400, zIndex: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src="/logo1.png" alt="Cyscom" style={{ position: "absolute", width: 44, height: 44, objectFit: "contain", zIndex: 2, pointerEvents: "none", transform: "translateZ(0px)" }} />
                
                {/* Outer Dashed Ring */}
                <div style={{ position: "absolute", inset: -12, transformStyle: "preserve-3d", animation: "cgDysonOrbitA 12s linear infinite" }}>
                  <div style={{ position: "absolute", inset: 0, border: "2px dashed #0ea5e9", borderRadius: "50%", animation: "cgDysonSpin 8s linear infinite" }}>
                    <div style={{ position: "absolute", top: -3, left: "calc(50% - 3px)", width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 8px #0ea5e9" }} />
                  </div>
                </div>

                {/* Middle Solid Ring */}
                <div style={{ position: "absolute", inset: -2, transformStyle: "preserve-3d", animation: "cgDysonOrbitB 10s linear infinite reverse" }}>
                  <div style={{ position: "absolute", inset: 0, border: "2px solid #0ea5e9", borderRadius: "50%", animation: "cgDysonSpin 6s linear infinite reverse" }}>
                    <div style={{ position: "absolute", top: -3, left: "calc(50% - 3px)", width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 8px #0ea5e9" }} />
                  </div>
                </div>

                {/* Inner Dotted Ring */}
                <div style={{ position: "absolute", inset: 8, transformStyle: "preserve-3d", animation: "cgDysonOrbitC 8s linear infinite" }}>
                  <div style={{ position: "absolute", inset: 0, border: "2px dotted #0ea5e9", borderRadius: "50%", animation: "cgDysonSpin 5s linear infinite" }}>
                    <div style={{ position: "absolute", top: -3, left: "calc(50% - 3px)", width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 8px #0ea5e9" }} />
                  </div>
                </div>

                <style>
                  {`
                    @keyframes cgDysonSpin { from { transform: rotateZ(0deg); } to { transform: rotateZ(360deg); } }
                    @keyframes cgDysonOrbitA { 0% { transform: rotateX(75deg) rotateY(0deg); } 50% { transform: rotateX(75deg) rotateY(180deg); } 100% { transform: rotateX(75deg) rotateY(360deg); } }
                    @keyframes cgDysonOrbitB { 0% { transform: rotateX(60deg) rotateY(0deg); } 50% { transform: rotateX(60deg) rotateY(-180deg); } 100% { transform: rotateX(60deg) rotateY(-360deg); } }
                    @keyframes cgDysonOrbitC { 0% { transform: rotateX(45deg) rotateY(0deg); } 50% { transform: rotateX(45deg) rotateY(180deg); } 100% { transform: rotateX(45deg) rotateY(360deg); } }
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