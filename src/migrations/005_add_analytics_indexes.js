'use strict';

const isPostgres = !!process.env.DATABASE_URL;

async function up(pool) {
  const isDuplicate = (err) =>
    err.message.includes('Duplicate key name') ||
    err.message.includes('already exists');

  const indexes = [
    { sql: isPostgres ? 'CREATE INDEX IF NOT EXISTS idx_medicines_status ON medicines(status)' : 'CREATE INDEX idx_medicines_status ON medicines(status)' },
    { sql: isPostgres ? 'CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category)' : 'CREATE INDEX idx_medicines_category ON medicines(category)' },
    { sql: isPostgres ? 'CREATE INDEX IF NOT EXISTS idx_medicines_created_at ON medicines(created_at DESC)' : 'CREATE INDEX idx_medicines_created_at ON medicines(created_at DESC)' },
    { sql: isPostgres ? 'CREATE INDEX IF NOT EXISTS idx_news_posts_status ON news_posts(status)' : 'CREATE INDEX idx_news_posts_status ON news_posts(status)' },
    { sql: isPostgres ? 'CREATE INDEX IF NOT EXISTS idx_medicines_status_created_at ON medicines(status, created_at DESC)' : 'CREATE INDEX idx_medicines_status_created_at ON medicines(status, created_at DESC)' },
    { sql: isPostgres ? 'CREATE INDEX IF NOT EXISTS idx_news_posts_status_created_at ON news_posts(status, created_at DESC)' : 'CREATE INDEX idx_news_posts_status_created_at ON news_posts(status, created_at DESC)' },
  ];

  for (const idx of indexes) {
    try {
      await pool.query(idx.sql);
    } catch (err) {
      if (!isDuplicate(err)) throw err;
    }
  }

  console.log('✅ Analytics indexes created successfully');
}

module.exports = { up };
