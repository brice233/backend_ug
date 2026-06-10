'use strict';

const pool = require('../config/db');

const isPostgres = !!process.env.DATABASE_URL;

async function findAll({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    'SELECT id, name, email, role, created_at, updated_at FROM users LIMIT ? OFFSET ?',
    [limit, offset]
  );
  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM users');
  return { rows, total: parseInt(total, 10) };
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function create({ name, email, password, role = 'user' }) {
  const values = [name, email, password, role];

  if (isPostgres) {
    const [rows] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING id',
      values
    );
    return findById(rows[0].id);
  } else {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      values
    );
    return findById(result.insertId);
  }
}

async function updateRole(id, role) {
  await pool.query('UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?', [role, id]);
  return findById(id);
}

async function deleteById(id) {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return { affectedRows: 1 };
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  updateRole,
  deleteById,
};
