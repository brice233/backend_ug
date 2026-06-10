async function up(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS news_posts (
      id               INT          NOT NULL AUTO_INCREMENT,
      title            VARCHAR(255) NOT NULL,
      content          LONGTEXT     NOT NULL,
      category         VARCHAR(100) NOT NULL,
      cover_image_url  VARCHAR(500),
      status           ENUM('pending', 'published', 'rejected') NOT NULL DEFAULT 'pending',
      author_id        INT,
      moderated_by     INT,
      moderated_at     DATETIME,
      created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_news_author_id    FOREIGN KEY (author_id)    REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_news_moderated_by FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_news_posts_created_at (created_at DESC)
    )
  `);
}

module.exports = { up };
