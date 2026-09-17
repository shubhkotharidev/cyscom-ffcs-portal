import { useState } from "react";
import { DEPARTMENTS } from "../lib/constants";

export default function Departments({ user, users = [], onLock }) {
  const [selected, setSelected] = useState(user.departments || []);
  const [blocked, setBlocked] = useState(false);

  const LIMITS = { tech: 15, webdev: 15, events: 15, design: 5, social: 5, outreach: 5 };

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
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 12,
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
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "22px 10px 18px",
                border: isSel
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
                background: isSel ? "var(--accent-soft)" : "var(--bg-panel)",
                borderRadius: 2,
                cursor: (user.locked || (!isSel && isFull)) ? "default" : "pointer",
                opacity: (user.locked && !isSel) || (!isSel && isFull) ? 0.6 : 1,
                textAlign: "center",
                transition: "border-color 0.18s, background 0.18s, opacity 0.18s",
                userSelect: "none",
              }}
            >
              {/* Preference badge or Full indicator */}
              {(isSel || isFull) && (
                <span style={{
                  position: "absolute",
                  top: 6,
                  right: 8,
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: (user.locked || isFull) ? "var(--accent)" : "var(--accent)",
                }}>
                  {isSel ? (user.locked ? "LOCKED" : `P${order + 1}`) : "FULL"}
                </span>
              )}

              {/* Glyph */}
              <div style={{
                fontSize: 26,
                fontFamily: "var(--mono)",
                color: isSel ? "var(--accent)" : "var(--text-dim)",
                lineHeight: 1,
              }}>
                {d.glyph}
              </div>

              {/* Name */}
              <div style={{
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: "0.07em",
                color: isSel ? "var(--accent)" : "var(--text-dim)",
              }}>
                {d.name.toUpperCase()}
              </div>

              {/* Description — always visible */}
              <div style={{
                fontSize: 9.5,
                color: "var(--text-dim)",
                lineHeight: 1.5,
                marginTop: 2,
              }}>
                {d.desc}
              </div>

              {/* Capacity indicator */}
              <div style={{
                fontSize: 9,
                fontWeight: 700,
                color: isFull ? "var(--danger)" : "var(--accent-2)",
                marginTop: 6,
                padding: "2px 6px",
                border: `1px solid ${isFull ? "var(--danger)" : "var(--accent-2)"}`,
                borderRadius: 10,
              }}>
                {isFull ? "FULL (0 SEATS)" : `${Math.max(0, limit - currentCount)} SEATS AVAILABLE`}
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
