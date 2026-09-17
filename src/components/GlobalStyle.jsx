export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600&display=swap');

      .cg-root {
        --bg: #000000;
        --bg-panel: #0d0f17;
        --bg-panel-hi: #161926;
        --border: #202536;
        --border-hi: #323a52;
        --text: #f8fafc;
        --text-dim: #94a3b8;
        --accent: #38bdf8;
        --accent-soft: rgba(56, 189, 248, 0.14);
        --accent-2: #0284c7;
        --accent-super: #38bdf8;
        --accent-super-soft: rgba(56, 189, 248, 0.14);
        --danger: #f43f5e;
        --danger-soft: rgba(244, 63, 94, 0.14);
        --warn: #fbbf24;
        --warn-soft: rgba(251, 191, 36, 0.14);
        --success: #38bdf8;
        font-family: 'JetBrains Mono', ui-monospace, monospace;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
        width: 100%;
        position: relative;
        overflow-x: hidden;
      }
      *, *::before, *::after { box-sizing: border-box; }
      .cg-display { font-family: 'Space Grotesk', sans-serif; }

      .cg-btn {
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        letter-spacing: 0.03em;
        padding: 12px 22px;
        background: transparent;
        border: 1px solid var(--border-hi);
        color: var(--accent);
        cursor: pointer;
        position: relative;
        border-radius: 4px;
        transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        box-shadow: none !important;
      }
      .cg-btn:hover:not(:disabled) { background: var(--accent-soft); border-color: var(--accent); }
      .cg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      .cg-btn-solid {
        background: #38bdf8;
        color: #020617;
        border: 1px solid #38bdf8;
        font-weight: 700;
        box-shadow: none !important;
      }
      .cg-btn-solid:hover:not(:disabled) { background: #7dd3fc; border-color: #7dd3fc; box-shadow: none !important; }
      .cg-btn-danger {
        background: var(--danger);
        color: #fff;
        border: 1px solid var(--danger);
        font-weight: 700;
        box-shadow: none !important;
      }
      .cg-btn-danger:hover:not(:disabled) { background: #fb7185; box-shadow: none !important; }
      .cg-btn-warn {
        background: var(--warn);
        color: #1a0a00;
        border: 1px solid var(--warn);
        font-weight: 700;
        box-shadow: none !important;
      }
      .cg-btn-warn:hover:not(:disabled) { background: #fde047; box-shadow: none !important; }
      .cg-btn-super {
        background: #38bdf8;
        color: #020617;
        border: 1px solid #38bdf8;
        font-weight: 700;
        box-shadow: none !important;
      }
      .cg-btn-super:hover:not(:disabled) { background: #7dd3fc; border-color: #7dd3fc; box-shadow: none !important; }
      .cg-btn-sm {
        font-size: 11px;
        padding: 7px 14px;
      }

      .cg-panel {
        background: var(--bg-panel);
        border: 1px solid var(--border);
        border-radius: 6px;
        box-shadow: none !important;
      }
      .cg-input {
        font-family: 'JetBrains Mono', monospace;
        background: #07080d;
        border: 1px solid #242a3c;
        color: #f8fafc;
        padding: 12px 14px;
        font-size: 13.5px;
        width: 100%;
        outline: none;
        border-radius: 4px;
        transition: border-color 0.15s ease;
        box-shadow: none !important;
      }
      .cg-input:focus { border-color: #38bdf8; box-shadow: none !important; }
      .cg-input::placeholder { color: #64748b; }
      .cg-select {
        font-family: 'JetBrains Mono', monospace;
        background: #07080d;
        border: 1px solid #242a3c;
        color: #f8fafc;
        padding: 12px 14px;
        font-size: 13.5px;
        width: 100%;
        outline: none;
        cursor: pointer;
        appearance: none;
        border-radius: 4px;
        transition: border-color 0.15s ease;
        box-shadow: none !important;
      }
      .cg-select:focus { border-color: #38bdf8; box-shadow: none !important; }
      .cg-textarea {
        font-family: 'JetBrains Mono', monospace;
        background: #07080d;
        border: 1px solid #242a3c;
        color: #f8fafc;
        padding: 12px 14px;
        font-size: 13.5px;
        width: 100%;
        outline: none;
        resize: vertical;
        min-height: 80px;
        border-radius: 4px;
        transition: border-color 0.15s ease;
        box-shadow: none !important;
      }
      .cg-textarea:focus { border-color: #38bdf8; box-shadow: none !important; }
      .cg-textarea::placeholder { color: #64748b; }

      .cg-label {
        font-size: 11px;
        letter-spacing: 0.12em;
        color: #94a3b8;
        text-transform: uppercase;
        font-weight: 600;
      }

      .cg-fade-in { animation: cgFadeIn 0.5s ease both; }
      @keyframes cgFadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }

      .cg-blink { animation: cgBlink 1.1s steps(1) infinite; }
      @keyframes cgBlink { 50% { opacity: 0; } }

      @media (prefers-reduced-motion: reduce) {
        .cg-fade-in, .cg-blink { animation: none !important; }
      }

      /* ---------------------------------------------------------------- */
      /* shell nav bar                                                    */
      /* ---------------------------------------------------------------- */
      .cg-shell-bar {
        position: relative;
        z-index: 41;
        background: var(--bg);
        border-bottom: 1px solid var(--border);
        padding: 16px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .cg-shell-user { display: flex; align-items: center; gap: 14px; }
      .cg-mobile-user { display: none; }

      .cg-nav-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
      .cg-nav-tab {
        font-size: 12px;
        letter-spacing: 0.04em;
        padding: 9px 14px;
        cursor: pointer;
        color: var(--text-dim);
        border-bottom: 2px solid transparent;
        white-space: nowrap;
      }
      .cg-nav-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
      .cg-nav-tab.active.super { color: var(--accent-super); border-bottom-color: var(--accent-super); }
      .cg-nav-tab:hover { color: var(--text); }

      .cg-hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        width: 34px;
        height: 34px;
        background: transparent;
        border: 1px solid var(--border-hi);
        cursor: pointer;
        padding: 0;
        position: relative;
        z-index: 41;
      }
      .cg-hamburger span {
        display: block;
        width: 16px;
        height: 2px;
        margin: 0 auto;
        background: var(--accent);
        transition: transform 0.2s ease, opacity 0.2s ease;
      }
      .cg-hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
      .cg-hamburger.open span:nth-child(2) { opacity: 0; }
      .cg-hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

      @media (max-width: 720px) {
        .cg-hamburger { display: flex; }
        .cg-shell-user { display: none; }
        .cg-nav-tabs {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 40;
          flex-direction: column;
          gap: 0;
          background: var(--bg);
          padding: 96px 28px 28px;
          overflow-y: auto;
        }
        .cg-nav-tabs.open { display: flex; }
        .cg-nav-tab { padding: 18px 4px; font-size: 15px; border-bottom: 1px solid var(--border); }
        .cg-nav-tab.active { border-bottom: 1px solid var(--border); background: var(--accent-soft); }
        .cg-nav-tab.active.super { border-bottom: 1px solid var(--border); background: var(--accent-super-soft); }
        .cg-mobile-user {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 32px;
        }
      }

      /* ---------------------------------------------------------------- */
      /* seat bar (projects)                                              */
      /* ---------------------------------------------------------------- */
      .cg-seatbar { display: flex; gap: 3px; }
      .cg-seat { width: 10px; height: 14px; border: 1px solid var(--border-hi); }
      .cg-seat.filled { background: var(--accent); border-color: var(--accent); }
      .cg-seat.full { background: var(--danger); border-color: var(--danger); }

      /* dept cards grid — responsive                                     */
      @media (max-width: 600px) {
        .cg-dept-grid { grid-template-columns: repeat(3, 1fr) !important; }
      }
      @media (max-width: 380px) {
        .cg-dept-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }

      .cg-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
      .cg-scroll::-webkit-scrollbar-thumb { background: var(--border-hi); }
      .cg-scroll::-webkit-scrollbar-track { background: transparent; }

      /* ---------------------------------------------------------------- */
      /* corner brackets                                                  */
      /* ---------------------------------------------------------------- */
      .cg-corner { position: absolute; width: 10px; height: 10px; pointer-events: none; }
      .cg-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--corner, var(--border-hi)); border-left: 2px solid var(--corner, var(--border-hi)); }
      .cg-corner.tr { top: -1px; right: -1px; border-top: 2px solid var(--corner, var(--border-hi)); border-right: 2px solid var(--corner, var(--border-hi)); }
      .cg-corner.bl { bottom: -1px; left: -1px; border-bottom: 2px solid var(--corner, var(--border-hi)); border-left: 2px solid var(--corner, var(--border-hi)); }
      .cg-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--corner, var(--border-hi)); border-right: 2px solid var(--corner, var(--border-hi)); }

      /* ---------------------------------------------------------------- */
      /* leaderboard podium                                               */
      /* ---------------------------------------------------------------- */
      .cg-podium { display: flex; align-items: flex-end; justify-content: center; gap: 14px; margin-bottom: 34px; }
      .cg-podium-card {
        position: relative;
        flex: 1;
        max-width: 220px;
        background: var(--bg-panel);
        border: 1px solid var(--border);
        padding: 24px 14px 20px;
        text-align: center;
        --corner: var(--border-hi);
      }
      .cg-podium-card.rank-1 { padding: 40px 16px 30px; border-color: var(--accent); background: var(--accent-soft); --corner: var(--accent); }
      .cg-podium-card.rank-2 { padding-bottom: 24px; }
      .cg-podium-card.rank-3 { padding-bottom: 16px; }
      .cg-podium-rank { font-size: 11px; letter-spacing: 0.14em; color: var(--text-dim); margin-bottom: 10px; }
      .cg-podium-card.rank-1 .cg-podium-rank { color: var(--accent); }
      .cg-podium-name { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 600; margin-bottom: 14px; word-break: break-word; }
      .cg-podium-card.rank-1 .cg-podium-name { font-size: 18px; }
      .cg-podium-points { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; color: var(--accent); }
      .cg-podium-card.rank-1 .cg-podium-points { font-size: 32px; }
      .cg-podium-you {
        position: absolute; top: 10px; right: 10px;
        font-size: 9px; letter-spacing: 0.08em; font-weight: 700;
        color: #ffffff; background: var(--accent); padding: 2px 6px;
      }

      .cg-lb-header, .cg-lb-row {
        display: grid;
        grid-template-columns: 50px 1fr 140px 90px;
        padding: 12px 16px;
        align-items: center;
      }
      .cg-lb-row.you { background: var(--accent-soft); }
      .cg-lb-you-tag {
        margin-left: 8px; font-size: 9px; letter-spacing: 0.08em; font-weight: 700;
        color: #ffffff; background: var(--accent); padding: 1px 5px;
      }
      @media (max-width: 560px) {
        .cg-lb-header, .cg-lb-row { grid-template-columns: 36px 1fr 74px; }
        .cg-lb-regno { display: none; }
        .cg-podium { gap: 8px; }
        .cg-podium-card { padding: 18px 8px 16px; }
        .cg-podium-card.rank-1 { padding: 28px 10px 22px; }
      }

      /* ---------------------------------------------------------------- */
      /* departments                                                      */
      /* ---------------------------------------------------------------- */
      .cg-dept-layout { display: grid; grid-template-columns: 260px 1fr; gap: 30px; align-items: start; }
      .cg-dept-sticky { position: sticky; top: 24px; }
      .cg-dept-stack { display: flex; flex-direction: column; gap: 12px; }
      .cg-dept-stack-item {
        position: relative;
        background: var(--bg-panel);
        border: 1px solid var(--border);
        padding: 22px 26px;
        cursor: pointer;
        transition: border-color 0.15s ease, background 0.15s ease;
        --corner: var(--border-hi);
      }
      .cg-dept-stack-item:hover:not(.disabled) { border-color: var(--border-hi); }
      .cg-dept-stack-item.selected { border-color: var(--accent); background: var(--accent-soft); --corner: var(--accent); }
      .cg-dept-stack-item.disabled { cursor: default; }
      .cg-dept-badge {
        position: absolute; top: 16px; right: 16px;
        font-size: 11px; letter-spacing: 0.05em; font-weight: 700;
        color: #05130d; background: var(--accent); padding: 2px 7px;
      }
      .cg-dept-locked-tag {
        position: absolute; top: 16px; right: 16px;
        font-size: 10px; letter-spacing: 0.05em;
        color: var(--danger); border: 1px solid var(--danger); padding: 2px 7px;
      }
      .cg-dept-stack.shake { animation: cgShake 0.35s ease; }
      @keyframes cgShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
      }
      @media (max-width: 720px) {
        .cg-dept-layout { grid-template-columns: 1fr; }
        .cg-dept-sticky { position: static; }
      }
      @media (prefers-reduced-motion: reduce) {
        .cg-dept-stack.shake { animation: none !important; }
      }

      /* ---------------------------------------------------------------- */
      /* landing terminal                                                 */
      /* ---------------------------------------------------------------- */
      .cg-terminal-shell {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 22px;
        --corner: var(--border-hi);
      }
      .cg-terminal-shell.focused { --corner: var(--accent); }
      .cg-terminal-shell.error { --corner: var(--danger); animation: cgShake 0.35s ease; }
      .cg-terminal-prompt { color: var(--accent); font-size: 14px; font-family: 'JetBrains Mono', monospace; }
      .cg-terminal-input {
        appearance: none;
        -webkit-appearance: none;
        background: transparent !important;
        background-image: none;
        border: none;
        border-radius: 0;
        box-shadow: none;
        outline: none;
        color: var(--text);
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        padding: 0;
      }
      .cg-terminal-input:focus,
      .cg-terminal-input:focus-visible {
        outline: none;
        box-shadow: none;
      }
      .cg-terminal-input::placeholder { color: var(--text-dim); }
      @media (prefers-reduced-motion: reduce) {
        .cg-terminal-shell.error { animation: none !important; }
      }

      /* ---------------------------------------------------------------- */
      /* dashboard stats                                                  */
      /* ---------------------------------------------------------------- */
      .cg-dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 14px;
        margin-bottom: 30px;
      }
      @media (max-width: 720px) {
        .cg-dashboard-stats { grid-template-columns: 1fr 1fr; }
        .cg-dashboard-stats > div:nth-child(1),
        .cg-dashboard-stats > div:nth-child(2) { grid-column: span 2; }
      }

      /* ---------------------------------------------------------------- */
      /* admin / super-admin inner tab bar                                */
      /* ---------------------------------------------------------------- */
      .cg-admin-tabs {
        display: flex;
        gap: 0;
        border-bottom: 1px solid var(--border);
        margin-bottom: 28px;
        flex-wrap: wrap;
      }
      .cg-admin-tab {
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 11px 20px;
        cursor: pointer;
        color: var(--text-dim);
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        white-space: nowrap;
      }
      .cg-admin-tab:hover { color: var(--text); }
      .cg-admin-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
      .cg-admin-tab.active.super { color: var(--accent-super); border-bottom-color: var(--accent-super); }
      
      @media (max-width: 640px) {
        .cg-admin-tabs {
          flex-direction: column;
          border-bottom: none;
          gap: 6px;
        }
        .cg-admin-tab {
          width: 100%;
          text-align: center;
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-panel);
          border-radius: 4px;
        }
        .cg-admin-tab.active {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
        }
        .cg-admin-tab.active.super {
          border-color: var(--accent-super);
          background: var(--accent-super-soft);
          color: var(--accent-super);
        }
      }

      /* ---------------------------------------------------------------- */
      /* Layout formatting for inner tools & headers                      */
      /* ---------------------------------------------------------------- */
      .cg-admin-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 12px;
      }
      @media (max-width: 640px) {
        .cg-admin-controls {
          flex-direction: column;
          align-items: stretch;
        }
        .cg-admin-controls .cg-filter-bar, .cg-admin-controls .cg-select {
          width: 100%; margin: 0;
        }
        .cg-admin-controls > .cg-btn {
          width: 100%;
        }
      }

      /* ---------------------------------------------------------------- */
      /* admin base grid classes                                          */
      /* ---------------------------------------------------------------- */
      .cg-admin-user-row {
        grid-template-columns: 1.2fr 1fr 100px 140px;
      }
      
      .cg-hide-mobile {
        display: block;
      }

      /* ---------------------------------------------------------------- */
      /* member row in admin tables                                       */
      /* ---------------------------------------------------------------- */
      .cg-member-row {
        display: grid;
        padding: 13px 16px;
        align-items: center;
        border-bottom: 1px solid var(--border);
        cursor: pointer;
        transition: background 0.12s ease;
        gap: 8px;
      }
      .cg-member-row:hover { background: var(--bg-panel-hi); }
      .cg-member-row.expanded { background: var(--bg-panel-hi); border-bottom: none; }
      .cg-member-detail {
        padding: 0 16px 16px;
        border-bottom: 1px solid var(--border);
        background: var(--bg-panel-hi);
        animation: cgFadeIn 0.2s ease;
      }
      .cg-member-actions {
        display: flex; gap: 8px; flex-wrap: wrap;
      }

      @media (max-width: 720px) {
        .cg-admin-user-row { grid-template-columns: 1fr 80px 110px; }
        .cg-hide-mobile { display: none !important; }
      }
      @media (max-width: 500px) {
        .cg-admin-user-row { grid-template-columns: 1fr 70px 100px; }
        .cg-member-actions { flex-direction: column; width: 100%; }
        .cg-member-actions > .cg-btn { width: 100%; }
      }

      /* ---------------------------------------------------------------- */
      /* project management table                                         */
      /* ---------------------------------------------------------------- */
      .cg-proj-row {
        display: grid;
        grid-template-columns: 1fr 90px 110px;
        padding: 13px 16px;
        align-items: center;
        border-bottom: 1px solid var(--border);
        gap: 8px;
        transition: background 0.12s ease;
      }
      .cg-proj-row:hover { background: var(--bg-panel-hi); }
      .cg-proj-actions {
        display: flex; gap: 8px; flex-wrap: wrap;
      }
      
      @media (max-width: 640px) {
        .cg-proj-row { grid-template-columns: 1fr 70px 105px; }
      }
      @media (max-width: 400px) {
        .cg-proj-row { grid-template-columns: 1fr 60px 100px; }
        .cg-proj-actions .cg-btn-sm { padding: 7px 10px; font-size: 10px; }
      }

      /* ---------------------------------------------------------------- */
      /* Submissions tools & pending actions                              */
      /* ---------------------------------------------------------------- */
      .cg-submission-actions {
        display: flex; gap: 10px; flex-wrap: wrap;
      }
      @media (max-width: 500px) {
        .cg-filter-bar.cg-submission-filters {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .cg-filter-bar.cg-submission-filters > button {
          width: 100%; margin: 0;
        }
        .cg-submission-actions { flex-direction: column; }
        .cg-submission-actions > button { width: 100%; }
      }

      /* ---------------------------------------------------------------- */
      /* modal overlay                                                    */
      /* ---------------------------------------------------------------- */
      .cg-form-grid-2 {
        display: grid;
        grid-template-columns: 1fr 130px;
        gap: 14px;
      }
      @media (max-width: 520px) {
        .cg-form-grid-2 {
          grid-template-columns: 1fr !important;
        }
      }

      .cg-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.78);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        overflow-y: auto;
      }
      .cg-modal {
        background: #111420;
        border: 1px solid #2e364f;
        padding: 32px 28px;
        width: 100%;
        max-width: 540px;
        position: relative;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9);
        margin: auto;
        max-height: calc(100vh - 40px);
        overflow-y: auto;
        animation: cgSlideUp 0.22s ease;
        border-radius: 8px;
      }
      .cg-modal-actions {
        display: flex; gap: 12px;
      }
      @media (max-width: 560px) {
        .cg-modal-overlay { padding: 12px; }
        .cg-modal { padding: 24px 18px; }
        .cg-modal-actions { flex-direction: column; }
        .cg-modal-actions > button { width: 100%; }
      }
      @keyframes cgSlideUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .cg-modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: #181c2b;
        border: 1px solid #2d354d;
        color: #94a3b8;
        font-size: 16px;
        cursor: pointer;
        line-height: 1;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
      }
      .cg-modal-close:hover {
        color: #ffffff;
        border-color: #38bdf8;
        background: rgba(56, 189, 248, 0.2);
      }

      /* ---------------------------------------------------------------- */
      /* filter bar                                                       */
      /* ---------------------------------------------------------------- */
      .cg-filter-bar {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 16px;
        align-items: center;
      }
      .cg-filter-bar .cg-input { width: auto; flex: 1; min-width: 160px; }
      .cg-filter-bar .cg-select { width: auto; min-width: 120px; }

      /* ---------------------------------------------------------------- */
      /* role & status badges                                             */
      /* ---------------------------------------------------------------- */
      .cg-badge {
        display: inline-flex;
        align-items: center;
        font-size: 9.5px;
        letter-spacing: 0.08em;
        font-weight: 700;
        padding: 2px 7px;
        text-transform: uppercase;
        white-space: nowrap;
      }
      .cg-badge-member { color: var(--text-dim); border: 1px solid var(--border-hi); }
      .cg-badge-admin { color: var(--accent); border: 1px solid var(--accent); background: var(--accent-soft); }
      .cg-badge-super { color: var(--accent-super); border: 1px solid var(--accent-super); background: var(--accent-super-soft); }
      .cg-badge-pending { color: var(--warn); border: 1px solid var(--warn); background: var(--warn-soft); }
      .cg-badge-approved { color: var(--accent); border: 1px solid var(--accent); background: var(--accent-soft); }
      .cg-badge-rejected { color: var(--danger); border: 1px solid var(--danger); background: var(--danger-soft); }

      /* ---------------------------------------------------------------- */
      /* pending submission card                                          */
      /* ---------------------------------------------------------------- */
      .cg-submission-card {
        border: 1px solid var(--border);
        background: var(--bg-panel);
        padding: 18px 20px;
        margin-bottom: 12px;
        transition: border-color 0.15s ease;
      }
      .cg-submission-card:hover { border-color: var(--border-hi); }
      .cg-submission-card.approved { border-left: 3px solid var(--accent); }
      .cg-submission-card.rejected { border-left: 3px solid var(--danger); opacity: 0.6; }

      /* ---------------------------------------------------------------- */
      /* analytics stat cards                                             */
      /* ---------------------------------------------------------------- */
      .cg-analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 14px;
        margin-bottom: 32px;
      }
      .cg-stat-card {
        background: var(--bg-panel);
        border: 1px solid var(--border);
        padding: 20px;
        position: relative;
        overflow: hidden;
      }
      .cg-stat-card::after {
        content: '';
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 2px;
        background: var(--card-accent, var(--border-hi));
      }
      .cg-stat-card-value {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 34px;
        font-weight: 700;
        color: var(--card-accent, var(--text));
        margin: 8px 0 2px;
        line-height: 1;
      }
      .cg-stat-card-sub { font-size: 11px; color: var(--text-dim); }

      /* ---------------------------------------------------------------- */
      /* empty state                                                      */
      /* ---------------------------------------------------------------- */
      .cg-empty {
        text-align: center;
        padding: 48px 24px;
        color: var(--text-dim);
        font-size: 13px;
      }
      .cg-empty-glyph { font-size: 32px; margin-bottom: 12px; opacity: 0.4; }

      /* ---------------------------------------------------------------- */
      /* form rows                                                        */
      /* ---------------------------------------------------------------- */
      .cg-form-row { margin-bottom: 14px; }
      .cg-form-row .cg-label { display: block; margin-bottom: 6px; }

      /* ---------------------------------------------------------------- */
      /* DYSON SPHERE FOOTER ANIMATION                                    */
      /* ---------------------------------------------------------------- */
      .dyson-container {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 20px auto 50px auto;
        perspective: 800px;
      }
      .dyson-sphere {
        position: absolute;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        animation: core-spin 40s linear infinite;
      }
      .dyson-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .dyson-ring.r1 {
        border: 3px dashed var(--accent);
        animation: spin1 8s linear infinite;
      }
      .dyson-ring.r2 {
        border: 3px dashed var(--accent);
        animation: spin2 12s linear infinite;
      }
      .dyson-ring.r3 {
        border: 3px solid var(--accent);
        animation: spin3 10s linear infinite;
      }
      .dyson-ring.r4 {
        border: 3px solid var(--accent);
        animation: spin4 15s linear infinite;
      }
      .dyson-logo {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70px;
        height: 70px;
        z-index: 10;
        object-fit: contain;
      }
      .cg-logo-hero {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(56px, 11vw, 104px);
        font-weight: 300;
        color: var(--text);
        letter-spacing: 0.08em;
        line-height: 1;
        user-select: none;
      }
      .cg-logo-nav {
        font-family: 'Cormorant Garamond', serif;
        font-size: 24px;
        font-weight: 400;
        color: var(--text);
        letter-spacing: 0.06em;
        line-height: 1;
        user-select: none;
        white-space: nowrap;
      }
      .landing-dyson-bg {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        overflow: hidden;
      }
      .landing-dyson-bg .dyson-container {
        width: 80vmin;
        height: 80vmin;
        max-width: 700px;
        max-height: 700px;
        margin: 0;
        perspective: 2000px;
        opacity: 0.25;
      }
      .landing-dyson-bg .dyson-logo {
        width: 20vmin;
        height: 20vmin;
        max-width: 150px;
        max-height: 150px;
        opacity: 0.5;
      }
      .landing-glass-card {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 64px;
      }

      @keyframes spin1 {
        0% { transform: rotateX(90deg) rotateY(0deg) rotateZ(0deg); }
        100% { transform: rotateX(90deg) rotateY(0deg) rotateZ(360deg); }
      }
      @keyframes spin2 {
        0% { transform: rotateX(0deg) rotateY(90deg) rotateZ(0deg); }
        100% { transform: rotateX(0deg) rotateY(90deg) rotateZ(-360deg); }
      }
      @keyframes spin3 {
        0% { transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg); }
        100% { transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg); }
      }
      @keyframes spin4 {
        0% { transform: rotateX(-45deg) rotateY(-45deg) rotateZ(0deg); }
        100% { transform: rotateX(-45deg) rotateY(-45deg) rotateZ(-360deg); }
      }
      @keyframes core-spin {
        0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
      }
    `}</style>
  );
}