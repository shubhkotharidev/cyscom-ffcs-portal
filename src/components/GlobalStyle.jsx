export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

      .cg-root {
        --bg: #ffffff;
        --bg-panel: #ffffff;
        --bg-panel-hi: #f0f0f0;
        --border: #000000;
        --border-hi: #000000;
        --text: #000000;
        --text-dim: #444444;
        --accent: #000000;
        --accent-soft: #e5e5e5;
        --accent-2: #000000;
        --accent-super: #000000;
        --accent-super-soft: #e5e5e5;
        --danger: #000000;
        --danger-soft: #e5e5e5;
        --warn: #000000;
        --warn-soft: #e5e5e5;
        --success: #000000;
        
        font-family: 'Space Grotesk', sans-serif;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
        width: 100%;
        position: relative;
        overflow-x: hidden;
      }
      .cg-root.cg-app-mode {
        background-image: none;
      }
      .cg-side-text {
        position: fixed;
        top: 0;
        bottom: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        color: #555555;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 900;
        font-size: clamp(8px, 1vw, 24px);
        line-height: 1.1;
        user-select: none;
        text-shadow: 0 0 1px #555555;
      }
      .cg-side-text pre {
        margin: 0;
        padding: 0;
      }
      .cg-side-text.left {
        left: 10px;
        writing-mode: vertical-rl;
        transform: rotate(180deg);
      }
      .cg-side-text.right {
        right: 10px;
        writing-mode: vertical-rl;
      }
      *, *::before, *::after { box-sizing: border-box; }
      .cg-display { font-family: 'Space Grotesk', sans-serif; font-weight: 800; }

      .cg-btn {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        font-weight: 700;
        padding: 12px 24px;
        background: #ffffff;
        border: 2px solid var(--border);
        color: var(--text);
        cursor: pointer;
        position: relative;
        border-radius: 0;
        transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
        box-shadow: 4px 4px 0px var(--border) !important;
        text-transform: uppercase;
      }
      .cg-btn:hover:not(:disabled) { 
        background: var(--accent-soft); 
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px var(--border) !important;
      }
      .cg-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      
      .cg-btn-solid {
        background: #000000;
        color: #ffffff;
        border: 2px solid #000000;
        box-shadow: 4px 4px 0px #000000 !important;
      }
      .cg-btn-solid:hover:not(:disabled) { 
        background: #222222; 
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #000000 !important;
      }
      .cg-btn-danger, .cg-btn-warn, .cg-btn-super {
        /* In B&W theme, these just follow the regular or solid styles */
        background: #ffffff;
        color: #000000;
      }

      .cg-btn-sm {
        font-size: 12px;
        padding: 8px 16px;
      }

      .cg-panel {
        background: var(--bg-panel);
        border: 2px solid var(--border);
        border-radius: 0;
        box-shadow: 6px 6px 0px var(--border) !important;
        position: relative;
      }

      /* Brutalist Window Card Style */
      .cg-brutalist-card {
        background: #ffffff;
        border: 2px solid #000000;
        box-shadow: 6px 6px 0px #000000;
        border-radius: 0;
        padding-top: 32px; /* space for window header */
        position: relative;
        margin-bottom: 24px;
      }
      .cg-brutalist-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 28px;
        border-bottom: 2px solid #000000;
        background: #d4d4d4; /* gray window bar */
      }
      .cg-brutalist-card::after {
        content: '';
        position: absolute;
        top: 10px;
        left: 12px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ffffff;
        border: 2px solid #000000;
        box-shadow: 16px 0 0 #ffffff, 16px 0 0 0 #000 inset, 16px 0 0 2px #000;
      }
      .cg-brutalist-card-content {
        padding: 16px;
      }

      .cg-input, .cg-select, .cg-textarea {
        font-family: 'JetBrains Mono', monospace;
        background: #ffffff;
        border: 2px solid #000000;
        color: #000000;
        padding: 12px 14px;
        font-size: 14px;
        width: 100%;
        outline: none;
        border-radius: 0;
        transition: box-shadow 0.15s ease;
        box-shadow: none !important;
      }
      .cg-input:focus, .cg-select:focus, .cg-textarea:focus { 
        box-shadow: 4px 4px 0px #000000 !important; 
      }
      .cg-input::placeholder, .cg-textarea::placeholder { color: #888888; }
      .cg-textarea { resize: vertical; min-height: 80px; }

      .cg-label {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: #000000;
        text-transform: uppercase;
      }

      .cg-fade-in { animation: cgFadeIn 0.5s ease both; }
      @keyframes cgFadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
      @media (prefers-reduced-motion: reduce) { .cg-fade-in { animation: none !important; } }

      /* shell nav bar */
      .cg-shell-bar {
        position: relative;
        z-index: 41;
        background: #e5e5e5;
        border-bottom: 2px solid #000000;
        padding: 16px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .cg-shell-user { display: flex; align-items: center; gap: 14px; font-weight: 700; }
      .cg-mobile-user { display: none; }

      .cg-nav-tabs { display: flex; gap: 0; border: 2px solid #000; background: #fff; box-shadow: 4px 4px 0px #000; }
      .cg-nav-tab {
        font-size: 14px;
        font-weight: 700;
        padding: 10px 20px;
        cursor: pointer;
        color: #000;
        border-right: 2px solid #000;
        white-space: nowrap;
        background: #fff;
        transition: background 0.1s ease;
      }
      .cg-nav-tab:last-child { border-right: none; }
      .cg-nav-tab.active { background: #d4d4d4; }
      .cg-nav-tab:hover { background: #e5e5e5; }

      .cg-hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        width: 38px;
        height: 38px;
        background: #fff;
        border: 2px solid #000;
        box-shadow: 2px 2px 0px #000;
        cursor: pointer;
        padding: 0;
        position: relative;
        z-index: 41;
      }
      .cg-hamburger span {
        display: block;
        width: 20px;
        height: 2px;
        margin: 0 auto;
        background: #000;
      }

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
          background: #fff;
          padding: 96px 28px 28px;
          border: none;
          box-shadow: none;
        }
        .cg-nav-tabs.open { display: flex; }
        .cg-nav-tab { padding: 18px 4px; font-size: 16px; border-right: none; border-bottom: 2px solid #000; }
        .cg-nav-tab.active { background: #e5e5e5; }
        .cg-mobile-user {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 32px;
          font-weight: 700;
        }
      }

      .cg-seatbar { display: flex; gap: 3px; }
      .cg-seat { width: 10px; height: 14px; border: 2px solid #000; }
      .cg-seat.filled { background: #000; }
      .cg-seat.full { background: #888; }

      @media (max-width: 600px) { .cg-dept-grid { grid-template-columns: repeat(3, 1fr) !important; } }
      @media (max-width: 380px) { .cg-dept-grid { grid-template-columns: repeat(2, 1fr) !important; } }

      .cg-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
      .cg-scroll::-webkit-scrollbar-thumb { background: #000; border: 1px solid #fff; }
      .cg-scroll::-webkit-scrollbar-track { background: #f0f0f0; border-left: 1px solid #000; }

      /* leaderboard podium */
      .cg-podium { display: flex; align-items: flex-end; justify-content: center; gap: 14px; margin-bottom: 40px; }
      .cg-podium-card {
        position: relative;
        flex: 1;
        max-width: 220px;
        background: #fff;
        border: 2px solid #000;
        box-shadow: 6px 6px 0px #000;
        padding: 24px 14px 20px;
        text-align: center;
      }
      .cg-podium-card.rank-1 { padding: 40px 16px 30px; background: #f0f0f0; }
      .cg-podium-rank { font-size: 12px; font-weight: 700; color: #000; margin-bottom: 10px; }
      .cg-podium-name { font-size: 16px; font-weight: 800; margin-bottom: 14px; word-break: break-word; }
      .cg-podium-points { font-size: 28px; font-weight: 800; color: #000; }
      .cg-podium-you {
        position: absolute; top: -12px; right: -12px;
        font-size: 10px; font-weight: 700;
        color: #fff; background: #000; padding: 4px 8px;
        border: 2px solid #000;
      }

      .cg-lb-header, .cg-lb-row {
        display: grid;
        grid-template-columns: 50px 1fr 140px 90px;
        padding: 16px;
        align-items: center;
        border: 2px solid #000;
        margin-bottom: 8px;
        background: #fff;
        box-shadow: 4px 4px 0px #000;
      }
      .cg-lb-header { background: #d4d4d4; font-weight: 700; }
      .cg-lb-row.you { background: #f0f0f0; }
      .cg-lb-you-tag {
        margin-left: 8px; font-size: 10px; font-weight: 700;
        color: #fff; background: #000; padding: 2px 6px;
      }
      @media (max-width: 560px) {
        .cg-lb-header, .cg-lb-row { grid-template-columns: 36px 1fr 74px; }
        .cg-lb-regno { display: none; }
      }

      /* departments */
      .cg-dept-layout { display: grid; grid-template-columns: 260px 1fr; gap: 30px; align-items: start; }
      .cg-dept-sticky { position: sticky; top: 24px; }
      .cg-dept-stack { display: flex; flex-direction: column; gap: 16px; }
      .cg-dept-stack-item {
        position: relative;
        background: #fff;
        border: 2px solid #000;
        box-shadow: 4px 4px 0px #000;
        padding: 22px 26px;
        cursor: pointer;
        transition: transform 0.1s ease, box-shadow 0.1s ease;
      }
      .cg-dept-stack-item:hover:not(.disabled) { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #000; }
      .cg-dept-stack-item.selected { background: #e5e5e5; }
      .cg-dept-stack-item.disabled { cursor: default; opacity: 0.6; }
      .cg-dept-badge {
        position: absolute; top: -10px; right: -10px;
        font-size: 11px; font-weight: 700;
        color: #fff; background: #000; padding: 4px 8px;
        border: 2px solid #000;
      }

      /* terminal -> brutalist input */
      .cg-terminal-shell {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 22px;
        border: 2px solid #000;
        box-shadow: 4px 4px 0px #000;
        background: #fff;
      }
      .cg-terminal-prompt { color: #000; font-weight: 700; font-size: 16px; }
      .cg-terminal-input {
        appearance: none; background: transparent; border: none; outline: none;
        color: #000; font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700;
      }
      .cg-terminal-input::placeholder { color: #888; }

      /* dashboard stats */
      .cg-dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      /* admin tabs */
      .cg-admin-tabs {
        display: flex;
        gap: 0;
        border-bottom: 2px solid #000;
        margin-bottom: 28px;
        flex-wrap: wrap;
      }
      .cg-admin-tab {
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 12px 24px;
        cursor: pointer;
        color: #000;
        background: #fff;
        border: 2px solid transparent;
        border-bottom: none;
        margin-bottom: -2px;
        transition: background 0.1s ease;
      }
      .cg-admin-tab.active { background: #000; color: #fff; border: 2px solid #000; border-bottom: none; }
      
      .cg-admin-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }

      /* rows */
      .cg-admin-user-row { grid-template-columns: 1.2fr 1fr 100px 140px; }
      .cg-member-row, .cg-proj-row {
        display: grid;
        padding: 16px;
        align-items: center;
        border: 2px solid #000;
        margin-bottom: 10px;
        background: #fff;
        box-shadow: 4px 4px 0px #000;
        gap: 8px;
        cursor: pointer;
      }
      .cg-member-row:hover, .cg-proj-row:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #000; }
      .cg-member-detail {
        padding: 16px;
        border: 2px solid #000;
        border-top: none;
        background: #f0f0f0;
        margin-top: -10px;
        margin-bottom: 10px;
        box-shadow: 4px 4px 0px #000;
      }
      .cg-proj-row { grid-template-columns: 1fr 90px 110px; }

      .cg-submission-actions, .cg-member-actions, .cg-proj-actions { display: flex; gap: 10px; flex-wrap: wrap; }

      /* modal */
      .cg-form-grid-2 { display: grid; grid-template-columns: 1fr 130px; gap: 14px; }
      .cg-modal-overlay {
        position: fixed; inset: 0; z-index: 999999;
        background: rgba(0, 0, 0, 0.5);
        display: flex; align-items: center; justify-content: center;
        padding: 20px; overflow-y: auto;
      }
      .cg-modal {
        background: #fff;
        border: 4px solid #000;
        padding: 32px;
        width: 100%; max-width: 540px;
        position: relative;
        box-shadow: 12px 12px 0px #000;
        margin: auto; max-height: calc(100vh - 40px); overflow-y: auto;
      }
      .cg-modal-actions { display: flex; gap: 12px; margin-top: 24px; }
      .cg-modal-close {
        position: absolute; top: -16px; right: -16px;
        background: #fff; border: 2px solid #000; box-shadow: 4px 4px 0px #000;
        color: #000; font-size: 20px; font-weight: 700;
        cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
      }
      .cg-modal-close:hover { background: #e5e5e5; }

      /* badges */
      .cg-badge {
        display: inline-flex; align-items: center;
        font-size: 10px; font-weight: 800; padding: 4px 8px;
        text-transform: uppercase; white-space: nowrap;
        border: 2px solid #000; background: #fff; color: #000;
      }
      .cg-badge-admin { background: #d4d4d4; }
      .cg-badge-super { background: #000; color: #fff; }

      /* submission card */
      .cg-submission-card {
        border: 2px solid #000; background: #fff; padding: 20px; margin-bottom: 16px;
        box-shadow: 4px 4px 0px #000;
      }
      .cg-submission-card.approved { background: #e5e5e5; }
      .cg-submission-card.rejected { background: #f9f9f9; opacity: 0.8; text-decoration: line-through; }

      /* stat cards */
      .cg-stat-card {
        background: #fff; border: 2px solid #000; padding: 24px;
        box-shadow: 6px 6px 0px #000;
      }
      .cg-stat-card-value { font-size: 40px; font-weight: 800; color: #000; margin: 8px 0 4px; line-height: 1; }
      .cg-stat-card-sub { font-size: 14px; font-weight: 700; color: #444; text-transform: uppercase; }

      .cg-empty { text-align: center; padding: 64px 24px; color: #000; font-size: 16px; font-weight: 700; border: 2px dashed #000; margin: 20px 0; }
      .cg-empty-glyph { font-size: 48px; margin-bottom: 16px; }

      .cg-form-row { margin-bottom: 20px; }
      .cg-form-row .cg-label { display: block; margin-bottom: 8px; }

      /* Logo styles */
      .cg-logo-hero {
        font-family: 'Space Grotesk', sans-serif;
        font-size: clamp(64px, 12vw, 120px);
        font-weight: 800;
        color: #000;
        letter-spacing: -0.04em;
        line-height: 1;
        user-select: none;
      }
      .cg-logo-nav {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 28px;
        font-weight: 800;
        color: #000;
        letter-spacing: -0.02em;
        line-height: 1;
        user-select: none;
        white-space: nowrap;
      }

      /* Hero Layout for Landing */
      .landing-hero {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        max-width: 900px;
        margin: 0 auto;
        padding: 40px;
        width: 100%;
        gap: 32px;
      }
      .landing-hero h1 {
        font-size: clamp(48px, 10vw, 96px);
        font-weight: 800;
        line-height: 1.1;
        margin: 0;
        color: #000;
        letter-spacing: -0.02em;
      }
      .landing-hero p {
        font-size: clamp(16px, 3vw, 24px);
        font-weight: 500;
        max-width: 600px;
        margin: 0;
        color: #000;
      }
      .landing-hero-graphics {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 40px;
      }
      .pixel-pc {
        width: 240px;
        height: 200px;
        border: 4px solid #000;
        background: #e0e0e0;
        box-shadow: 12px 12px 0px #000;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
        border-radius: 4px;
      }
      .pixel-pc-screen {
        width: 100%;
        height: 120px;
        background: #000;
        border: 4px solid #000;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
        display: flex;
        padding: 12px;
      }
      .pixel-pc-text {
        color: #39ff14;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 800;
        font-size: 16px;
        animation: blink 1s step-end infinite;
      }
      .pixel-pc-drive {
        width: 80px;
        height: 8px;
        background: #000;
        margin-top: 20px;
        align-self: flex-end;
        margin-right: 20px;
      }
      .pixel-pc-drive-btn {
        width: 8px;
        height: 8px;
        background: #000;
        position: absolute;
        bottom: 24px;
        right: 16px;
      }
      .pixel-pc-enter-btn {
        background: transparent;
        border: none;
        color: #39ff14;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 800;
        font-size: 16px;
        cursor: pointer;
        outline: none;
        text-align: center;
        padding: 0;
        margin-top: auto;
      }
      .pixel-pc-enter-btn:hover {
        color: #fff;
        text-shadow: 0 0 5px #39ff14;
      }
      @keyframes blink {
        50% { opacity: 0; }
      }

      /* PC Peripherals */
      .pixel-pc-setup {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
      .pixel-pc-peripherals {
        display: flex;
        align-items: flex-end;
        gap: 20px;
      }
      .pixel-pc-keyboard {
        width: 180px;
        height: 48px;
        background: #e0e0e0;
        border: 4px solid #000;
        box-shadow: 6px 6px 0px #000;
        border-radius: 4px;
        position: relative;
        background-image: 
          repeating-linear-gradient(90deg, transparent, transparent 12px, #000 12px, #000 16px),
          repeating-linear-gradient(0deg, transparent, transparent 12px, #000 12px, #000 16px);
        background-position: 0 0;
        background-size: 100% 100%;
      }
      .pixel-pc-mouse {
        width: 32px;
        height: 48px;
        background: #e0e0e0;
        border: 4px solid #000;
        box-shadow: 4px 4px 0px #000;
        border-radius: 12px;
        position: relative;
      }
      .pixel-pc-mouse::before {
        content: "";
        position: absolute;
        top: 0;
        left: 50%;
        width: 4px;
        height: 16px;
        background: #000;
        transform: translateX(-50%);
      }

      .quick-links-bar {
        display: flex;
        width: 100%;
        border: 2px solid #000;
        background: #d4d4d4;
        box-shadow: 6px 6px 0px #000;
        margin-top: 60px;
      }
      .quick-link-item {
        flex: 1;
        padding: 16px 24px;
        border-right: 2px solid #000;
        font-weight: 700;
        font-size: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-transform: uppercase;
        cursor: pointer;
        transition: background 0.1s ease;
      }
      .quick-link-item:hover { background: #e5e5e5; }
      .quick-link-item:last-child { border-right: none; }
      .arrow-up-right::after { content: '↗'; font-size: 24px; }

      @media (max-width: 768px) {
        .landing-hero { padding: 20px; }
        .quick-links-bar { flex-direction: column; }
        .quick-link-item { border-right: none; border-bottom: 2px solid #000; }
        .quick-link-item:last-child { border-bottom: none; }
        .landing-hero-graphics { justify-content: center; }
      }

      /* Brutalist Marquee */
      .cg-marquee-container {
        width: 100%;
        overflow: hidden;
        border-top: 2px solid #000;
        border-bottom: 2px solid #000;
        background: #000;
        color: #fff;
        padding: 8px 0;
        margin-bottom: 32px;
        display: flex;
        align-items: center;
      }
      .cg-marquee {
        white-space: nowrap;
        animation: cgMarquee 15s linear infinite;
        font-weight: 800;
        font-size: 16px;
        letter-spacing: 0.1em;
      }
      @keyframes cgMarquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      /* Brutalist Stickers */
      .cg-sticker {
        position: absolute;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        font-weight: 800;
        background: #fff;
        color: #000;
        border: 2px solid #000;
        padding: 4px 12px;
        box-shadow: 4px 4px 0px #000;
        transform: rotate(-10deg);
        z-index: 10;
        text-transform: uppercase;
      }
      .cg-sticker-star {
        position: absolute;
        width: 48px;
        height: 48px;
        background: #000;
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        z-index: 5;
      }
    `}</style>
  );
}