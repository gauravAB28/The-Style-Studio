const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FATAL: DATABASE_URL environment variable is missing.');
  process.exit(1);
}

// Supabase SSL Configuration:
// Supabase pooler requires SSL. Using { rejectUnauthorized: false } allows connecting to
// the pooled/direct endpoint across various platforms without requiring a local CA bundle.
const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

const pool = new Pool({
  connectionString,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  end: () => pool.end(),
};

