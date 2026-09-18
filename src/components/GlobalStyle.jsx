export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

      .cg-root {
        --bg: #111315;
        --bg-panel: #1C2022;
        --bg-panel-hi: #222729;
        --border: #303638;
        --border-hi: #454D50;
        --text: #E8E5DC;
        --text-dim: #929795;
        --accent: #D6A94A;
        --accent-soft: rgba(214, 169, 74, 0.15);
        --accent-2: #718A91;
        --accent-super: #D6A94A;
        --accent-super-soft: rgba(214, 169, 74, 0.15);
        --danger: #B24C4C;
        --danger-soft: rgba(178, 76, 76, 0.15);
        --warn: #D6A94A;
        --warn-soft: rgba(214, 169, 74, 0.15);
        --success: #6E8B68;
        
        font-family: 'Inter', sans-serif;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
        width: 100%;
        position: relative;
        overflow-x: hidden;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      *, *::before, *::after { box-sizing: border-box; }
      .cg-display { font-family: 'Inter', sans-serif; }

      /* Buttons */
      .cg-btn {
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 0.02em;
        padding: 10px 18px;
        background: #16191B;
        border: 1px solid var(--border);
        color: var(--text);
        cursor: pointer;
        position: relative;
        border-radius: 2px;
        transition: background 0.15s ease, border-color 0.15s ease;
        box-shadow: none !important;
      }
      .cg-btn:hover:not(:disabled) { 
        background: var(--bg-panel-hi); 
        border-color: var(--border-hi); 
      }
      .cg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      
      .cg-btn-solid {
        background: var(--text);
        color: var(--bg);
        border: 1px solid var(--text);
      }
      .cg-btn-solid:hover:not(:disabled) { 
        background: #C4C1B9; 
        border-color: #C4C1B9; 
      }
      
      .cg-btn-danger {
        background: transparent;
        color: var(--danger);
        border: 1px solid var(--danger);
      }
      .cg-btn-danger:hover:not(:disabled) { 
        background: var(--danger-soft); 
      }
      
      .cg-btn-warn {
        background: transparent;
        color: var(--warn);
        border: 1px solid var(--warn);
      }
      .cg-btn-warn:hover:not(:disabled) { 
        background: var(--warn-soft); 
      }
      
      .cg-btn-super {
        background: var(--bg-panel-hi);
        color: var(--text);
        border: 1px solid var(--border-hi);
      }
      .cg-btn-super:hover:not(:disabled) { 
        background: var(--accent-soft); 
        border-color: var(--accent);
      }
      
      .cg-btn-sm {
        font-size: 12px;
        padding: 6px 12px;
      }

      /* Panels & Inputs */
      .cg-panel {
        background: var(--bg-panel);
        border: 1px solid var(--border);
        border-radius: 2px;
        box-shadow: none !important;
      }
      
      .cg-input, .cg-select, .cg-textarea {
        font-family: 'JetBrains Mono', monospace;
        background: #16191B;
        border: 1px solid var(--border);
        color: var(--text);
        padding: 10px 14px;
        font-size: 13px;
        width: 100%;
        outline: none;
        border-radius: 2px;
        transition: border-color 0.15s ease, background 0.15s ease;
        box-shadow: none !important;
      }
      .cg-input:focus, .cg-select:focus, .cg-textarea:focus { 
        border-color: var(--accent); 
        background: var(--bg-panel);
      }
      .cg-input::placeholder, .cg-textarea::placeholder { 
        color: var(--text-dim); 
      }
      .cg-select {
        cursor: pointer;
        appearance: none;
      }
      .cg-textarea {
        resize: vertical;
        min-height: 80px;
      }

      .cg-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        letter-spacing: 0.08em;
        color: var(--text-dim);
        text-transform: uppercase;
        font-weight: 500;
        margin-bottom: 6px;
        display: block;
      }

      /* Animations */
      .cg-fade-in { animation: cgFadeIn 0.3s ease both; }
      @keyframes cgFadeIn { 
        from { opacity: 0; } 
        to { opacity: 1; } 
      }

      .cg-blink { opacity: 1; } /* Disabled blink */

      /* Shell Bar */
      .cg-shell-bar {
        position: relative;
        z-index: 41;
        background: var(--bg-panel);
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
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 500;
        padding: 8px 14px;
        cursor: pointer;
        color: var(--text-dim);
        border-bottom: 2px solid transparent;
        white-space: nowrap;
        transition: color 0.15s ease;
      }
      .cg-nav-tab.active { 
        color: var(--text); 
        border-bottom-color: var(--accent); 
      }
      .cg-nav-tab.active.super { 
        color: var(--text); 
        border-bottom-color: var(--accent); 
      }
      .cg-nav-tab:hover { color: var(--text); }

      .cg-hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        width: 32px;
        height: 32px;
        background: transparent;
        border: 1px solid var(--border-hi);
        cursor: pointer;
        padding: 0;
        border-radius: 2px;
      }
      .cg-hamburger span {
        display: block;
        width: 14px;
        height: 2px;
        margin: 0 auto;
        background: var(--text);
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
          padding: 80px 24px 24px;
          overflow-y: auto;
        }
        .cg-nav-tabs.open { display: flex; }
        .cg-nav-tab { padding: 16px 4px; font-size: 15px; border-bottom: 1px solid var(--border); }
        .cg-nav-tab.active, .cg-nav-tab.active.super { 
          border-bottom: 1px solid var(--border); 
          background: var(--bg-panel); 
        }
        .cg-mobile-user {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 32px;
        }
      }

      /* Seat Bar (Projects) */
      .cg-seatbar { display: flex; gap: 4px; }
      .cg-seat { width: 12px; height: 12px; border: 1px solid var(--border-hi); border-radius: 1px; }
      .cg-seat.filled { background: var(--accent); border-color: var(--accent); }
      .cg-seat.full { background: var(--danger); border-color: var(--danger); }

      @media (max-width: 600px) {
        .cg-dept-grid { grid-template-columns: repeat(3, 1fr) !important; }
      }
      @media (max-width: 380px) {
        .cg-dept-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }

      .cg-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
      .cg-scroll::-webkit-scrollbar-thumb { background: var(--border-hi); }
      .cg-scroll::-webkit-scrollbar-track { background: transparent; }

      /* Corner Brackets (kept logical layout, removed visual styling) */
      .cg-corner { display: none; }

      /* Leaderboard Podium */
      .cg-podium { display: flex; align-items: flex-end; justify-content: center; gap: 16px; margin-bottom: 32px; }
      .cg-podium-card {
        position: relative;
        flex: 1;
        max-width: 220px;
        background: var(--bg-panel);
        border: 1px solid var(--border);
        padding: 24px 16px;
        text-align: center;
        border-radius: 2px;
      }
      .cg-podium-card.rank-1 { padding: 32px 16px; border-top: 3px solid var(--accent); background: var(--bg-panel-hi); }
      .cg-podium-card.rank-2 { padding-bottom: 24px; border-top: 3px solid var(--text-dim); }
      .cg-podium-card.rank-3 { padding-bottom: 24px; border-top: 3px solid var(--border-hi); }
      .cg-podium-rank { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; color: var(--text-dim); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em; }
      .cg-podium-card.rank-1 .cg-podium-rank { color: var(--accent); }
      .cg-podium-name { font-size: 15px; font-weight: 500; margin-bottom: 12px; word-break: break-word; }
      .cg-podium-card.rank-1 .cg-podium-name { font-size: 16px; font-weight: 600; color: var(--text); }
      .cg-podium-points { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 500; color: var(--text); }
      .cg-podium-card.rank-1 .cg-podium-points { font-size: 24px; color: var(--accent); }
      .cg-podium-you {
        position: absolute; top: 8px; right: 8px;
        font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 600;
        color: var(--bg); background: var(--text); padding: 2px 6px; border-radius: 2px;
      }

      .cg-lb-header, .cg-lb-row {
        display: grid;
        grid-template-columns: 50px 1fr 140px 90px;
        padding: 12px 16px;
        align-items: center;
        border-bottom: 1px solid var(--border);
      }
      .cg-lb-header { background: var(--bg-panel); font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; color: var(--text-dim); text-transform: uppercase; }
      .cg-lb-row { background: var(--bg-panel); font-size: 14px; }
      .cg-lb-row.you { background: var(--bg-panel-hi); font-weight: 500; border-left: 2px solid var(--accent); }
      .cg-lb-you-tag {
        margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 600;
        color: var(--bg); background: var(--text); padding: 2px 6px; border-radius: 2px;
      }
      
      @media (max-width: 560px) {
        .cg-lb-header, .cg-lb-row { grid-template-columns: 36px 1fr 74px; }
        .cg-lb-regno { display: none; }
        .cg-podium { gap: 8px; }
        .cg-podium-card { padding: 16px 8px; }
        .cg-podium-card.rank-1 { padding: 24px 8px; }
      }

      /* Departments */
      .cg-dept-layout { display: grid; grid-template-columns: 260px 1fr; gap: 32px; align-items: start; }
      .cg-dept-sticky { position: sticky; top: 24px; }
      .cg-dept-stack { display: flex; flex-direction: column; gap: 8px; }
      .cg-dept-stack-item {
        position: relative;
        background: var(--bg-panel);
        border: 1px solid var(--border);
        padding: 18px 20px;
        cursor: pointer;
        transition: border-color 0.15s ease, background 0.15s ease;
        border-radius: 2px;
      }
      .cg-dept-stack-item:hover:not(.disabled) { border-color: var(--border-hi); background: var(--bg-panel-hi); }
      .cg-dept-stack-item.selected { border-color: var(--accent); background: var(--bg-panel-hi); border-left: 3px solid var(--accent); }
      .cg-dept-stack-item.disabled { cursor: default; opacity: 0.6; }
      .cg-dept-badge {
        position: absolute; top: 16px; right: 16px;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
        color: var(--bg); background: var(--text); padding: 2px 6px; border-radius: 2px;
      }
      .cg-dept-locked-tag {
        position: absolute; top: 16px; right: 16px;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
        color: var(--danger); border: 1px solid var(--danger); padding: 2px 6px; border-radius: 2px;
      }
      
      @media (max-width: 720px) {
        .cg-dept-layout { grid-template-columns: 1fr; }
        .cg-dept-sticky { position: static; }
      }

      /* Landing Terminal / Login */
      .cg-terminal-shell {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px;
        background: var(--bg-panel);
        border: 1px solid var(--border);
        border-radius: 2px;
        width: 100%;
        max-width: 400px;
      }
      .cg-terminal-shell.error { border-color: var(--danger); }
      .cg-terminal-prompt { display: none; }
      .cg-terminal-input {
        background: var(--bg-panel-hi) !important;
        border: 1px solid var(--border-hi);
        border-radius: 2px;
        padding: 12px 14px;
        color: var(--text);
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        width: 100%;
        outline: none;
      }
      .cg-terminal-input:focus { border-color: var(--accent); }
      .cg-terminal-input::placeholder { color: var(--text-dim); }

      /* Dashboard Stats */
      .cg-dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 32px;
      }
      @media (max-width: 720px) {
        .cg-dashboard-stats { grid-template-columns: 1fr 1fr; }
        .cg-dashboard-stats > div:nth-child(1),
        .cg-dashboard-stats > div:nth-child(2) { grid-column: span 2; }
      }

      /* Admin Inner Tab Bar */
      .cg-admin-tabs {
        display: flex;
        gap: 0;
        border-bottom: 1px solid var(--border);
        margin-bottom: 24px;
        flex-wrap: wrap;
      }
      .cg-admin-tab {
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        font-weight: 500;
        padding: 12px 20px;
        cursor: pointer;
        color: var(--text-dim);
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        transition: color 0.15s ease;
        white-space: nowrap;
      }
      .cg-admin-tab:hover { color: var(--text); }
      .cg-admin-tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }
      .cg-admin-tab.active.super { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }
      
      @media (max-width: 640px) {
        .cg-admin-tabs { flex-direction: column; border-bottom: none; gap: 8px; }
        .cg-admin-tab {
          width: 100%; text-align: center; padding: 12px 16px;
          border: 1px solid var(--border); background: var(--bg-panel); border-radius: 2px;
        }
        .cg-admin-tab.active, .cg-admin-tab.active.super {
          border-color: var(--accent); background: var(--bg-panel-hi); color: var(--accent);
        }
      }

      /* Layout formatting for inner tools & headers */
      .cg-admin-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 12px;
      }
      @media (max-width: 640px) {
        .cg-admin-controls { flex-direction: column; align-items: stretch; }
        .cg-admin-controls .cg-filter-bar, .cg-admin-controls .cg-select { width: 100%; margin: 0; }
        .cg-admin-controls > .cg-btn { width: 100%; }
      }

      /* Admin base grid classes */
      .cg-admin-user-row { grid-template-columns: 1.2fr 1fr 100px 140px; }
      .cg-hide-mobile { display: block; }

      /* Member row in admin tables */
      .cg-member-row {
        display: grid;
        padding: 14px 16px;
        align-items: center;
        border-bottom: 1px solid var(--border);
        cursor: pointer;
        transition: background 0.1s ease;
        gap: 8px;
        background: var(--bg-panel);
        font-size: 13px;
      }
      .cg-member-row:hover { background: var(--bg-panel-hi); }
      .cg-member-row.expanded { background: var(--bg-panel-hi); border-bottom: none; }
      .cg-member-detail {
        padding: 0 16px 16px;
        border-bottom: 1px solid var(--border);
        background: var(--bg-panel-hi);
        font-size: 13px;
      }
      .cg-member-actions { display: flex; gap: 8px; flex-wrap: wrap; }

      @media (max-width: 720px) {
        .cg-admin-user-row { grid-template-columns: 1fr 80px 110px; }
        .cg-hide-mobile { display: none !important; }
      }
      @media (max-width: 500px) {
        .cg-admin-user-row { grid-template-columns: 1fr 70px 100px; }
        .cg-member-actions { flex-direction: column; width: 100%; }
        .cg-member-actions > .cg-btn { width: 100%; }
      }

      /* Project management table */
      .cg-proj-row {
        display: grid;
        grid-template-columns: 1fr 90px 110px;
        padding: 14px 16px;
        align-items: center;
        border-bottom: 1px solid var(--border);
        gap: 8px;
        background: var(--bg-panel);
        font-size: 13px;
      }
      .cg-proj-row:hover { background: var(--bg-panel-hi); }
      .cg-proj-actions { display: flex; gap: 8px; flex-wrap: wrap; }
      
      @media (max-width: 640px) { .cg-proj-row { grid-template-columns: 1fr 70px 105px; } }
      @media (max-width: 400px) {
        .cg-proj-row { grid-template-columns: 1fr 60px 100px; }
        .cg-proj-actions .cg-btn-sm { padding: 6px 10px; font-size: 11px; }
      }

      /* Submissions tools & pending actions */
      .cg-submission-actions { display: flex; gap: 8px; flex-wrap: wrap; }
      @media (max-width: 500px) {
        .cg-filter-bar.cg-submission-filters { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .cg-filter-bar.cg-submission-filters > button { width: 100%; margin: 0; }
        .cg-submission-actions { flex-direction: column; }
        .cg-submission-actions > button { width: 100%; }
      }

      /* Modal overlay */
      .cg-form-grid-2 { display: grid; grid-template-columns: 1fr 130px; gap: 16px; }
      @media (max-width: 520px) { .cg-form-grid-2 { grid-template-columns: 1fr !important; } }

      .cg-modal-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        width: 100vw; height: 100vh; z-index: 999999;
        background: rgba(17, 19, 21, 0.7);
        display: flex; align-items: center; justify-content: center;
        padding: 24px; overflow-y: auto;
      }
      .cg-modal {
        background: var(--bg-panel);
        border: 1px solid var(--border);
        padding: 32px;
        width: 100%; max-width: 540px;
        position: relative;
        margin: auto;
        max-height: calc(100vh - 48px);
        overflow-y: auto;
        border-radius: 2px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      }
      .cg-modal-actions { display: flex; gap: 12px; margin-top: 24px; }
      @media (max-width: 560px) {
        .cg-modal-overlay { padding: 16px; }
        .cg-modal { padding: 24px; }
        .cg-modal-actions { flex-direction: column; }
        .cg-modal-actions > button { width: 100%; }
      }
      
      .cg-modal-close {
        position: absolute; top: 16px; right: 16px;
        background: var(--bg); border: 1px solid var(--border); color: var(--text-dim);
        font-size: 20px; cursor: pointer; border-radius: 2px;
        width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
        transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
      }
      .cg-modal-close:hover { color: var(--text); background: var(--bg-panel-hi); border-color: var(--border-hi); }

      /* Filter bar */
      .cg-filter-bar { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; align-items: center; }
      .cg-filter-bar .cg-input { width: auto; flex: 1; min-width: 160px; }
      .cg-filter-bar .cg-select { width: auto; min-width: 120px; }

      /* Role & Status badges */
      .cg-badge {
        display: inline-flex; align-items: center;
        font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; padding: 2px 6px;
        text-transform: uppercase; white-space: nowrap; border-radius: 2px;
      }
      .cg-badge-member { color: var(--text-dim); border: 1px solid var(--border); background: var(--bg); }
      .cg-badge-admin { color: var(--accent); border: 1px solid var(--accent); background: var(--accent-soft); }
      .cg-badge-super { color: var(--bg-panel); border: 1px solid var(--accent); background: var(--accent); }
      .cg-badge-pending { color: var(--warn); border: 1px solid var(--warn); background: var(--bg); }
      .cg-badge-approved { color: var(--success); border: 1px solid var(--success); background: rgba(110, 139, 104, 0.15); }
      .cg-badge-rejected { color: var(--danger); border: 1px solid var(--danger); background: var(--danger-soft); }

      /* Pending submission card */
      .cg-submission-card {
        border: 1px solid var(--border); background: var(--bg-panel);
        padding: 20px; margin-bottom: 16px; border-radius: 2px;
      }
      .cg-submission-card.approved { border-left: 3px solid var(--success); }
      .cg-submission-card.rejected { border-left: 3px solid var(--danger); opacity: 0.7; }

      /* Analytics stat cards */
      .cg-analytics-grid {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 32px;
      }
      .cg-stat-card {
        background: var(--bg-panel); border: 1px solid var(--border); padding: 24px; border-radius: 2px;
      }
      .cg-stat-card-value {
        font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 500; color: var(--accent); margin: 8px 0 4px;
      }
      .cg-stat-card-sub { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-dim); text-transform: uppercase; }

      /* Empty state */
      .cg-empty { text-align: center; padding: 64px 24px; color: var(--text-dim); font-size: 14px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.05em; }
      .cg-empty-glyph { font-size: 24px; margin-bottom: 16px; }

      /* Form rows */
      .cg-form-row { margin-bottom: 16px; }

      /* Typography adjustments */
      .cg-logo-hero {
        font-family: 'Inter', sans-serif;
        font-size: clamp(32px, 6vw, 48px);
        font-weight: 600;
        color: var(--text);
        letter-spacing: 0.1em;
        line-height: 1.2;
        user-select: none;
      }
      .cg-logo-nav {
        font-family: 'Inter', sans-serif;
        font-size: 18px;
        font-weight: 600;
        color: var(--text);
        letter-spacing: 0.1em;
        line-height: 1;
        user-select: none;
        white-space: nowrap;
      }
      
      /* Layout Adjustments for Landing */
      .landing-glass-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 64px;
        text-align: center;
        background: var(--bg-panel);
        border: 1px solid var(--border);
        border-radius: 2px;
      }

    `}</style>
  );
}