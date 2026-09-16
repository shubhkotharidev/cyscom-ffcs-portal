import { useState } from "react";
import { createPortal } from "react-dom";
import { DEPARTMENTS, deptName } from "../lib/constants";

/* ══════════════════════════════════════════════════════════════════════ */
/* Helpers                                                                */
/* ══════════════════════════════════════════════════════════════════════ */

function RoleBadge({ role }) {
  const cls = role === "super_admin" ? "cg-badge-super" : role === "admin" ? "cg-badge-admin" : "cg-badge-member";
  const label = role === "super_admin" ? "Super Admin" : role === "admin" ? "Admin" : "Member";
  return <span className={`cg-badge ${cls}`}>{label}</span>;
}

function formatLink(url) {
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* Modals for Direct Points & Department Management                       */
/* ══════════════════════════════════════════════════════════════════════ */

function AssignPointsModal({ user, onConfirm, onClose }) {
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState("");

  function submit(e) {
    e.preventDefault();
    const pts = parseInt(points, 10);
    if (!title.trim() || !pts || pts <= 0) return;
    onConfirm(user.email, title.trim(), pts);
    onClose();
  }

  return createPortal(
    <div className="cg-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cg-modal">
        <button className="cg-modal-close" onClick={onClose}>✕</button>
        <div className="cg-label" style={{ marginBottom: 6 }}>ASSIGN TASK POINTS</div>
        <div className="cg-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Grant Points for Task</div>
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 18, padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", wordBreak: "break-all" }}>
          Target: <strong style={{ color: "var(--text)" }}>{user.name}</strong> ({user.regNo || user.email})
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="cg-form-row">
            <div className="cg-label">TASK / REASON TITLE</div>
            <input
              className="cg-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Workshop Lead / CTF Setup"
              style={{ marginTop: 6 }}
            />
          </div>
          <div className="cg-form-row">
            <div className="cg-label">POINTS TO AWARD</div>
            <input
              className="cg-input"
              type="number"
              min="1"
              placeholder="50"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
              style={{ marginTop: 6 }}
            />
          </div>
          <button type="submit" className="cg-btn cg-btn-super" disabled={!title.trim() || !points}>
            AWARD POINTS
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

function ManageDepartmentsModal({ user, onConfirm, onClose }) {
  const [dept1, setDept1] = useState(user.departments[0] || DEPARTMENTS[0].id);
  const [dept2, setDept2] = useState(user.departments[1] || DEPARTMENTS[1]?.id || DEPARTMENTS[0].id);

  function submit(e) {
    e.preventDefault();
    if (dept1 === dept2) {
      alert("Please select two distinct departments.");
      return;
    }
    onConfirm(user.email, [dept1, dept2]);
    onClose();
  }

  return createPortal(
    <div className="cg-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cg-modal">
        <button className="cg-modal-close" onClick={onClose}>✕</button>
        <div className="cg-label" style={{ marginBottom: 6 }}>MANAGE DEPARTMENTS</div>
        <div className="cg-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Set Department Preferences</div>
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 18, padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", wordBreak: "break-all" }}>
          Member: <strong style={{ color: "var(--text)" }}>{user.name}</strong> ({user.email})
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="cg-form-row">
            <div className="cg-label">PREFERENCE 1</div>
            <select className="cg-select" value={dept1} onChange={(e) => setDept1(e.target.value)} style={{ marginTop: 6 }}>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="cg-form-row">
            <div className="cg-label">PREFERENCE 2</div>
            <select className="cg-select" value={dept2} onChange={(e) => setDept2(e.target.value)} style={{ marginTop: 6 }}>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="cg-btn cg-btn-super">
            SAVE DEPARTMENTS
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/* Projects Tab                                                           */
/* ══════════════════════════════════════════════════════════════════════ */

function ProjectModal({ project, onSave, onClose }) {
  const isEdit = !!project;
  const [title, setTitle] = useState(project?.title || "");
  const [brief, setBrief] = useState(project?.brief || "");
  const [seats, setSeats] = useState(project?.seatsTotal || "");

  function submit(e) {
    e.preventDefault();
    const s = parseInt(seats, 10);
    if (!title.trim() || !brief.trim() || !s || s <= 0) return;
    onSave({
      id: project?.id || `p${Date.now()}`,
      title: title.trim(),
      brief: brief.trim(),
      seatsTotal: s,
      seatsFilled: project?.seatsFilled || 0,
      applicants: project?.applicants || [],
    });
    onClose();
  }

  return createPortal(
    <div className="cg-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cg-modal">
        <button className="cg-modal-close" onClick={onClose} title="Close">✕</button>
        
        <div style={{ marginBottom: 22 }}>
          <div className="cg-label" style={{ marginBottom: 4, color: "var(--accent)", letterSpacing: "0.14em" }}>
            {isEdit ? "EDIT PROJECT" : "NEW PROJECT"}
          </div>
          <div className="cg-display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>
            {isEdit ? "Update Project Details" : "Add New Project"}
          </div>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="cg-form-row">
            <label className="cg-label" style={{ display: "block", marginBottom: 6 }}>PROJECT TITLE</label>
            <input
              className="cg-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. CTF Infra / Web Portal"
            />
          </div>

          <div className="cg-form-row">
            <label className="cg-label" style={{ display: "block", marginBottom: 6 }}>TOTAL SEATS</label>
            <input
              className="cg-input"
              type="number"
              min="1"
              max="50"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              required
              placeholder="4"
            />
          </div>

          <div className="cg-form-row">
            <label className="cg-label" style={{ display: "block", marginBottom: 6 }}>PROJECT BRIEF</label>
            <textarea
              className="cg-textarea"
              rows={3}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              required
              placeholder="Short description of responsibilities and scope…"
              style={{ minHeight: 90 }}
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="submit" className="cg-btn cg-btn-super" style={{ flex: 1, padding: "13px 20px" }}>
              {isEdit ? "SAVE CHANGES" : "+ CREATE PROJECT"}
            </button>
            <button type="button" className="cg-btn" onClick={onClose} style={{ padding: "13px 20px" }}>
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

function ProjectsTab({ projects, onAdd, onEdit, onDelete, isSuperAdmin }) {
  const [modal, setModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <div>
      <div className="cg-admin-controls">
        <div className="cg-label" style={{ fontSize: 12, color: "var(--text-dim)" }}>
          PROJECT CATALOG ({projects.length})
        </div>
        {isSuperAdmin && (
          <button className="cg-btn cg-btn-super cg-btn-sm" onClick={() => setModal("new")}>+ ADD PROJECT</button>
        )}
      </div>

      <div className="cg-panel">
        <div className="cg-proj-row" style={{ cursor: "default" }}>
          <div className="cg-label">TITLE</div>
          <div className="cg-label">SEATS</div>
          <div className="cg-label">{isSuperAdmin ? "ACTIONS" : "STATUS"}</div>
        </div>
        {projects.length === 0 ? (
          <div className="cg-empty">No projects created yet.</div>
        ) : (
          projects.map((p) => {
            const pct = p.seatsTotal > 0 ? (p.seatsFilled / p.seatsTotal) * 100 : 0;
            const full = pct >= 100;
            return (
              <div key={p.id} className="cg-proj-row">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                  <div style={{ fontSize: 10.5, color: "var(--text-dim)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.brief}</div>
                </div>
                <div style={{ fontSize: 12 }}>
                  <span style={{ color: full ? "var(--danger)" : "var(--accent)", fontWeight: 600 }}>{p.seatsFilled}</span>
                  <span style={{ color: "var(--text-dim)" }}>/{p.seatsTotal}</span>
                </div>
                <div className="cg-proj-actions">
                  {isSuperAdmin ? (
                    <>
                      <button className="cg-btn cg-btn-sm" onClick={() => setModal(p)}>EDIT</button>
                      <button className="cg-btn cg-btn-danger cg-btn-sm" onClick={() => setConfirmDelete(p)}>DEL</button>
                    </>
                  ) : (
                    <span style={{ fontSize: 11, color: "var(--text-dim)" }}>View Only</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {modal && (
        <ProjectModal
          project={modal === "new" ? null : modal}
          onSave={modal === "new" ? onAdd : onEdit}
          onClose={() => setModal(null)}
        />
      )}

      {confirmDelete && createPortal(
        <div className="cg-modal-overlay" onClick={(e) => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div className="cg-modal">
            <button className="cg-modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            <div className="cg-label" style={{ marginBottom: 6 }}>CONFIRM DELETE</div>
            <div className="cg-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Delete Project?</div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 24 }}>
              Delete <strong style={{ color: "var(--text)" }}>{confirmDelete.title}</strong>? This cannot be undone.
            </div>
            <div className="cg-modal-actions">
              <button className="cg-btn cg-btn-danger" onClick={() => { onDelete(confirmDelete.id); setConfirmDelete(null); }}>YES, DELETE</button>
              <button className="cg-btn" onClick={() => setConfirmDelete(null)}>CANCEL</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/* Users & Departments Tab                                                */
/* ══════════════════════════════════════════════════════════════════════ */

function UserRow({ user, currentEmail, isSuperAdmin, onPromote, onToggleExclusion, onOpenAssignPoints, onOpenManageDepts, expanded, onToggle }) {
  const isSelf = user.email === currentEmail;

  return (
    <>
      <div
        className={`cg-member-row cg-admin-user-row ${expanded ? "expanded" : ""}`}
        onClick={onToggle}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: 6 }}>
            {user.name}
            {isSelf && <span className="cg-badge cg-badge-super">YOU</span>}
            {user.excluded && <span className="cg-badge cg-badge-rejected" style={{ fontSize: 8 }}>LB EXCLUDED</span>}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text-dim)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.email}
          </div>
        </div>

        <div className="cg-hide-mobile" style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "var(--text-dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.departments.length > 0 ? user.departments.map(deptName).join(", ") : "Not selected"}
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>{user.points} pts</div>

        <div onClick={(e) => e.stopPropagation()}>
          {isSelf || !isSuperAdmin ? (
            <RoleBadge role={user.role} />
          ) : (
            <select
              className="cg-select"
              style={{ fontSize: 11, padding: "5px 6px" }}
              value={user.role}
              onChange={(e) => onPromote(user.email, e.target.value)}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          )}
        </div>
      </div>

      {expanded && (
        <div className="cg-member-detail" style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
              REG NO: <strong style={{ color: "var(--text)" }}>{user.regNo || "N/A"}</strong><br/>
              DEPT: <strong style={{ color: "var(--text)" }}>{user.departments.map(deptName).join(", ") || "None"}</strong>
            </div>
            <div className="cg-member-actions">
              <button
                className="cg-btn cg-btn-solid cg-btn-sm"
                onClick={(e) => { e.stopPropagation(); onOpenAssignPoints(user); }}
              >
                + POINTS
              </button>
              <button
                className="cg-btn cg-btn-sm"
                onClick={(e) => { e.stopPropagation(); onOpenManageDepts(user); }}
              >
                EDIT DEPTS
              </button>
              {isSuperAdmin && (
                <button
                  className="cg-btn cg-btn-sm"
                  style={user.excluded ? { borderColor: "var(--danger)", color: "var(--danger)", background: "var(--danger-soft)" } : {}}
                  onClick={(e) => { e.stopPropagation(); onToggleExclusion(user.email); }}
                >
                  {user.excluded ? "✓ EXCLUDED (SHOW ON LEADERBOARD)" : "🚫 EXCLUDE FROM LEADERBOARD"}
                </button>
              )}
            </div>
          </div>

          <div className="cg-label" style={{ marginBottom: 6, fontSize: 10 }}>CONTRIBUTION HISTORY</div>
          {user.contributions.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>No contributions logged yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {user.contributions.map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, paddingBottom: 6, borderBottom: i < user.contributions.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span>{c.title} <span style={{ color: "var(--text-dim)" }}>· {c.date}</span></span>
                  <span style={{ color: "var(--accent)", fontWeight: 600 }}>+{c.points}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function UsersTab({ users, currentEmail, isSuperAdmin, onPromote, onToggleExclusion, onAssignPoints, onUpdateDepartments }) {
  const [query, setQuery] = useState("");
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [assignUser, setAssignUser] = useState(null);
  const [manageDeptUser, setManageDeptUser] = useState(null);

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.regNo.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="cg-filter-bar">
        <input className="cg-input" placeholder="Search name, reg no, email…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div style={{ fontSize: 11, color: "var(--text-dim)", background: "var(--bg-panel)", border: "1px solid var(--border)", padding: "10px 14px", marginBottom: 16, borderRadius: 4 }}>
        💡 Click any member row to assign task points, manage departments, promote roles, or <strong style={{ color: "var(--accent)" }}>toggle Leaderboard inclusion/exclusion</strong>.
      </div>

      <div className="cg-panel">
        <div className="cg-member-row cg-admin-user-row" style={{ cursor: "default", background: "transparent" }}>
          <div className="cg-label">MEMBER</div>
          <div className="cg-label cg-hide-mobile">DEPARTMENTS</div>
          <div className="cg-label">POINTS</div>
          <div className="cg-label">ROLE</div>
        </div>
        {filtered.length === 0 ? (
          <div className="cg-empty">No users match your filters.</div>
        ) : (
          filtered.map((u) => (
            <UserRow
              key={u.email}
              user={u}
              currentEmail={currentEmail}
              isSuperAdmin={isSuperAdmin}
              onPromote={onPromote}
              onToggleExclusion={onToggleExclusion}
              onOpenAssignPoints={(userObj) => setAssignUser(userObj)}
              onOpenManageDepts={(userObj) => setManageDeptUser(userObj)}
              expanded={expandedEmail === u.email}
              onToggle={() => setExpandedEmail(expandedEmail === u.email ? null : u.email)}
            />
          ))
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-dim)" }}>
        {filtered.length} / {users.length} users shown
      </div>

      {assignUser && (
        <AssignPointsModal
          user={assignUser}
          onConfirm={onAssignPoints}
          onClose={() => setAssignUser(null)}
        />
      )}

      {manageDeptUser && (
        <ManageDepartmentsModal
          user={manageDeptUser}
          onConfirm={onUpdateDepartments}
          onClose={() => setManageDeptUser(null)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/* Submissions Tab                                                        */
/* ══════════════════════════════════════════════════════════════════════ */

function SuperPendingTab({ pending, onApprove, onReject }) {
  const [approving, setApproving] = useState(null);
  const [filter, setFilter] = useState("pending");

  const filtered = pending.filter((p) => filter === "all" ? true : p.status === filter);

  return (
    <div>
      <div className="cg-filter-bar cg-submission-filters">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="cg-btn cg-btn-sm"
            style={filter === f ? { background: "var(--accent-super-soft)", borderColor: "var(--accent-super)", color: "var(--accent-super)" } : {}}
          >
            {f.toUpperCase()}
            {f === "pending" && pending.filter((p) => p.status === "pending").length > 0 && (
              <span style={{ marginLeft: 6, background: "var(--warn)", color: "#1a0a00", fontSize: 9, fontWeight: 700, padding: "1px 5px" }}>
                {pending.filter((p) => p.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="cg-empty">
          No {filter === "all" ? "" : filter} submissions.
        </div>
      ) : (
        filtered.map((sub) => (
          <div key={sub.id} className={`cg-submission-card ${sub.status}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{sub.name}</span>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{sub.regNo}</span>
                </div>
                <div style={{ fontSize: 13, marginBottom: 6, wordBreak: "break-word" }}>{sub.description}</div>
                {sub.driveLink && (
                  <a href={formatLink(sub.driveLink)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--accent-2)", wordBreak: "break-all" }}>
                    Drive link ↗
                  </a>
                )}
                <div style={{ fontSize: 10.5, color: "var(--text-dim)", marginTop: 6 }}>
                  Submitted {sub.submittedAt}
                  {sub.status === "approved" && (
                    <span style={{ display: "inline-block", marginLeft: 10, color: "var(--accent)", fontWeight: 600 }}>
                      +{sub.awardedPoints} pts awarded {sub.reviewedBy ? `by ${sub.reviewedBy}` : ""}
                    </span>
                  )}
                  {sub.status === "rejected" && sub.reviewedBy && (
                    <span style={{ display: "inline-block", marginLeft: 10, color: "var(--danger)" }}>
                      Rejected by {sub.reviewedBy}
                    </span>
                  )}
                </div>
              </div>
              <span className={`cg-badge cg-badge-${sub.status}`}>
                {sub.status === "pending" ? "PENDING" : sub.status === "approved" ? "APPROVED" : "REJECTED"}
              </span>
            </div>
            {sub.status === "pending" && (
              <div className="cg-submission-actions">
                <button className="cg-btn cg-btn-super cg-btn-sm" onClick={() => setApproving(sub)}>APPROVE & AWARD</button>
                <button className="cg-btn cg-btn-danger cg-btn-sm" onClick={() => onReject(sub.id)}>REJECT</button>
              </div>
            )}
          </div>
        ))
      )}

      {approving && (
        <ApproveModal submission={approving} onConfirm={onApprove} onClose={() => setApproving(null)} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/* Main SuperAdmin component                                              */
/* ══════════════════════════════════════════════════════════════════════ */

export default function SuperAdmin({
  users,
  projects,
  pending,
  currentEmail,
  onApprove,
  onReject,
  onPromote,
  onToggleExclusion,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onAssignPoints,
  onUpdateDepartments,
}) {
  const [tab, setTab] = useState("projects");
  const pendingCount = (pending || []).filter((p) => p.status === "pending").length;

  const tabs = [
    { id: "projects", label: "Projects" },
    { id: "users", label: "Members & Depts" },
    { id: "pending", label: "Submissions" },
  ];

  return (
    <div className="cg-fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6, flexWrap: "wrap" }}>
        <div>
          <div className="cg-display" style={{ fontSize: 28, fontWeight: 600, marginTop: 6 }}>
            Super Admin Panel
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 28 }}>
        Manage projects, department assignments, task point allocation, role permissions, and contribution submissions.
      </div>

      <div className="cg-admin-tabs">
        {tabs.map((t) => (
          <div
            key={t.id}
            className={`cg-admin-tab ${tab === t.id ? "active super" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === "pending" && pendingCount > 0 && (
              <span style={{ marginLeft: 8, background: "var(--warn)", color: "#1a0a00", fontSize: 9, fontWeight: 700, padding: "1px 6px", verticalAlign: "middle" }}>
                {pendingCount}
              </span>
            )}
          </div>
        ))}
      </div>

      {tab === "projects" && (
        <ProjectsTab
          projects={projects}
          onAdd={onAddProject}
          onEdit={onEditProject}
          onDelete={onDeleteProject}
          isSuperAdmin={true}
        />
      )}
      {tab === "users" && (
        <UsersTab
          users={users}
          currentEmail={currentEmail}
          isSuperAdmin={true}
          onPromote={onPromote}
          onToggleExclusion={onToggleExclusion}
          onAssignPoints={onAssignPoints}
          onUpdateDepartments={onUpdateDepartments}
        />
      )}
      {tab === "pending" && <SuperPendingTab pending={pending || []} onApprove={onApprove} onReject={onReject} />}
    </div>
  );
}