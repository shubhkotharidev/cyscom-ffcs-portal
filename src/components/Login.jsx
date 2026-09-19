import { useState, useEffect, useRef, useMemo } from "react";
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
    setLocalError("");
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
    <div className="cg-fade-in login-wrapper">
      <div className="login-split">
        
        {/* ── Left Side: Form ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, position: "relative" }}>
          
          {/* Animated Mini Dyson Logo */}
          <div style={{ marginBottom: 40, display: "flex", justifyContent: "center", alignItems: "center", width: 360, height: 360 }}>
            <div className="dyson-container" style={{ transform: "scale(1.2)", transformOrigin: "center" }}>
              <div className="dyson-sphere">
                <div className="dyson-ring r1"></div>
                <div className="dyson-ring r2"></div>
                <div className="dyson-ring r3"></div>
                <div className="dyson-ring r4"></div>
              </div>
              <img src="/logo1.png" alt={BRAND} className="dyson-logo" style={{ opacity: 0.9 }} />
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: 320 }}>
            <div className="cg-display" style={{ fontSize: 20, fontWeight: 600, margin: "0 0 24px", color: "#fff", textAlign: "center" }}>
              {step === "gate" ? "" : step === "details" ? "Complete Registration" : "Admin Portal"}
            </div>

            {/* ── Step 1: Google Sign-In ── */}
            {step === "gate" && (
              <div>
                <div className="cg-label" style={{ marginBottom: 14, color: "#888", fontSize: 11, textAlign: "left" }}>
                  Email
                </div>

                {/* Google renders its own button into this div */}
                <div ref={googleBtnRef} style={{ display: "flex", minHeight: 44, opacity: checking ? 0.4 : 1, pointerEvents: checking ? "none" : "auto", transition: "opacity 0.2s" }} />

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

                <div style={{ fontSize: 11, color: "#666", marginTop: 16, lineHeight: 1.5, textAlign: "center" }}>
                  Access restricted to <span style={{ color: "#aaa" }}>@vitstudent.ac.in</span> accounts.
                </div>

                <div style={{ display: "flex", alignItems: "center", margin: "24px 0", color: "#444", fontSize: 10, textTransform: "lowercase", letterSpacing: "0.05em" }}>
                  <div style={{ flex: 1, height: 1, background: "#222" }}></div>
                  <div style={{ padding: "0 12px" }}>or</div>
                  <div style={{ flex: 1, height: 1, background: "#222" }}></div>
                </div>

                <button
                  type="button"
                  style={{ width: "100%", fontSize: 12, background: "#000", color: "#fff", border: "1px solid #222", height: 40, borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  onClick={() => { setLocalError(""); setStep("staff"); }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Admin Portal Login
                </button>
              </div>
            )}

            {/* ── Step 2: Confirm reg number ── */}
            {step === "details" && googleUser && (
              <form onSubmit={handleFinish}>
                <div style={{ marginBottom: 24, padding: "16px", background: "#1a1a1a", borderRadius: 6, fontSize: 12 }}>
                  <div style={{ color: "#888", fontSize: 10, letterSpacing: "0.05em", marginBottom: 6 }}>SIGNED IN AS</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: "#fff" }}>{googleUser.name}</div>
                  <div style={{ color: "#aaa", fontSize: 11 }}>{googleUser.email}</div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div className="cg-label" style={{ marginBottom: 8, color: "#888", fontSize: 11, textAlign: "left" }}>REGISTRATION NUMBER</div>
                  <input
                    placeholder="23BCE1234"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    autoFocus
                    style={{ width: "100%", background: "#1a1a1a", border: "none", borderRadius: 6, height: 44, color: "#fff", padding: "0 14px", fontSize: 13, outline: "none" }}
                  />
                </div>

                {localError && (
                  <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 10, textAlign: "center" }}>{localError}</div>
                )}

                <button type="submit" style={{ width: "100%", marginTop: 24, height: 44, background: "#fff", color: "#000", border: "none", borderRadius: 6, fontWeight: 500, fontSize: 13, cursor: "pointer" }}>
                  ENTER DASHBOARD
                </button>
                <button
                  type="button"
                  style={{ width: "100%", marginTop: 12, background: "transparent", color: "#666", border: "none", fontSize: 12, cursor: "pointer" }}
                  onClick={() => { setStep("gate"); setGoogleUser(null); setRegNo(""); setLocalError(""); }}
                >
                  Cancel
                </button>
              </form>
            )}

            {/* ── Step 3: Staff login ── */}
            {step === "staff" && (
              <form onSubmit={handleStaffLogin}>
                <div style={{ marginBottom: 16, position: "relative" }}>
                  <div style={{ marginBottom: 8, color: "#888", fontSize: 12, fontWeight: 500 }}>Email or Username</div>
                  <div style={{ position: "relative" }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 14, top: 14, color: "#666" }}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <input
                      placeholder="hello@0.email"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                      autoFocus
                      autoComplete="username"
                      style={{ width: "100%", background: "#1a1a1a", border: "none", borderRadius: 6, height: 44, color: "#fff", padding: "0 14px 0 42px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
                    />
                  </div>
                </div>
                
                <div style={{ marginBottom: 24, position: "relative" }}>
                  <div style={{ marginBottom: 8, color: "#888", fontSize: 12, fontWeight: 500 }}>Password</div>
                  <div style={{ position: "relative" }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 14, top: 14, color: "#666" }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <input
                      type="password"
                      placeholder="Your password"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      autoComplete="current-password"
                      style={{ width: "100%", background: "#1a1a1a", border: "none", borderRadius: 6, height: 44, color: "#fff", padding: "0 14px 0 42px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
                    />
                  </div>
                </div>

                {localError && (
                  <div style={{ color: "var(--danger)", fontSize: 12, marginTop: -10, marginBottom: 14, textAlign: "center" }}>{localError}</div>
                )}

                <button type="submit" style={{ width: "100%", height: 40, background: "#fff", color: "#000", border: "none", borderRadius: 4, fontWeight: 500, fontSize: 13, cursor: "pointer" }}>
                  Login
                </button>

                <div style={{ display: "flex", alignItems: "center", margin: "24px 0", color: "#444", fontSize: 10, textTransform: "lowercase", letterSpacing: "0.05em" }}>
                  <div style={{ flex: 1, height: 1, background: "#222" }}></div>
                  <div style={{ padding: "0 12px" }}>or</div>
                  <div style={{ flex: 1, height: 1, background: "#222" }}></div>
                </div>

                <button
                  type="button"
                  style={{ width: "100%", fontSize: 12, background: "#000", color: "#fff", border: "1px solid #222", height: 40, borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  onClick={() => { setLocalError(""); setStep("gate"); }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                  Back to Member Login
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Right Side: Graphic ── */}
        <div className="login-right">
          <img src="/right.png" alt="Columns" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
}
