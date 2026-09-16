import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------- */
/* Ambient matrix-rain background — cheap canvas loop, not a GIF/video.    */
/* Sits behind all app content (z-index 0) at low opacity so it reads as   */
/* texture, not noise. Respects prefers-reduced-motion.                    */
/* ---------------------------------------------------------------------- */

const GLYPHS = "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF$#%&<>/\\|+-*";
const FONT_SIZE = 15;

export default function MatrixRain({ opacity = 0.16 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf, cols, drops, w, h, last = 0;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      cols = Math.max(1, Math.floor(w / FONT_SIZE));
      drops = new Array(cols).fill(0).map(() => Math.random() * -60);
    }
    resize();
    window.addEventListener("resize", resize);

    function tick(t) {
      raf = requestAnimationFrame(tick);
      if (t - last < 60) return; // ~16fps — deliberate, terminal-like cadence
      last = t;

      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < cols; i++) {
        const glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        ctx.fillStyle = Math.random() > 0.94 ? "#93c5fd" : "#1d4ed8";
        ctx.fillText(glyph, x, y);

        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}
