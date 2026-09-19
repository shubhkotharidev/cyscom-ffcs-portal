import { useState, useEffect, useRef } from "react";
import { BRAND } from "../lib/constants";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Decode a Google JWT credential (id_token) without a library
function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function Login({ onLogin, error }) {
  const [step, setStep] = useState("gate"); // gate -> details -> staff
  const [googleUser, setGoogleUser] = useState(null); // { email, name }
  const [regNo, setRegNo] = useState("");
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [checking, setChecking] = useState(false);
  const googleBtnRef = useRef(null);

  // Initialise Google Identity Services once the GSI script is ready
  useEffect(() => {
    if (step !== "gate") return;

    function initGsi() {
      if (!window.google || !GOOGLE_CLIENT_ID) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "filled_blue",
          size: "large",
          width: 336,
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      }
    }

    // GSI script might still be loading — poll briefly
    if (window.google) {
      initGsi();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGsi();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [step]);

  async function handleGoogleCredential(response) {
    setLocalError("");
    const payload = parseJwt(response.credential);
    if (!payload) {
      setLocalError("Failed to read Google credentials. Please try again.");
      return;
    }

    const email = (payload.email || "").toLowerCase();
    const name = payload.name || email.split("@")[0];

    // Enforce VIT domain
    if (!email.endsWith("@vitstudent.ac.in") && !email.endsWith("@vit.ac.in")) {
      setLocalError("Access restricted to @vitstudent.ac.in accounts only.");
      return;
    }

    // Check if returning member — if so, skip reg number step
    setChecking(true);
    try {
      const res = await fetch(`/api/auth/exists?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.exists) {
        // Returning member: log in immediately, no reg number needed
        onLogin({ email, name });
        return;
      }
    } catch {
      // If check fails, fall through to reg number step as a safe fallback
    } finally {
      setChecking(false);
    }

    // New member: ask for reg number
    setGoogleUser({ email, name });
    setStep("details");
  }

  function handleFinish(e) {
    e.preventDefault();
    if (!regNo.trim()) {
      setLocalError("Registration number is required.");
      return;
    }
    onLogin({
      email: googleUser.email,
      name: googleUser.name,
      regNo: regNo.trim().toUpperCase(),
    });
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
      setLocalError(data.error || "Invalid username or password.");
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
        padding: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="cg-brutalist-card" style={{ width: 400, maxWidth: "100%", padding: "48px 32px 32px" }}>
          <div className="cg-display" style={{ fontSize: 26, fontWeight: 600, margin: "10px 0 24px" }}>
            {step === "gate" ? "Member Login" : step === "details" ? "One last step" : "Admin Portal Login"}
          </div>

          {/* ── Step 1: Google Sign-In ── */}
          {step === "gate" && (
            <div>
              <div className="cg-label" style={{ marginBottom: 14, textAlign: "left" }}>
                Sign in with Google
              </div>

              {/* Google renders its own button into this div */}
              <div ref={googleBtnRef} style={{ display: "flex", justifyContent: "center", minHeight: 44, opacity: checking ? 0.4 : 1, pointerEvents: checking ? "none" : "auto", transition: "opacity 0.2s" }} />

              {checking && (
                <div style={{ fontSize: 12, color: "#888", marginTop: 12, textAlign: "center" }}>
                  Signing you in<span className="cg-blink">…</span>
                </div>
              )}

              {!GOOGLE_CLIENT_ID && (
                <div style={{ color: "var(--warn)", fontSize: 11, marginTop: 10, textAlign: "center" }}>
                  ⚠ VITE_GOOGLE_CLIENT_ID is not configured.
                </div>
              )}

              {(localError || error) && (
                <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 12, textAlign: "center" }}>
                  {localError || error}
                </div>
              )}

              <div style={{ borderTop: "2px solid #000", marginTop: 24, paddingTop: 18, textAlign: "center" }}>
                <button
                  type="button"
                  className="cg-btn cg-btn-sm"
                  style={{ width: "100%" }}
                  onClick={() => { setLocalError(""); setStep("staff"); }}
                >
                  ADMIN PORTAL LOGIN →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Confirm reg number (name + email come from Google) ── */}
          {step === "details" && googleUser && (
            <form onSubmit={handleFinish}>
              <div style={{ marginBottom: 18, padding: "12px 14px", background: "var(--bg)", border: "1px solid var(--border)", fontSize: 12 }}>
                <div style={{ color: "var(--text-dim)", fontSize: 10, letterSpacing: "0.1em", marginBottom: 4 }}>SIGNED IN AS</div>
                <div style={{ fontWeight: 600 }}>{googleUser.name}</div>
                <div style={{ color: "var(--accent-2)", fontSize: 11 }}>{googleUser.email}</div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div className="cg-label" style={{ marginBottom: 6 }}>REGISTRATION NUMBER</div>
                <input
                  className="cg-input"
                  placeholder="23BCE1234"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  autoFocus
                />
              </div>

              {localError && (
                <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 10 }}>{localError}</div>
              )}

              <button type="submit" className="cg-btn cg-btn-solid" style={{ width: "100%", marginTop: 20 }}>
                ENTER DASHBOARD →
              </button>
              <button
                type="button"
                className="cg-btn cg-btn-sm"
                style={{ width: "100%", marginTop: 10 }}
                onClick={() => { setStep("gate"); setGoogleUser(null); setRegNo(""); setLocalError(""); }}
              >
                ← BACK
              </button>
            </form>
          )}

          {/* ── Step 3: Staff login ── */}
          {step === "staff" && (
            <form onSubmit={handleStaffLogin}>
              <div style={{ marginBottom: 14 }}>
                <div className="cg-label" style={{ marginBottom: 6 }}>USERNAME</div>
                <input
                  className="cg-input"
                  placeholder="Enter username"
                  value={staffUsername}
                  onChange={(e) => setStaffUsername(e.target.value)}
                  autoFocus
                  autoComplete="username"
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
                  autoComplete="current-password"
                />
              </div>

              {localError && (
                <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 10 }}>{localError}</div>
              )}

              <button type="submit" className="cg-btn cg-btn-super" style={{ width: "100%", marginTop: 18 }}>
                LOGIN TO ADMIN PANEL →
              </button>

              <button
                type="button"
                className="cg-btn cg-btn-sm"
                style={{ width: "100%", marginTop: 10 }}
                onClick={() => { setLocalError(""); setStep("gate"); }}
              >
                ← BACK TO MEMBER LOGIN
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
