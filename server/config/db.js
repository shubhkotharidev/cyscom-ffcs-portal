const { Pool } = require('pg');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FATAL: DATABASE_URL is not set in environment variables. Server cannot start.');
  process.exit(1);
}

const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

const pool = new Pool({
  connectionString,
  ssl: isLocalhost
    ? false
    : { rejectUnauthorized: true }, // Enforce valid TLS certificate for cloud DBs
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected database error on idle client:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};

