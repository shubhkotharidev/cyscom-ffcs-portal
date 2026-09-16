/* ============================================================================
   CYSCOM FFCS PORTAL — BACKEND API SERVICE LAYER
   ----------------------------------------------------------------------------
   This file acts as the single point of integration between the React frontend
   and your backend API / Database (Node.js, Express, MongoDB, PostgreSQL, etc.).

   To connect your real backend & database:
   1. Change BASE_URL to your backend API server (e.g., "http://localhost:5000/api")
   2. Replace the fallback local storage handlers with fetch() / axios calls.
============================================================================ */

import {
  loadUsers, saveUsers,
  loadProjects, saveProjects,
  loadPending, savePending,
  loadSession, saveSession,
} from "./storage";

export const API_CONFIG = {
  BASE_URL: "/api",
  USE_BACKEND: true, // Switched to true to connect to the Node.js backend
};

function getAuthHeaders() {
  const token = localStorage.getItem("club:jwt");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* ── Auth / Session APIs ── */
export async function loginUserApi(credentials) {
  if (API_CONFIG.USE_BACKEND) {
    const res = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.token) localStorage.setItem("club:jwt", data.token);
    return data;
  }
  await saveSession({ email: credentials.email });
  return credentials;
}

export async function logoutUserApi() {
  localStorage.removeItem("club:jwt");
  await saveSession(null);
}

/* ── Users API ── */
export async function fetchUsersApi() {
  if (API_CONFIG.USE_BACKEND) {
    const res = await fetch(`${API_CONFIG.BASE_URL}/users`, { headers: getAuthHeaders() });
    return await res.json();
  }
  return (await loadUsers()) || [];
}

export async function saveUsersApi(users) {
  if (!API_CONFIG.USE_BACKEND) {
    await saveUsers(users);
  }
}

/* ── Projects API ── */
export async function fetchProjectsApi() {
  if (API_CONFIG.USE_BACKEND) {
    const res = await fetch(`${API_CONFIG.BASE_URL}/projects`, { headers: getAuthHeaders() });
    return await res.json();
  }
  return (await loadProjects()) || [];
}

export async function saveProjectsApi(projects) {
  if (!API_CONFIG.USE_BACKEND) {
    await saveProjects(projects);
  }
}

/* ── Pending Submissions API ── */
export async function fetchPendingApi() {
  if (API_CONFIG.USE_BACKEND) {
    const res = await fetch(`${API_CONFIG.BASE_URL}/submissions`, { headers: getAuthHeaders() });
    return await res.json();
  }
  return (await loadPending()) || [];
}

export async function savePendingApi(pending) {
  if (!API_CONFIG.USE_BACKEND) {
    await savePending(pending);
  }
}
