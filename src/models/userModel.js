'use strict';

const pool = require('../config/db');

/**
 * Find all users with pagination.
 * @param {{ page?: number, limit?: number }} options
 * @returns {Promise<{ rows: object[], total: number }>}
 */
async function findAll({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    'SELECT id, name, email, role, created_at, updated_at FROM users LIMIT ? OFFSET ?',
    [limit, offset]
  );

  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM users');

  return { rows, total };
}

/**
 * Find a user by ID (excludes password).
 * @param {number} id
 * @returns {Promise<object|null>}
 */
async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * Find a user by email (includes password for auth).
 * @param {string} email
 * @returns {Promise<object|null>}
 */
async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

/**
 * Create a new user.
 * @param {{ name: string, email: string, password: string, role?: string }} data
 * @returns {Promise<object>}
 */
'use strict';

const pool = require('../config/db');

const isPostgres = !!process.env.DATABASE_URL;

async function create({ name, email, password, role = 'user' }) {
  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  const values = [name, email, password, role];

  if (isPostgres) {
    const [rows] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING id',
      values
    );
    return findById(rows[0].id);
  } else {
    const [result] = await pool.query(sql, values);
    return findById(result.insertId);
  }
}

/**
 * Update a user's role.
 * @param {number} id
 * @param {string} role
 * @returns {Promise<object|null>}
 */
async function updateRole(id, role) {
  await pool.query('UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?', [role, id]);
  return findById(id);
}

/**
 * Delete a user by ID.
 * @param {number} id
 * @returns {Promise<{ affectedRows: number }>}
 */
async function deleteById(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return { affectedRows: result.affectedRows };
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  updateRole,
  deleteById,
};
