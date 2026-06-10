/**
 * Seed hero slides for homepage carousel
 */
async function run(pool) {
  console.log('Seeding hero slides...');

  const slides = [
    {
      title: 'DISCOVER HERBAL MEDICINE',
      subtitle: 'Natural remedies for modern wellness',
      primary_button_text: 'Shop Now',
      primary_button_link: '/Health',
      secondary_button_text: 'Learn More',
      secondary_button_link: '/about',
      media_type: 'image',
      media_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=80',
      display_order: 1,
      is_active: true,
    },
    {
      title: 'TRADITIONAL HEALING',
      subtitle: 'Ancient wisdom meets modern science',
      primary_button_text: 'Explore',
      primary_button_link: '/Health',
      secondary_button_text: 'Read More',
      secondary_button_link: '/news',
      media_type: 'image',
      media_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&q=80',
      display_order: 2,
      is_active: true,
    },
    {
      title: 'NATURAL WELLNESS',
      subtitle: 'Pure ingredients, powerful results',
      primary_button_text: 'Get Started',
      primary_button_link: '/Health',
      secondary_button_text: 'Ask a Doctor',
      secondary_button_link: '/ask-a-doctor',
      media_type: 'image',
      media_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1920&q=80',
      display_order: 3,
      is_active: true,
    },
  ];

  for (const slide of slides) {
    await pool.execute(
      `INSERT INTO hero_slides (
        title, subtitle, primary_button_text, primary_button_link,
        secondary_button_text, secondary_button_link, media_type,
        media_url, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slide.title,
        slide.subtitle,
        slide.primary_button_text,
        slide.primary_button_link,
        slide.secondary_button_text,
        slide.secondary_button_link,
        slide.media_type,
        slide.media_url,
        slide.display_order,
        slide.is_active,
      ]
    );
  }

  console.log(`✓ Seeded ${slides.length} hero slides`);
}

module.exports = { run };
