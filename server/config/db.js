const { Pool } = require('pg');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FATAL: DATABASE_URL is not set in environment variables. Server cannot start.');
  process.exit(1);
}

const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

// On Vercel serverless, each function instance is a separate process.
// Keep pool size small per-instance (2-3) so we don't exhaust Neon's
// connection limit across many concurrent instances.
// Neon free tier allows ~100 connections total.
// With up to 10 Vercel instances × 3 connections = 30 max — safe headroom.
const pool = new Pool({
  connectionString,
  ssl: isLocalhost
    ? false
    : { rejectUnauthorized: true },
  max: 3,                        // Per-instance pool size (serverless-safe)
  idleTimeoutMillis: 10000,      // Release idle connections faster (was 30s)
  connectionTimeoutMillis: 5000, // Fail fast if DB is unreachable (was 10s)
});

pool.on('error', (err) => {
  console.error('Unexpected database error on idle client:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
