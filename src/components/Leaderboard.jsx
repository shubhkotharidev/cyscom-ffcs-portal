import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

function PodiumCard({ rank, user, isYou }) {
  const pointsRef = useRef(null);

  useEffect(() => {
    if (pointsRef.current) {
      const obj = { n: 0 };
      gsap.to(obj, {
        n: user.points,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => { if (pointsRef.current) pointsRef.current.textContent = Math.round(obj.n); },
      });
    }
  }, [user.points]);

  return (
    <div className={`cg-podium-card rank-${rank}`}>
      <span className="cg-corner tl" />
      <span className="cg-corner tr" />
      <span className="cg-corner bl" />
      <span className="cg-corner br" />
      {isYou && <span className="cg-podium-you">YOU</span>}
      <div className="cg-podium-rank">{String(rank).padStart(2, "0")}</div>
      <div className="cg-podium-name">{user.name}</div>
      <div className="cg-podium-points"><span ref={pointsRef}>0</span></div>
    </div>
  );
}

export default function Leaderboard({ users, currentEmail }) {
  // Filter members only (excluding accounts marked as excluded by super admin)
  const members = useMemo(
    () => [...users].filter((u) => u.role === "member" && !u.excluded).sort((a, b) => b.points - a.points),
    [users]
  );

  const podium = members.slice(0, 3);
  const rest = members.slice(3);
  const rowsRef = useRef(null);

  useEffect(() => {
    if (rowsRef.current) {
      gsap.fromTo(
        rowsRef.current.querySelectorAll(".cg-lb-row"),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: "power2.out" }
      );
    }
  }, [rest.length]);

  return (
    <div>
      <div className="cg-display" style={{ fontSize: 28, fontWeight: 600, margin: "6px 0 22px" }}>Leaderboard</div>

      {/* ── Member podium ── */}
      {podium.length > 0 && (
        <div className="cg-podium">
          {podium[1] && <PodiumCard rank={2} user={podium[1]} isYou={podium[1].email === currentEmail} />}
          {podium[0] && <PodiumCard rank={1} user={podium[0]} isYou={podium[0].email === currentEmail} />}
          {podium[2] && <PodiumCard rank={3} user={podium[2]} isYou={podium[2].email === currentEmail} />}
        </div>
      )}

      {/* ── Member ranked list ── */}
      {rest.length > 0 && (
        <div className="cg-panel">
          <div className="cg-lb-header cg-label">
            <div>RANK</div><div>NAME</div><div className="cg-lb-regno">REG NO</div><div>POINTS</div>
          </div>
          <div ref={rowsRef}>
            {rest.map((u, i) => {
              const rank = i + 4;
              const isYou = u.email === currentEmail;
              return (
                <div
                  key={u.email}
                  className={`cg-lb-row ${isYou ? "you" : ""}`}
                  style={{ borderBottom: i < rest.length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <div style={{ color: "var(--text-dim)" }}>{String(rank).padStart(2, "0")}</div>
                  <div style={{ fontSize: 13, display: "flex", alignItems: "center" }}>
                    {u.name}
                    {isYou && <span className="cg-lb-you-tag">YOU</span>}
                  </div>
                  <div className="cg-lb-regno" style={{ fontSize: 12, color: "var(--text-dim)" }}>{u.regNo}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>{u.points}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
