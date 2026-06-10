async function down(pool) {
  await pool.query('DROP TABLE IF EXISTS news_posts');
  await pool.query('DROP TABLE IF EXISTS Health');
  await pool.query('DROP TABLE IF EXISTS users');
}

module.exports = { down };
