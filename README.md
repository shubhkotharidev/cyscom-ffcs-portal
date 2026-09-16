# CIPHERGRID — VIT Club Portal (prototype)

A front-end React prototype for a club member portal: Google-domain-gated
login, department selection, seat-based project applications, a points
leaderboard, and an admin panel for awarding points.

## Requirements

- Node.js 18+ and npm (check with `node -v` and `npm -v`)

## Setup

```bash
npm install
```

## Run in development

```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`) — open it in
your browser.

## Build for production

```bash
npm run build
npm run preview   # serve the production build locally to sanity-check it
```

The build output goes to `dist/`, which you can deploy to any static host
(Vercel, Netlify, GitHub Pages, etc.).

## Important notes about this prototype

- **Data storage**: uses browser `localStorage`, so data is local to
  whichever browser you're using — it is NOT shared across different users
  or devices. For a real multi-user deployment you'll need a real backend
  (Firebase, Supabase, your own API + database, etc.).
- **"Sign in with Google" is simulated**: it only checks that the email
  matches the `@vitstudent.ac.in` pattern client-side. This is trivially
  bypassable. Before shipping, replace it with real Google OAuth (e.g.
  NextAuth.js or Firebase Auth) with the `hd` (hosted domain) parameter
  enforced **server-side**.
- **Admin role** is granted to any email in the `ADMIN_EMAILS` list in
  `src/App.jsx` — again, client-side only. Gate this server-side in
  production.
- **Seat counting** has no concurrency control — fine for a demo, but a
  real deployment should decrement seat counts in a database transaction
  to avoid race conditions when multiple people apply at once.

## Project structure

```
ciphergrid/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx      # React entry point
    └── App.jsx       # All app logic + UI (single-file prototype)
```
