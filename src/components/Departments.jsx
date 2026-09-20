import { useState } from "react";
import { DEPARTMENTS } from "../lib/constants";

export default function Departments({ user, users = [], onLock }) {
  const [selected, setSelected] = useState(user.departments || []);
  const [blocked, setBlocked] = useState(false);

  const LIMITS = { tech: 32, webdev: 20, events: 35, design: 20, social: 20, outreach: 3 };

  function toggle(id) {
    if (user.locked) return;
    if (selected.includes(id)) {
      setSelected((prev) => prev.filter((x) => x !== id));
      return;
    }
    
    // Check if full
    const currentCount = users.filter((u) => u.departments.includes(id)).length;
    if (currentCount >= LIMITS[id]) {
      setBlocked(true);
      setTimeout(() => setBlocked(false), 350);
      return;
    }

    if (selected.length >= 2) {
      setBlocked(true);
      setTimeout(() => setBlocked(false), 350);
      return;
    }
    setSelected((prev) => [...prev, id]);
  }

  return (
    <div>
      <div className="cg-display" style={{ fontSize: 28, fontWeight: 600, margin: "6px 0 8px" }}>Departments</div>
      <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.6 }}>
        {user.locked
          ? "Your departments are locked in. Contact an admin if you need this changed."
          : "Choose exactly 2 departments. This choice locks permanently once confirmed."}
      </div>

      <div className="cg-label" style={{ marginBottom: 14 }}>
        {user.locked ? "STATUS: LOCKED" : `${selected.length} / 2 SELECTED`}
      </div>

      {/* ── Five square department cards ── */}
      <div className={`cg-dept-grid ${blocked ? "shake" : ""}`} style={{
        marginBottom: 28,
      }}>
        {DEPARTMENTS.map((d) => {
          const isSel = selected.includes(d.id);
          const order = selected.indexOf(d.id);
          const currentCount = users.filter((u) => u.departments.includes(d.id)).length;
          const limit = LIMITS[d.id] || 5;
          const isFull = currentCount >= limit;
          return (
            <div
              key={d.id}
              onClick={() => toggle(d.id)}
              className="cg-brutalist-card"
              style={{
                cursor: (user.locked || (!isSel && isFull)) ? "default" : "pointer",
                opacity: (user.locked && !isSel) || (!isSel && isFull) ? 0.5 : 1,
                background: isSel ? "#e5e5e5" : "#ffffff",
                transition: "transform 0.1s ease, box-shadow 0.1s ease",
                transform: isSel ? "translate(-2px, -2px)" : "none",
                boxShadow: isSel ? "6px 6px 0px #000" : "4px 4px 0px #000",
                userSelect: "none",
              }}
            >
              {/* Preference badge or Full indicator */}
              {(isSel || isFull) && (
                <div className="cg-sticker" style={{
                  top: -10,
                  right: -10,
                  transform: "rotate(10deg)",
                  background: isFull && !isSel ? "#888" : "#000",
                  color: "#fff",
                  fontSize: 10,
                }}>
                  {isSel ? (user.locked ? "LOCKED" : `P${order + 1}`) : "FULL"}
                </div>
              )}

              <div className="cg-brutalist-card-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10 }}>
                {/* Glyph */}
                <div style={{
                  fontSize: 32,
                  fontFamily: "var(--mono)",
                  color: "#000",
                  lineHeight: 1,
                  fontWeight: 800
                }}>
                  {d.glyph}
                </div>

                {/* Name */}
                <div style={{
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  color: "#000",
                }}>
                  {d.name.toUpperCase()}
                </div>

                {/* Description — always visible */}
                <div style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#000",
                  lineHeight: 1.4,
                  marginTop: 4,
                }}>
                  {d.desc}
                </div>

                {/* Capacity indicator */}
                <div style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#000",
                  marginTop: 10,
                  padding: "4px 8px",
                  border: "2px solid #000",
                  background: isFull ? "#888" : "#fff",
                }}>
                  {isFull ? "FULL (0 SEATS)" : `${Math.max(0, limit - currentCount)} SEATS AVAILABLE`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Lock button ── */}
      {!user.locked && (
        <button
          className="cg-btn cg-btn-solid"
          style={{ width: "100%", maxWidth: 320 }}
          disabled={selected.length !== 2}
          onClick={() => onLock(selected)}
        >
          {selected.length === 2 ? (
            <>LOCK DEPARTMENTS <span className="cg-blink">_</span></>
          ) : (
            `SELECT ${2 - selected.length} MORE`
          )}
        </button>
      )}
    </div>
  );
}
