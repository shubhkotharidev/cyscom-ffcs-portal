import { useState, useEffect, useRef } from "react";

import { ADMIN_EMAILS, SUPER_ADMIN_EMAILS, SEED_PROJECTS, SEED_USERS, SEED_PENDING } from "./lib/constants";
import {
  loadUsers, saveUsers,
  loadProjects, saveProjects,
  loadSession, saveSession,
  loadPending, savePending,
  loadActivity, saveActivity,
  clearAllStorage,
} from "./lib/storage";

import GlobalStyle from "./components/GlobalStyle";
import Landing, { PixelTransition } from "./components/Landing";
import Login from "./components/Login";
import Shell from "./components/Shell";
import Dashboard from "./components/Dashboard";
import Departments from "./components/Departments";
import Projects from "./components/Projects";
import Leaderboard from "./components/Leaderboard";
import SuperAdmin from "./components/SuperAdmin";
import Admin from "./components/Admin";

export default function App() {
  const [phase, setPhase] = useState("landing"); // landing -> pixel -> login -> app
  const [tab, setTab] = useState("dashboard");
  const [users, setUsers] = useState(null);
  const [projects, setProjects] = useState(null);
  const [pending, setPending] = useState(null);
  const [activity, setActivity] = useState([]);
  const [sessionEmail, setSessionEmail] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      // Wipe out local storage completely as requested
      await clearAllStorage();
      let u = SEED_USERS;
      await saveUsers(u);
      let p = SEED_PROJECTS;
      await saveProjects(p);
      let pend = SEED_PENDING;
      await savePending(pend);
      setUsers(u);
      setProjects(p);
      setPending(pend);
      setActivity([]);
      setReady(true);
    })();
  }, []);

  const currentUser = users && sessionEmail ? users.find((u) => u.email === sessionEmail) : null;

  /* ── Tab Guard for Staff ── */
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "super_admin" && tab !== "superadmin" && tab !== "leaderboard") {
        setTab("superadmin");
      } else if (currentUser.role === "admin" && tab !== "admin" && tab !== "leaderboard") {
        setTab("admin");
      }
    }
  }, [currentUser, tab]);

  /* ── Activity Logging ── */
  async function logActivityEntry(entry) {
    const actor = users ? users.find((u) => u.email === sessionEmail) : null;
    const newEntry = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actorEmail: sessionEmail,
      actorName: actor ? actor.name : "Staff",
      ...entry,
    };
    const updated = [newEntry, ...(activity || [])];
    setActivity(updated);
    await saveActivity(updated);
  }

  async function handleClearActivity() {
    setActivity([]);
    await saveActivity([]);
  }

  /* ── Login ── */
  async function handleLogin({ email, name, regNo, role: inputRole }) {
    setLoginError("");
    let list = users ? [...users] : [];
    let existing = list.find((u) => u.email === email);
    if (!existing) {
      const role = inputRole
        ? inputRole
        : SUPER_ADMIN_EMAILS.includes(email)
        ? "super_admin"
        : ADMIN_EMAILS.includes(email)
        ? "admin"
        : "member";
      existing = { email, name, regNo, departments: [], locked: false, points: 0, role, excluded: false, contributions: [] };
      list.push(existing);
      setUsers(list);
      await saveUsers(list);
    }
    setSessionEmail(email);
    await saveSession({ email });
    const role = existing.role;
    setTab(role === "super_admin" ? "superadmin" : role === "admin" ? "admin" : "dashboard");
    setPhase("app");
  }

  /* ── Logout ── */
  async function handleLogout() {
    setSessionEmail(null);
    await saveSession(null);
    setPhase("landing");
    setTab("dashboard");
  }

  /* ── Departments ── */
  async function handleLockDepartments(selected) {
    const list = users.map((u) => (u.email === sessionEmail ? { ...u, departments: selected, locked: true } : u));
    setUsers(list);
    await saveUsers(list);
  }

  /* ── Project application ── */
  async function handleApply(projectId) {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj || proj.seatsFilled >= proj.seatsTotal || proj.applicants.includes(sessionEmail)) return;
    const newProjects = projects.map((p) =>
      p.id === projectId ? { ...p, seatsFilled: p.seatsFilled + 1, applicants: [...p.applicants, sessionEmail] } : p
    );
    setProjects(newProjects);
    await saveProjects(newProjects);
  }

  /* ── Submit contribution (member) ── */
  async function handleSubmitContribution({ description, driveLink }) {
    const user = users.find((u) => u.email === sessionEmail);
    if (!user) return;
    const submission = {
      id: `sub_${Date.now()}`,
      email: user.email,
      name: user.name,
      regNo: user.regNo,
      description,
      driveLink,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: "pending",
      awardedPoints: null,
    };
    const newPending = [...(pending || []), submission];
    setPending(newPending);
    await savePending(newPending);
  }

  /* ── Approve contribution (admin / super_admin) ── */
  async function handleApproveContribution(submissionId, title, points) {
    const sub = pending.find((p) => p.id === submissionId);
    if (!sub) return;
    const reviewer = users ? users.find((u) => u.email === sessionEmail) : null;
    const reviewerName = reviewer ? reviewer.name : "Staff";

    const newUsers = users.map((u) =>
      u.email === sub.email
        ? { ...u, points: u.points + points, contributions: [...u.contributions, { title, points, date: new Date().toISOString().slice(0, 10) }] }
        : u
    );
    setUsers(newUsers);
    await saveUsers(newUsers);

    // Mark submission as approved with reviewer info
    const newPending = pending.map((p) =>
      p.id === submissionId
        ? {
            ...p,
            status: "approved",
            awardedPoints: points,
            reviewedBy: reviewerName,
            reviewedByEmail: sessionEmail,
            reviewedAt: new Date().toISOString().slice(0, 10),
          }
        : p
    );
    setPending(newPending);
    await savePending(newPending);

    // Log activity
    logActivityEntry({
      type: "points_awarded",
      targetEmail: sub.email,
      targetName: sub.name,
      title,
      points,
    });
  }

  /* ── Reject contribution ── */
  async function handleRejectContribution(submissionId) {
    const reviewer = users ? users.find((u) => u.email === sessionEmail) : null;
    const reviewerName = reviewer ? reviewer.name : "Staff";

    const newPending = pending.map((p) =>
      p.id === submissionId
        ? {
            ...p,
            status: "rejected",
            reviewedBy: reviewerName,
            reviewedByEmail: sessionEmail,
            reviewedAt: new Date().toISOString().slice(0, 10),
          }
        : p
    );
    setPending(newPending);
    await savePending(newPending);
  }

  /* ── Promote / demote user ── */
  async function handlePromoteUser(email, newRole) {
    const targetUser = users ? users.find((u) => u.email === email) : null;
    const newUsers = users.map((u) => u.email === email ? { ...u, role: newRole } : u);
    setUsers(newUsers);
    await saveUsers(newUsers);

    // Log activity
    logActivityEntry({
      type: "role_change",
      targetEmail: email,
      targetName: targetUser ? targetUser.name : email,
      newRole,
    });
  }

  /* ── Toggle Leaderboard Exclusion (super_admin) ── */
  async function handleToggleLeaderboardExclusion(email) {
    const newUsers = users.map((u) => (u.email === email ? { ...u, excluded: !u.excluded } : u));
    setUsers(newUsers);
    await saveUsers(newUsers);
  }

  /* ── Direct task points assignment ── */
  async function handleAssignDirectPoints(email, title, points) {
    const targetUser = users ? users.find((u) => u.email === email) : null;
    if (!targetUser) return;
    const newUsers = users.map((u) =>
      u.email === email
        ? {
            ...u,
            points: u.points + points,
            contributions: [
              ...u.contributions,
              { title, points, date: new Date().toISOString().slice(0, 10) },
            ],
          }
        : u
    );
    setUsers(newUsers);
    await saveUsers(newUsers);

    logActivityEntry({
      type: "points_awarded",
      targetEmail: email,
      targetName: targetUser.name,
      title,
      points,
    });
  }

  /* ── Update user department selection ── */
  async function handleUpdateUserDepartments(email, departments) {
    const targetUser = users ? users.find((u) => u.email === email) : null;
    if (!targetUser) return;
    const newUsers = users.map((u) =>
      u.email === email ? { ...u, departments, locked: true } : u
    );
    setUsers(newUsers);
    await saveUsers(newUsers);

    logActivityEntry({
      type: "dept_change",
      targetEmail: email,
      targetName: targetUser.name,
      departments,
    });
  }

  /* ── Project CRUD ── */
  async function handleAddProject(project) {
    const newProjects = [...projects, project];
    setProjects(newProjects);
    await saveProjects(newProjects);
  }

  async function handleEditProject(updated) {
    const newProjects = projects.map((p) => p.id === updated.id ? updated : p);
    setProjects(newProjects);
    await saveProjects(newProjects);
  }

  async function handleDeleteProject(projectId) {
    const newProjects = projects.filter((p) => p.id !== projectId);
    setProjects(newProjects);
    await saveProjects(newProjects);
  }

  /* ── Loading ── */
  if (!ready) {
    return (
      <div className="cg-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <GlobalStyle />
        <div className="cg-label">INITIALIZING{"…"}</div>
      </div>
    );
  }

  return (
    <div className="cg-root cg-scan">
      <GlobalStyle />

      {phase === "landing" && <Landing onEnter={() => setPhase("pixel")} />}
      {phase === "pixel" && <PixelTransition onDone={() => setPhase("login")} />}
      {phase === "login" && <Login onLogin={handleLogin} error={loginError} />}

      {phase === "app" && currentUser && (
        <>
          <Shell user={currentUser} tab={tab} setTab={setTab} onLogout={handleLogout}>
            {tab === "dashboard" && (
              <Dashboard
                user={currentUser}
                setTab={setTab}
                onSubmitContribution={handleSubmitContribution}
                pending={pending}
              />
            )}
            {tab === "departments" && <Departments user={currentUser} onLock={handleLockDepartments} />}
            {tab === "projects" && <Projects user={currentUser} projects={projects} onApply={handleApply} />}
            {tab === "leaderboard" && <Leaderboard users={users} currentEmail={sessionEmail} />}
            {tab === "superadmin" && currentUser.role === "super_admin" && (
              <SuperAdmin
                users={users}
                projects={projects}
                pending={pending || []}
                currentEmail={sessionEmail}
                onApprove={handleApproveContribution}
                onReject={handleRejectContribution}
                onPromote={handlePromoteUser}
                onToggleExclusion={handleToggleLeaderboardExclusion}
                onAddProject={handleAddProject}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
                onAssignPoints={handleAssignDirectPoints}
                onUpdateDepartments={handleUpdateUserDepartments}
              />
            )}
            {tab === "admin" && currentUser.role === "admin" && (
              <Admin
                users={users}
                projects={projects || []}
                pending={pending || []}
                currentEmail={sessionEmail}
                onApprove={handleApproveContribution}
                onReject={handleRejectContribution}
                onAssignPoints={handleAssignDirectPoints}
                onUpdateDepartments={handleUpdateUserDepartments}
              />
            )}
          </Shell>
        </>
      )}
    </div>
  );
}

