const newsPosts = [
  {
    title: 'The Rise of Herbal Medicine in Modern Healthcare',
    content: 'Herbal medicine is experiencing a remarkable resurgence as patients and practitioners alike seek more holistic approaches to Health and wellness. Hospitals and clinics around the world are increasingly integrating evidence-based herbal therapies alongside conventional treatments. This shift reflects a growing body of research validating the efficacy of plant-based remedies that have been used for centuries.',
    category: 'Health Trends',
  },
  {
    title: 'Top 5 Herbs for Boosting Your Immune System',
    content: 'As cold and flu season approaches, many people are turning to herbal remedies to strengthen their immune defenses naturally. Herbs such as echinacea, elderberry, astragalus, garlic, and ginger have all demonstrated immune-modulating properties in clinical studies. Incorporating these powerful plants into your daily routine may help reduce the frequency and severity of common illnesses.',
    category: 'Wellness',
  },
  {
    title: "Understanding Adaptogens: Nature's Stress Relievers",
    content: "Adaptogens are a unique class of herbal plants that help the body resist physical, chemical, and biological stressors. Unlike conventional medications, adaptogens work by normalizing physiological functions and supporting the body's natural stress response systems. Popular adaptogens like ashwagandha, rhodiola, and holy basil are gaining mainstream recognition for their ability to promote resilience and mental clarity.",
    category: 'Education',
  },
  {
    title: 'How to Grow Your Own Medicinal Herb Garden',
    content: 'Growing your own medicinal herbs is a rewarding way to connect with nature while ensuring a fresh supply of healing plants right at your doorstep. Many powerful medicinal herbs such as lavender, chamomile, peppermint, and lemon balm thrive in home gardens and even in containers on a balcony or windowsill. With a little planning and care, you can cultivate a diverse apothecary garden that supports your family\'s Health year-round.',
    category: 'Lifestyle',
  },
  {
    title: 'Scientific Research Validates Traditional Herbal Remedies',
    content: 'A growing number of peer-reviewed studies are confirming what traditional healers have known for generations — that many herbal remedies have genuine therapeutic value. Researchers at leading universities have published findings supporting the use of turmeric for inflammation, valerian root for sleep disorders, and St. John\'s Wort for mild depression. These scientific validations are helping to bridge the gap between traditional knowledge and modern evidence-based medicine.',
    category: 'Research',
  },
];

async function run(pool) {
  for (const post of newsPosts) {
    await pool.execute(
      `INSERT IGNORE INTO news_posts
        (title, content, category, cover_image_url, status, author_id)
       VALUES (?, ?, ?, NULL, 'published', NULL)`,
      [post.title, post.content, post.category]
    );
  }
}

module.exports = { run };
