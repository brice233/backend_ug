'use strict';

const pool = require('../config/db');

/**
 * Create a new question record. Status is always set to 'pending' by DB default.
 */
async function create({ visitor_name, visitor_email, question_text }) {
  const [result] = await pool.query(
    'INSERT INTO questions (visitor_name, visitor_email, question_text) VALUES (?, ?, ?)',
    [visitor_name, visitor_email, question_text]
  );
  const [rows] = await pool.query('SELECT * FROM questions WHERE id = ?', [result.insertId]);
  return rows[0] || null;
}

/**
 * Find all questions with pagination, optional status filter, ordered by submitted_at DESC.
 */
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

  return { rows, total };
}

/**
 * Find a single question by ID.
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM questions WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Update the status of a question.
 */
async function setStatus(id, status) {
  const answeredAt = status === 'answered' ? new Date() : null;
  await pool.query(
    'UPDATE questions SET status = ?, answered_at = ? WHERE id = ?',
    [status, answeredAt, id]
  );
  return findById(id);
}

/**
 * Save a reply to a question and mark it as answered.
 */
async function saveReply(id, reply_text) {
  await pool.query(
    'UPDATE questions SET reply_text = ?, status = ?, answered_at = ? WHERE id = ?',
    [reply_text, 'answered', new Date(), id]
  );
  return findById(id);
}

module.exports = { create, findAll, findById, setStatus, saveReply };
