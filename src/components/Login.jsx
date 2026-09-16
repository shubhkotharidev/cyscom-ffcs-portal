import { useState } from "react";
import { BRAND } from "../lib/constants";

function guessName(email) {
  const local = email.split("@")[0];
  const parts = local.split(/[._]/).filter(Boolean);
  return parts
    .map((p) => p.replace(/[0-9]+$/, ""))
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.7 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.6 5.6C41.9 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

export default function Login({ onLogin, error }) {
  const [step, setStep] = useState("gate"); // gate -> details -> staff
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const emailValid = /^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/i.test(email.trim());

  function handleContinue(e) {
    e.preventDefault();
    if (!emailValid) {
      setLocalError("Only @vitstudent.ac.in addresses can access this portal.");
      return;
    }
    setLocalError("");
    setName(guessName(email.trim()));
    setStep("details");
  }

  function handleFinish(e) {
    e.preventDefault();
    if (!name.trim() || !regNo.trim()) {
      setLocalError("Name and registration number are required.");
      return;
    }
    setLocalError("");
    onLogin({ email: email.trim().toLowerCase(), name: name.trim(), regNo: regNo.trim().toUpperCase() });
  }

  async function handleStaffLogin(e) {
    e.preventDefault();
    setLocalError("");
    const u = staffUsername.trim().toLowerCase();
    const p = staffPassword.trim();

    if (!u || !p) {
      setLocalError("Username and password are required.");
      return;
    }

    try {
      const res = await fetch("/api/auth/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("club:jwt", data.token);
        onLogin(data.user);
        return;
      }
      setLocalError(data.error || "Invalid admin username or password.");
    } catch {
      setLocalError("Cannot connect to server. Please ensure the backend is running.");
    }
  }

  return (
    <div 
      className="cg-fade-in" 
      style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        position: "relative", 
        zIndex: 3, 
        padding: 20 
      }}
    >
      {/* Main Login Panel Wrapper */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <div className="cg-panel" style={{ width: 400, maxWidth: "100%", padding: 32 }}>
          <div className="cg-display" style={{ fontSize: 26, fontWeight: 600, margin: "10px 0 24px" }}>
            {step === "gate" ? "Student Login" : step === "details" ? "Confirm profile" : "Staff Portal Login"}
          </div>

          {step === "gate" && (
            <form onSubmit={handleContinue}>
              <div className="cg-label" style={{ marginBottom: 6 }}>VIT STUDENT EMAIL</div>
              <input
                className="cg-input"
                placeholder="student@vitstudent.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              {(localError || error) && (
                <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 10 }}>{localError || error}</div>
              )}
              <button type="submit" className="cg-btn cg-btn-solid" style={{ width: "100%", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <GoogleG /> Continue with Google
              </button>
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 14, lineHeight: 1.5 }}>
                Access is restricted to <span style={{ color: "var(--accent-2)" }}>@vitstudent.ac.in</span> accounts.
              </div>

              <div style={{ borderTop: "1px solid var(--border)", marginTop: 24, paddingTop: 18, textAlign: "center" }}>
                <button
                  type="button"
                  className="cg-btn cg-btn-sm"
                  style={{ width: "100%", fontSize: 11 }}
                  onClick={() => { setLocalError(""); setStep("staff"); }}
                >
                  ADMIN PORTAL LOGIN →
                </button>
              </div>
            </form>
          )}

          {step === "details" && (
            <form onSubmit={handleFinish}>
              <div style={{ marginBottom: 14 }}>
                <div className="cg-label" style={{ marginBottom: 6 }}>FULL NAME</div>
                <input className="cg-input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              </div>
              <div style={{ marginBottom: 6 }}>
                <div className="cg-label" style={{ marginBottom: 6 }}>REGISTRATION NUMBER</div>
                <input className="cg-input" placeholder="23BCE1234" value={regNo} onChange={(e) => setRegNo(e.target.value)} />
              </div>
              {localError && <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 10 }}>{localError}</div>}
              <button type="submit" className="cg-btn cg-btn-solid" style={{ width: "100%", marginTop: 20 }}>
                ENTER DASHBOARD →
              </button>
              <button
                type="button"
                className="cg-btn cg-btn-sm"
                style={{ width: "100%", marginTop: 10 }}
                onClick={() => setStep("gate")}
              >
                ← BACK TO EMAIL
              </button>
            </form>
          )}

          {step === "staff" && (
            <form onSubmit={handleStaffLogin}>
              <div style={{ marginBottom: 14 }}>
                <div className="cg-label" style={{ marginBottom: 6 }}>USERNAME</div>
                <input
                  className="cg-input"
                  placeholder="username"
                  value={staffUsername}
                  onChange={(e) => setStaffUsername(e.target.value)}
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <div className="cg-label" style={{ marginBottom: 6 }}>PASSWORD</div>
                <input
                  type="password"
                  className="cg-input"
                  placeholder="••••••••••••"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                />
              </div>

              {localError && <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 10 }}>{localError}</div>}

              <button type="submit" className="cg-btn cg-btn-super" style={{ width: "100%", marginTop: 18 }}>
                LOGIN TO ADMIN PANEL →
              </button>

              <button
                type="button"
                className="cg-btn cg-btn-sm"
                style={{ width: "100%", marginTop: 10 }}
                onClick={() => { setLocalError(""); setStep("gate"); }}
              >
                ← BACK TO STUDENT LOGIN
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Dyson Sphere Footer */}
      <div className="dyson-container" style={{ margin: "20px auto 30px auto" }}>
        <div className="dyson-sphere">
          <div className="dyson-ring r1"></div>
          <div className="dyson-ring r2"></div>
          <div className="dyson-ring r3"></div>
          <div className="dyson-ring r4"></div>
        </div>
        <img src="/logo1.png" alt={BRAND} className="dyson-logo" />
      </div>
    </div>
  );
}