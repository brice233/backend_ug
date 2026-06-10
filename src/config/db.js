'use strict';

require('dotenv').config();

// Switch logic:
// - If DATABASE_URL is set → use PostgreSQL
// - Otherwise              → use MySQL with individual DB_* vars
const usePostgres = !!process.env.DATABASE_URL;

// ─── PostgreSQL (via DATABASE_URL) ───────────────────────────────────────────
if (usePostgres) {
  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required for hosted Postgres (Supabase, Prisma, Railway, etc.)
    max: 10,
  });

  // Verify connectivity on startup
  pool.connect((err, _client, release) => {
    if (err) {
      console.error(`[DB] PostgreSQL connection failed: ${err.message}`);
      process.exit(1);
    }
    release();
    console.log('[DB] Connected to PostgreSQL via DATABASE_URL');
  });

  // Adapter: converts MySQL-style ? placeholders → PostgreSQL $1, $2, ...
  // so all existing models work without changes.
  const _originalQuery = pool.query.bind(pool);
  pool.query = async function (sql, params = []) {
    let i = 0;
    const pgSql = sql.replace(/\?/g, () => `$${++i}`);
    try {
      const result = await _originalQuery(pgSql, params);
      // Mimic mysql2's [rows, fields] return shape
      return [result.rows, result.fields ?? []];
    } catch (err) {
      console.error(`[DB] Query failed: ${pgSql}`);
      console.error(`[DB] Params: ${JSON.stringify(params)}`);
      console.error(`[DB] Error: ${err.message}`);
      throw err;
    }
  };

  module.exports = pool;

// ─── MySQL (default, uses DB_HOST / DB_USER / etc.) ──────────────────────────
} else {
  const mysql = require('mysql2/promise');

  const pool = mysql.createPool({
    host:               process.env.DB_HOST,
    port:               parseInt(process.env.DB_PORT || '3306', 10),
    user:               process.env.DB_USER,
    password:           process.env.DB_PASSWORD,
    database:           process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
  });

  // Verify connectivity on startup
  (async () => {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log(`[DB] Connected to MySQL database: ${process.env.DB_NAME}`);
    } catch (err) {
      console.error(`[DB] MySQL connection failed: ${err.message}`);
      process.exit(1);
    } finally {
      if (connection) connection.release();
    }
  })();

  pool.on('connection', (connection) => {
    connection.on('error', (err) => {
      if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
        console.warn('[DB] Connection lost. Attempting to reconnect...');
      }
    });
  });

  module.exports = pool;
}
