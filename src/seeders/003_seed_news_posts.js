'use strict';

const isPostgres = !!process.env.DATABASE_URL;

const newsPosts = [
  {
    title: 'The Rise of Herbal Medicine in Modern Healthcare',
    content: 'Herbal medicine is experiencing a remarkable resurgence as patients and practitioners seek holistic approaches to health. Hospitals worldwide are integrating evidence-based herbal therapies alongside conventional treatments.',
    category: 'Health Trends',
  },
  {
    title: 'Top 5 Herbs for Boosting Your Immune System',
    content: 'As cold and flu season approaches, many people turn to herbal remedies. Herbs such as echinacea, elderberry, astragalus, garlic, and ginger have demonstrated immune-modulating properties in clinical studies.',
    category: 'Wellness',
  },
  {
    title: "Understanding Adaptogens: Nature's Stress Relievers",
    content: "Adaptogens are herbal plants that help the body resist physical and biological stressors. Popular adaptogens like ashwagandha, rhodiola, and holy basil promote resilience and mental clarity.",
    category: 'Education',
  },
  {
    title: 'How to Grow Your Own Medicinal Herb Garden',
    content: "Growing medicinal herbs is rewarding and accessible. Lavender, chamomile, peppermint, and lemon balm thrive in home gardens and containers, providing a fresh supply of healing plants year-round.",
    category: 'Lifestyle',
  },
  {
    title: 'Scientific Research Validates Traditional Herbal Remedies',
    content: "Studies confirm what traditional healers have known for generations. Turmeric for inflammation, valerian root for sleep, and St. John's Wort for mild depression are now supported by peer-reviewed research.",
    category: 'Research',
  },
];

async function run(pool) {
  for (const post of newsPosts) {
    if (isPostgres) {
      await pool.query(
        `INSERT INTO news_posts (title, content, category, cover_image_url, status, author_id)
         VALUES (?, ?, ?, NULL, 'published', NULL)
         ON CONFLICT DO NOTHING`,
        [post.title, post.content, post.category]
      );
    } else {
      await pool.query(
        `INSERT IGNORE INTO news_posts (title, content, category, cover_image_url, status, author_id)
         VALUES (?, ?, ?, NULL, 'published', NULL)`,
        [post.title, post.content, post.category]
      );
    }
  }
  console.log(`✓ Seeded ${newsPosts.length} news posts`);
}

module.exports = { run };
