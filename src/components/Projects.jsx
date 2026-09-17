import { useState } from "react";

export default function Projects({ user, projects, projectRequests = [], onRequest }) {
  const [requestingId, setRequestingId] = useState(null);

  if (!user.locked) {
    return (
      <div className="cg-panel" style={{ padding: 24 }}>
        <div style={{ fontSize: 14, marginBottom: 6 }}>Lock your departments first</div>
        <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>You need 2 locked departments before you can view and apply to projects.</div>
      </div>
    );
  }

  async function handleRequest(projectId) {
    setRequestingId(projectId);
    await onRequest(projectId);
    setRequestingId(null);
  }

  return (
    <div>
      <div className="cg-display" style={{ fontSize: 28, fontWeight: 600, margin: "6px 0 8px" }}>Projects</div>
      <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 22 }}>
        Apply to any open project below. Your request will be reviewed by an admin before you're added.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {projects.length === 0 ? (
          <div className="cg-panel cg-empty" style={{ gridColumn: "1 / -1" }}>No projects available at the moment.</div>
        ) : (
          projects.map((p) => {
            const full = p.seatsFilled >= p.seatsTotal;
            const isApproved = (p.applicants || []).includes(user.email);
            const myRequest = projectRequests.find(
              (r) => r.projectId === p.id && r.email === user.email
            );
            const isPending = myRequest?.status === "pending";
            const isRejected = myRequest?.status === "rejected";
            const isRequesting = requestingId === p.id;

            // Button label and state
            let btnLabel, btnClass, btnDisabled;
            if (isApproved) {
              btnLabel = "APPROVED ✓"; btnClass = ""; btnDisabled = true;
            } else if (isPending) {
              btnLabel = "REQUESTED"; btnClass = ""; btnDisabled = true;
            } else if (full) {
              btnLabel = "SEATS FULL"; btnClass = ""; btnDisabled = true;
            } else if (isRequesting) {
              btnLabel = "REQUESTING…"; btnClass = "cg-btn-solid"; btnDisabled = true;
            } else {
              btnLabel = isRejected ? "REQUEST AGAIN" : "REQUEST TO JOIN";
              btnClass = "cg-btn-solid";
              btnDisabled = false;
            }

            return (
              <div key={p.id} className="cg-panel" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="cg-label" style={{ color: "var(--accent)" }}>PROJECT</div>
                  {full && <div style={{ fontSize: 10, color: "var(--danger)", border: "1px solid var(--danger)", padding: "2px 6px" }}>LOCKED</div>}
                  {isRejected && !full && (
                    <div style={{ fontSize: 10, color: "var(--warn)", border: "1px solid var(--warn)", padding: "2px 6px" }}>REJECTED</div>
                  )}
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
                {isPending && (
                  <div style={{ fontSize: 11, color: "var(--warn)", textAlign: "center", padding: "6px 0" }}>
                    Awaiting admin approval
                  </div>
                )}
                <button
                  className={`cg-btn ${btnClass}`}
                  disabled={btnDisabled}
                  onClick={() => handleRequest(p.id)}
                  style={{ marginTop: 4 }}
                >
                  {btnLabel}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
