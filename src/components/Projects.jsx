import { useState } from "react";
import { deptName } from "../lib/constants";

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
      <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 22 }}>
        Seat-based allocation. All members can apply to any open project. Once a project fills up, it locks.
      </div>

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
