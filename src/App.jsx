import { useState, useEffect, useCallback } from "react";

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
  const [sessionEmail, setSessionEmail] = useState(null);
  const [sessionUserFallback, setSessionUserFallback] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [ready, setReady] = useState(false);

  // Core API Wrapper
  const apiCall = useCallback(async (path, method = "GET", body = null) => {
    const token = localStorage.getItem("club:jwt");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    
    const res = await fetch(`/api${path}`, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API Request Failed");
    return data;
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [u, p, s] = await Promise.all([
        apiCall("/users"),
        apiCall("/projects"),
        apiCall("/submissions"),
      ]);
      setUsers(u);
      setProjects(p);
      setPending(s);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }, [apiCall]);

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("club:jwt");
      if (token) {
        try {
          const { user } = await apiCall("/auth/me");
          setSessionEmail(user.email);
          setSessionUserFallback(user);
          setTab(user.role === "super_admin" ? "superadmin" : user.role === "admin" ? "admin" : "dashboard");
          setPhase("app");
          await refreshData();
        } catch (e) {
          localStorage.removeItem("club:jwt");
        }
      }
      setReady(true);
    }
    init();
  }, [apiCall, refreshData]);

  const currentUser = (users && sessionEmail ? users.find((u) => u.email === sessionEmail) : null) || sessionUserFallback;

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

  /* ── Login ── */
  async function handleLogin(payload) {
    setLoginError("");
    try {
      let emailToSet = payload.email;
      let roleToSet = payload.role;

      // If it's a member from Google Auth, the backend hasn't generated a JWT yet.
      if (!payload.role) {
        const data = await apiCall("/auth/login", "POST", payload);
        localStorage.setItem("club:jwt", data.token);
        emailToSet = data.user.email;
        roleToSet = data.user.role;
        setSessionUserFallback(data.user);
      } else {
        // Staff login already hit /auth/staff-login in Login.jsx and saved the JWT.
        emailToSet = payload.email;
        roleToSet = payload.role;
        setSessionUserFallback(payload);
      }
      
      setSessionEmail(emailToSet);
      setPhase("app");
      setTab(roleToSet === "super_admin" ? "superadmin" : roleToSet === "admin" ? "admin" : "dashboard");
      await refreshData();
    } catch (err) {
      setLoginError(err.message);
    }
  }

  /* ── Logout ── */
  function handleLogout() {
    localStorage.removeItem("club:jwt");
    setSessionEmail(null);
    setUsers(null);
    setProjects(null);
    setPending(null);
    setPhase("landing");
    setTab("dashboard");
  }

  /* ── Departments ── */
  async function handleLockDepartments(selected) {
    try {
      await apiCall("/users/departments", "POST", { departments: selected });
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ── Project application ── */
  async function handleApply(projectId) {
    try {
      await apiCall(`/projects/${projectId}/apply`, "POST");
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ── Submit contribution (member) ── */
  async function handleSubmitContribution(payload) {
    try {
      await apiCall("/submissions", "POST", payload);
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ── Approve contribution (admin / super_admin) ── */
  async function handleApproveContribution(submissionId, title, points) {
    try {
      await apiCall(`/submissions/${submissionId}/approve`, "POST", { title, points });
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ── Reject contribution ── */
  async function handleRejectContribution(submissionId) {
    try {
      await apiCall(`/submissions/${submissionId}/reject`, "POST");
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ── Promote / demote user ── */
  async function handlePromoteUser(email, newRole) {
    try {
      await apiCall("/users/promote", "POST", { email, newRole });
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ── Toggle Leaderboard Exclusion (super_admin) ── */
  async function handleToggleLeaderboardExclusion(email) {
    try {
      await apiCall("/users/toggle-exclusion", "POST", { email });
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ── Direct task points assignment ── */
  async function handleAssignDirectPoints(email, title, points) {
    try {
      await apiCall("/users/assign-points", "POST", { email, title, points });
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ── Update user department selection ── */
  async function handleUpdateUserDepartments(email, departments) {
    try {
      await apiCall("/users/manage-departments", "POST", { email, departments });
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ── Project CRUD ── */
  async function handleAddProject(project) {
    try {
      await apiCall("/projects", "POST", project);
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleEditProject(updated) {
    try {
      await apiCall(`/projects/${updated.id}`, "PUT", updated);
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteProject(projectId) {
    try {
      if (window.confirm("Are you sure you want to delete this project?")) {
        await apiCall(`/projects/${projectId}`, "DELETE");
        await refreshData();
      }
    } catch (err) {
      alert(err.message);
    }
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
