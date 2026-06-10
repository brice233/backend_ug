async function up(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT          NOT NULL AUTO_INCREMENT,
      name        VARCHAR(100) NOT NULL,
      email       VARCHAR(255) NOT NULL,
      password    VARCHAR(255) NOT NULL,
      role        ENUM('admin', 'user') NOT NULL DEFAULT 'user',
      created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_users_email (email)
    )
  `);
}

module.exports = { up };
