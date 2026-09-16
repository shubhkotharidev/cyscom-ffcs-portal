import { useState } from "react";
import { DEPARTMENTS } from "../lib/constants";

export default function Departments({ user, onLock }) {
  const [selected, setSelected] = useState(user.departments || []);
  const [blocked, setBlocked] = useState(false);

  function toggle(id) {
    if (user.locked) return;
    if (selected.includes(id)) {
      setSelected((prev) => prev.filter((x) => x !== id));
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
      <div className="cg-dept-layout">
        <div className="cg-dept-sticky">
          <div className="cg-display" style={{ fontSize: 28, fontWeight: 600, margin: "6px 0 8px" }}>Departments</div>
          <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.6 }}>
            {user.locked
              ? "Your departments are locked in. Contact an admin if you need this changed."
              : "Choose exactly 2 departments. This choice locks permanently once confirmed."}
          </div>

          <div className="cg-label" style={{ marginBottom: 14 }}>
            {user.locked ? "STATUS: LOCKED" : `${selected.length} / 2 SELECTED`}
          </div>

          {!user.locked && (
            <button
              className="cg-btn cg-btn-solid"
              style={{ width: "100%" }}
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

        <div className={`cg-dept-stack ${blocked ? "shake" : ""}`}>
          {DEPARTMENTS.map((d) => {
            const isSel = selected.includes(d.id);
            const order = selected.indexOf(d.id);
            return (
              <div
                key={d.id}
                onClick={() => toggle(d.id)}
                className={`cg-dept-stack-item ${isSel ? "selected" : ""} ${user.locked ? "disabled" : ""}`}
                style={{ opacity: user.locked && !isSel ? 0.4 : 1 }}
              >
                <span className="cg-corner tl" />
                <span className="cg-corner tr" />
                <span className="cg-corner bl" />
                <span className="cg-corner br" />
                                {isSel && (
                  user.locked
                    ? <span className="cg-dept-locked-tag">LOCKED</span>
                    : <span className="cg-dept-badge">PREFERENCE {order + 1}</span>
                )}
                <div style={{ fontSize: 32, color: isSel ? "var(--accent)" : "var(--text-dim)", marginBottom: 14 }}>{d.glyph}</div>
                <div className="cg-display" style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{d.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>{d.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
