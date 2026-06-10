'use strict';

const pool = require('../config/db');

async function get(key) {
  const [rows] = await pool.query('SELECT value FROM settings WHERE key_name = ?', [key]);
  return rows[0]?.value ?? null;
}

async function set(key, value) {
  await pool.query(
    'INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?, updated_at = NOW()',
    [key, value, value]
  );
  return value;
}

async function getAll() {
  const [rows] = await pool.query('SELECT key_name, value FROM settings');
  return Object.fromEntries(rows.map((r) => [r.key_name, r.value]));
}

module.exports = { get, set, getAll };
