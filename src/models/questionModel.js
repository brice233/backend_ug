'use strict';

const pool = require('../config/db');

const isPostgres = !!process.env.DATABASE_URL;

async function create({ visitor_name, visitor_email, question_text }) {
  const sql = 'INSERT INTO questions (visitor_name, visitor_email, question_text) VALUES (?, ?, ?)';
  const values = [visitor_name, visitor_email, question_text];

  if (isPostgres) {
    const [rows] = await pool.query(sql + ' RETURNING *', values);
    return rows[0] || null;
  } else {
    const [result] = await pool.query(sql, values);
    const [rows] = await pool.query('SELECT * FROM questions WHERE id = ?', [result.insertId]);
    return rows[0] || null;
  }
}

async function findAll({ page = 1, limit = 20, status } = {}) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];

  if (status) {
    conditions.push('status = ?');
    values.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT * FROM questions ${where} ORDER BY submitted_at DESC LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM questions ${where}`,
    values
  );

  return { rows, total: parseInt(total, 10) };
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM questions WHERE id = ?', [id]);
  return rows[0] || null;
}

async function setStatus(id, status) {
  await pool.query(
    'UPDATE questions SET status = ?, answered_at = NOW() WHERE id = ?',
    [status, id]
  );
  return findById(id);
}

async function saveReply(id, reply_text) {
  await pool.query(
    "UPDATE questions SET reply_text = ?, status = 'answered', answered_at = NOW() WHERE id = ?",
    [reply_text, id]
  );
  return findById(id);
}

module.exports = { create, findAll, findById, setStatus, saveReply };
