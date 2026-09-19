import { useState } from "react";
import { deptName } from "../lib/constants";

function StatCard({ label, value, accent, small }) {
  return (
    <div className="px-card" style={{ margin: 0 }}>
      <div className="px-stat-label">{label}</div>
      <div className={`px-stat-value${small ? " small" : ""}${accent ? " accent" : ""}`}>
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

  const myPending = (pending || []).filter((p) => p.email === user.email && p.status === "pending");
  const myRejected = (pending || []).filter((p) => p.email === user.email && p.status === "rejected");
  const rejectedLogs = myRejected.map((r) => ({
    title: r.description,
    date: r.reviewedAt || r.submittedAt,
    points: 0,
    isRejected: true,
  }));
  const combinedLogs = [...(user.contributions || []), ...rejectedLogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  function handleLogContribution(e) {
    e.preventDefault();
    if (!description.trim() || !driveLink.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitContribution({ description: description.trim(), driveLink: driveLink.trim() });
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
    <div className="px-root cg-fade-in">
      <div className="px-content">

        {/* ── Welcome ── */}
        <div style={{ marginBottom: 8 }}>
          <div className="px-heading">member dashboard</div>
          <div className="px-title">
            Welcome back,<br />
            <span>{user.name.split(" ")[0]}</span>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="px-stats-grid">
          <StatCard label="Points" value={user.points} accent />
          <StatCard label="Contributions" value={user.contributions.length} />
          <StatCard
            label="Preference 1"
            value={user.locked ? deptName(user.departments[0]) : "—"}
            small
          />
          <StatCard
            label="Preference 2"
            value={user.locked ? deptName(user.departments[1]) : "—"}
            small
          />
        </div>

        {/* ── Warning: Dept not selected ── */}
        {!user.locked && (
          <div className="px-alert">
            <div className="px-alert-title">⚠ Department selection required</div>
            <div className="px-alert-body">
              Select and lock 2 departments before you can apply to projects.
            </div>
            <button className="px-btn-ghost" onClick={() => setTab("departments")}>
              Select Departments →
            </button>
          </div>
        )}

        <hr className="px-divider" />

        {/* ── Log Contribution ── */}
        <div className="px-heading" style={{ marginBottom: 14 }}>log new contribution</div>
        <div className="px-card" style={{ marginBottom: 28 }}>
          <form onSubmit={handleLogContribution} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="px-label">Short Description</label>
              <input
                className="px-input"
                placeholder="e.g. Designed poster for Annual Symposium"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="px-label">Google Drive Link</label>
              <input
                className="px-input"
                placeholder="Paste link here..."
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                required
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <button
                type="submit"
                className="px-btn"
                disabled={isSubmitting || !description.trim() || !driveLink.trim()}
              >
                {isSubmitting ? "Submitting…" : "Submit for Review"}
              </button>
              {submitMsg && (
                <div style={{ fontSize: 12, color: "#1c6fff", letterSpacing: "0.05em" }}>
                  ✓ {submitMsg}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* ── Pending Submissions ── */}
        {myPending.length > 0 && (
          <>
            <div className="px-heading" style={{ marginBottom: 12 }}>pending submissions</div>
            <div style={{ marginBottom: 28 }}>
              {myPending.map((sub) => (
                <div key={sub.id} className="px-sub-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div className="px-sub-title">{sub.description}</div>
                      {sub.driveLink && (
                        <a
                          href={formatLink(sub.driveLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-sub-link"
                        >
                          Drive link ↗
                        </a>
                      )}
                      <div className="px-sub-meta" style={{ marginTop: 6 }}>
                        Submitted {sub.submittedAt}
                      </div>
                    </div>
                    <span className={`px-badge px-badge-${sub.status}`}>
                      {sub.status === "pending" ? "Pending" : sub.status === "approved" ? "Approved" : "Rejected"}
                    </span>
                  </div>
                  {sub.status === "approved" && sub.awardedPoints && (
                    <div style={{ marginTop: 10, fontSize: 12, color: "#1c6fff" }}>
                      +{sub.awardedPoints} pts awarded
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Contribution Log ── */}
        <div className="px-heading" style={{ marginBottom: 14 }}>contribution log</div>
        <div className="px-card">
          {combinedLogs.length === 0 ? (
            <div className="px-empty">
              No reviewed contributions yet —<br />
              points are awarded by admins after reviewing your submissions.
            </div>
          ) : (
            combinedLogs.map((c, i) => (
              <div key={i} className="px-log-row">
                <div>
                  <div className="px-log-title">{c.title}</div>
                  <div className="px-log-date">{c.date}</div>
                </div>
                <div className={`px-log-pts${c.isRejected ? " rejected" : ""}`}>
                  {c.isRejected ? "Rejected" : `+${c.points} pts`}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}