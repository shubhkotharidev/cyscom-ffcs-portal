/* ---------------------------------------------------------------------- */
/* storage helpers (browser localStorage version)                         */
/* ---------------------------------------------------------------------- */

export async function loadUsers() {
  try {
    const v = localStorage.getItem("club:users");
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}
export async function saveUsers(users) {
  try { localStorage.setItem("club:users", JSON.stringify(users)); } catch {}
}

export async function loadProjects() {
  try {
    const v = localStorage.getItem("club:projects");
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}
export async function saveProjects(projects) {
  try { localStorage.setItem("club:projects", JSON.stringify(projects)); } catch {}
}

export async function loadSession() {
  try {
    const v = localStorage.getItem("club:session");
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}
export async function saveSession(session) {
  try {
    if (session) localStorage.setItem("club:session", JSON.stringify(session));
    else localStorage.removeItem("club:session");
  } catch {}
}

export async function loadPending() {
  try {
    const v = localStorage.getItem("club:pending");
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}
export async function savePending(pending) {
  try { localStorage.setItem("club:pending", JSON.stringify(pending)); } catch {}
}

export async function loadActivity() {
  try {
    const v = localStorage.getItem("club:activity");
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
}
export async function saveActivity(log) {
  try { localStorage.setItem("club:activity", JSON.stringify(log)); } catch {}
}

export async function clearAllStorage() {
  try {
    localStorage.removeItem("club:users");
    localStorage.removeItem("club:projects");
    localStorage.removeItem("club:session");
    localStorage.removeItem("club:pending");
    localStorage.removeItem("club:activity");
  } catch {}
}
