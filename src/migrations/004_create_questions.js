async function up(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id            INT          NOT NULL AUTO_INCREMENT,
      visitor_name  VARCHAR(255) NOT NULL,
      visitor_email VARCHAR(255) NOT NULL,
      question_text TEXT         NOT NULL,
      status        ENUM('pending', 'answered') NOT NULL DEFAULT 'pending',
      submitted_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_questions_submitted_at (submitted_at DESC)
    )
  `);
}

module.exports = { up };
