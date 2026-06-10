async function up(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Health (
      id                  INT          NOT NULL AUTO_INCREMENT,
      name                VARCHAR(255) NOT NULL,
      description         TEXT         NOT NULL,
      uses                TEXT         NOT NULL,
      category            VARCHAR(100) NOT NULL,
      scientific_name     VARCHAR(255),
      preparation_method  TEXT,
      precautions         TEXT,
      status              ENUM('pending', 'published', 'rejected') NOT NULL DEFAULT 'pending',
      submitted_by        INT,
      moderated_by        INT,
      moderated_at        DATETIME,
      created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_Health_submitted_by FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_Health_moderated_by FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
}

module.exports = { up };
