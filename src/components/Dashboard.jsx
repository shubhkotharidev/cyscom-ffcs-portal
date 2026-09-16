import { useState } from "react";
import { deptName } from "../lib/constants";

function StatCard({ label, value, accent, small }) {
  return (
    <div className="cg-panel" style={{ padding: "16px 18px" }}>
      <div className="cg-label">{label}</div>
      <div className="cg-display" style={{ fontSize: small ? 15 : 30, fontWeight: 600, marginTop: 6, color: accent ? "var(--accent)" : "var(--text)", wordBreak: "break-word" }}>
        {value}
      </div>
    </div>
  );
}

export default function Dashboard({ user, setTab, onSubmitContribution, pending }) {
  const [description, setDescription] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  // Pending submissions for this user
  const myPending = (pending || []).filter((p) => p.email === user.email);

  function handleLogContribution(e) {
    e.preventDefault();
    if (!description.trim() || !driveLink.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitContribution({
        description: description.trim(),
        driveLink: driveLink.trim(),
      });
      setDescription("");
      setDriveLink("");
      setIsSubmitting(false);
      setSubmitMsg("Submitted! An admin will review your contribution soon.");
      setTimeout(() => setSubmitMsg(""), 4000);
    }, 600);
  }

  function formatLink(url) {
    if (!url) return "#";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  }

  return (
    <div className="cg-fade-in">
      <div className="cg-label">WELCOME BACK</div>
      <div className="cg-display" style={{ fontSize: 32, fontWeight: 600, margin: "6px 0 28px" }}>{user.name}</div>

      {/* Stats Grid */}
      <div className="cg-dashboard-stats">
        <StatCard label="POINTS" value={user.points} accent />
        <StatCard label="CONTRIBUTIONS" value={user.contributions.length} />
        <StatCard label="PREFERENCE 1" value={user.locked ? deptName(user.departments[0]) : "NOT LOCKED"} small />
        <StatCard label="PREFERENCE 2" value={user.locked ? deptName(user.departments[1]) : "NOT LOCKED"} small />
      </div>

      {!user.locked && (
        <div className="cg-panel" style={{ padding: 18, marginBottom: 28, borderColor: "var(--warn)" }}>
          <div style={{ fontSize: 13, color: "var(--warn)", marginBottom: 8 }}>⚠ Department selection required</div>
          <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 12, lineHeight: 1.6 }}>
            Select and lock 2 departments before you can apply to projects.
          </div>
          <button className="cg-btn cg-btn-solid" onClick={() => setTab("departments")}>SELECT DEPARTMENTS →</button>
        </div>
      )}

      {/* Log Contribution Form */}
      <div className="cg-label" style={{ marginBottom: 10 }}>LOG NEW CONTRIBUTION</div>
      <div className="cg-panel" style={{ padding: "20px", marginBottom: 28 }}>
        <form onSubmit={handleLogContribution} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div className="cg-label" style={{ marginBottom: 6 }}>SHORT DESCRIPTION</div>
            <input
              className="cg-input"
              placeholder="e.g. Designed poster for Annual Symposium"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="cg-label" style={{ marginBottom: 6 }}>GOOGLE DRIVE LINK</div>
            <input
              type="text"
              className="cg-input"
              placeholder="Paste link here..."
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              required
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <button
              type="submit"
              className="cg-btn cg-btn-solid"
              disabled={isSubmitting || !description.trim() || !driveLink.trim()}
            >
              {isSubmitting ? "SUBMITTING…" : "SUBMIT FOR REVIEW"}
            </button>
            {submitMsg && <div style={{ fontSize: 12, color: "var(--accent)" }}>{submitMsg}</div>}
          </div>
        </form>
      </div>

      {/* Pending Submissions */}
      {myPending.length > 0 && (
        <>
          <div className="cg-label" style={{ marginBottom: 10 }}>PENDING SUBMISSIONS</div>
          <div style={{ marginBottom: 28 }}>
            {myPending.map((sub) => (
              <div key={sub.id} className={`cg-submission-card ${sub.status}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 13, marginBottom: 4 }}>{sub.description}</div>
                    {sub.driveLink && (
                      <a href={formatLink(sub.driveLink)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--accent-2)" }}>
                        Drive link ↗
                      </a>
                    )}
                    <div style={{ fontSize: 10.5, color: "var(--text-dim)", marginTop: 6 }}>
                      Submitted {sub.submittedAt}
                    </div>
                  </div>
                  <span className={`cg-badge cg-badge-${sub.status}`}>
                    {sub.status === "pending" ? "Pending" : sub.status === "approved" ? "Approved" : "Rejected"}
                  </span>
                </div>
                {sub.status === "approved" && sub.awardedPoints && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "var(--accent)" }}>+{sub.awardedPoints} pts awarded</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Approved Contribution Log */}
      <div className="cg-label" style={{ marginBottom: 10 }}>CONTRIBUTION LOG</div>
      <div className="cg-panel" style={{ padding: user.contributions.length ? 0 : 18 }}>
        {user.contributions.length === 0 && (
          <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>No approved contributions yet. Points are awarded by admins after reviewing your submissions.</div>
        )}
        {user.contributions.map((c, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: i < user.contributions.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div>
              <div style={{ fontSize: 13 }}>{c.title}</div>
              <div style={{ fontSize: 10.5, color: "var(--text-dim)", marginTop: 2 }}>{c.date}</div>
            </div>
            <div style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>+{c.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
}