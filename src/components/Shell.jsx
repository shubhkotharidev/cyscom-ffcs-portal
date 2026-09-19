import { useEffect, useState } from "react";
import { BRAND } from "../lib/constants";

export default function Shell({ user, tab, setTab, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSuperAdmin = user.role === "super_admin";
  const isAdmin = user.role === "admin";

  const tabs = isSuperAdmin
    ? [
        { id: "superadmin", label: "Super Admin Panel" },
        { id: "leaderboard", label: "Leaderboard" },
      ]
    : isAdmin
    ? [
        { id: "admin", label: "Admin Panel" },
        { id: "leaderboard", label: "Leaderboard" },
      ]
    : [
        { id: "dashboard", label: "Dashboard" },
        { id: "departments", label: "Departments" },
        { id: "projects", label: "Projects" },
        { id: "leaderboard", label: "Leaderboard" },
      ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function selectTab(id) {
    setTab(id);
    setMenuOpen(false);
  }

  function handleLogout() {
    setMenuOpen(false);
    onLogout();
  }

  return (
    <div 
      className="cg-fade-in" 
      style={{ 
        position: "relative", 
        zIndex: 3, 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column"
      }}
    >
      {/* Fixed Parallax Background Container */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        overflow: "hidden",
        backgroundColor: "#0d0d0d"
      }}>
        <div style={{
          position: "absolute",
          top: -100,
          left: -50,
          right: -50,
          bottom: -150,
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: `translateY(${scrollY * -0.25}px)`,
          willChange: "transform"
        }} />
      </div>
      <div className="cg-shell-bar">
        <span className="cg-logo-nav">Cyscom</span>

        <button
          className={`cg-hamburger ${menuOpen ? "open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <div className={`cg-nav-tabs ${menuOpen ? "open" : ""}`}>
          {tabs.map((t) => (
            <div
              key={t.id}
              className={`cg-nav-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => selectTab(t.id)}
            >
              {t.label}
            </div>
          ))}

          <div className="cg-mobile-user">
            <div>
              <div style={{ fontSize: 13 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{user.regNo}</div>
            </div>
            <button className="cg-btn" style={{ fontSize: 11, padding: "10px 14px" }} onClick={handleLogout}>LOG OUT</button>
          </div>
        </div>

        <div className="cg-shell-user">
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12.5 }}>{user.name}</div>
            <div style={{ fontSize: 10.5, color: "var(--text-dim)" }}>{user.regNo}</div>
          </div>
          <button className="cg-btn" style={{ fontSize: 11, padding: "8px 12px" }} onClick={onLogout}>LOG OUT</button>
        </div>
      </div>
      
      {/* Main Content Wrapper (flex: 1 pushes footer to the bottom) */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px 40px", flex: 1, width: "100%" }}>
        {children}
      </div>

      {/* Dyson Sphere Footer */}
      <div className="dyson-container">
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