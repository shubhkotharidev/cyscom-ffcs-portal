import { useState } from "react";
import { DEPARTMENTS, deptName } from "../lib/constants";

export default function Projects({ user, projects, onApply }) {
  const [applyingId, setApplyingId] = useState(null);

  if (!user.locked) {
    return (
      <div className="cg-panel" style={{ padding: 24 }}>
        <div style={{ fontSize: 14, marginBottom: 6 }}>Lock your departments first</div>
        <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>You need 2 locked departments before you can view and apply to projects.</div>
      </div>
    );
  }

  async function handleApply(projectId) {
    setApplyingId(projectId);
    await onApply(projectId);
    setApplyingId(null);
  }

  return (
    <div>
      <div className="cg-display" style={{ fontSize: 28, fontWeight: 600, margin: "6px 0 8px" }}>Projects</div>
      <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 28 }}>
        Seat-based allocation. Apply to any open project below. Once a project fills up, it locks.
      </div>

      {/* ── Department Cards ── */}
      <div className="cg-label" style={{ marginBottom: 12 }}>YOUR DEPARTMENTS</div>
      <div className="cg-dept-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 10,
        marginBottom: 32,
      }}>
        {DEPARTMENTS.map((dept) => {
          const isPref1 = user.departments[0] === dept.id;
          const isPref2 = user.departments[1] === dept.id;
          const isSelected = isPref1 || isPref2;
          return (
            <div
              key={dept.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "16px 8px",
                border: isSelected
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
                background: isSelected
                  ? "var(--accent-soft)"
                  : "var(--bg-panel)",
                borderRadius: 2,
                textAlign: "center",
                position: "relative",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              <div style={{
                fontSize: 22,
                fontFamily: "var(--mono)",
                color: isSelected ? "var(--accent)" : "var(--text-dim)",
                lineHeight: 1,
              }}>
                {dept.glyph}
              </div>
              <div style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: isSelected ? "var(--accent)" : "var(--text-dim)",
              }}>
                {dept.name.toUpperCase()}
              </div>
              {(isPref1 || isPref2) && (
                <div style={{
                  position: "absolute",
                  top: 5,
                  right: 6,
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "var(--accent)",
                }}>
                  P{isPref1 ? "1" : "2"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Projects ── */}
      <div className="cg-label" style={{ marginBottom: 12 }}>OPEN PROJECTS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {projects.length === 0 ? (
          <div className="cg-panel cg-empty" style={{ gridColumn: "1 / -1" }}>No projects available at the moment.</div>
        ) : (
          projects.map((p) => {
            const full = p.seatsFilled >= p.seatsTotal;
            const applied = (p.applicants || []).includes(user.email);
            const canApply = !full && !applied;
            const isApplying = applyingId === p.id;
            return (
              <div key={p.id} className="cg-panel" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="cg-label" style={{ color: "var(--accent)" }}>PROJECT</div>
                  {full && <div style={{ fontSize: 10, color: "var(--danger)", border: "1px solid var(--danger)", padding: "2px 6px" }}>LOCKED</div>}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600 }} className="cg-display">{p.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6, flexGrow: 1 }}>{p.brief}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                  <div className="cg-seatbar">
                    {Array.from({ length: p.seatsTotal }).map((_, i) => (
                      <div key={i} className={`cg-seat ${i < p.seatsFilled ? (full ? "full" : "filled") : ""}`} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{p.seatsFilled}/{p.seatsTotal} seats</div>
                </div>
                <button
                  className={`cg-btn ${canApply ? "cg-btn-solid" : ""}`}
                  disabled={!canApply || isApplying}
                  onClick={() => handleApply(p.id)}
                  style={{ marginTop: 4 }}
                >
                  {isApplying ? "APPLYING…" : applied ? "APPLIED ✓" : full ? "SEATS FULL" : "APPLY"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
