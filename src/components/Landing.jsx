import { useEffect } from "react";
import gsap from "gsap";
import { BRAND } from "../lib/constants";

/* ---------------------------------------------------------------------- */
/* Brutalist B&W static wipe transition                                    */
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

        {/* Binary art PC — image is the frame, overlay sits on the screen area */}
        <div className="binary-pc-wrapper">
          {/* The binary art image */}
          <img src="/binary-pc.png" alt="Binary PC" className="binary-pc-img" />

          {/* Overlay positioned over the blank screen area of the image */}
          <div className="binary-pc-overlay">
            {/* Dyson Sphere */}
            <div className="binary-dyson">
              <img
                src="/logo1.png"
                alt="Cyscom"
                style={{
                  position: "absolute",
                  width: 44, height: 44,
                  objectFit: "contain",
                  zIndex: 10,
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              />
              <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", animation: "cgCoreSpin 40s linear infinite" }}>
                <div style={{ position: "absolute", inset: 4, border: "2px dashed #0ea5e9", borderRadius: "50%", animation: "cgSpin1 8s linear infinite" }} />
                <div style={{ position: "absolute", inset: 4, border: "2px dashed #0ea5e9", borderRadius: "50%", animation: "cgSpin2 12s linear infinite" }} />
                <div style={{ position: "absolute", inset: 4, border: "2px solid #0ea5e9", borderRadius: "50%", animation: "cgSpin3 10s linear infinite" }} />
                <div style={{ position: "absolute", inset: 4, border: "2px solid #0ea5e9", borderRadius: "50%", animation: "cgSpin4 15s linear infinite" }} />
              </div>
            </div>

            {/* Enter Portal button */}
            <button className="binary-enter-btn" onClick={onEnter}>
              [ ENTER PORTAL ]
            </button>
          </div>
        </div>

        <style>{`
          @keyframes cgSpin1 { 0% { transform: rotateX(90deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(90deg) rotateY(0deg) rotateZ(360deg); } }
          @keyframes cgSpin2 { 0% { transform: rotateX(0deg) rotateY(90deg) rotateZ(0deg); } 100% { transform: rotateX(0deg) rotateY(90deg) rotateZ(-360deg); } }
          @keyframes cgSpin3 { 0% { transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg); } 100% { transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg); } }
          @keyframes cgSpin4 { 0% { transform: rotateX(-45deg) rotateY(-45deg) rotateZ(0deg); } 100% { transform: rotateX(-45deg) rotateY(-45deg) rotateZ(-360deg); } }
          @keyframes cgCoreSpin { 0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); } }
        `}</style>
      </div>
      
    </div>
  );
}