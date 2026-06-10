'use strict';

const Health = [
  {
    name: 'Turmeric',
    scientific_name: 'Curcuma longa',
    category: 'Anti-inflammatory',
    image_url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=4Y8WNXQ5Ixo',
    description: 'Turmeric is a bright yellow spice derived from the root of Curcuma longa. The active compound curcumin is responsible for most of its medicinal properties including powerful anti-inflammatory and antioxidant effects.',
    uses: 'Anti-inflammatory, antioxidant, brain Health, heart Health, arthritis relief, digestive support',
    preparation_method: 'Golden milk (1 tsp turmeric in warm milk), capsules 500-2000mg/day, or topical paste with coconut oil. Always combine with black pepper for better absorption.',
    precautions: 'May interact with blood thinners. Avoid high doses during pregnancy. May cause GI upset in large amounts.',
  },
  {
    name: 'Ginger',
    scientific_name: 'Zingiber officinale',
    category: 'Digestive',
    image_url: 'https://images.unsplash.com/photo-1573414405524-df2e0f9b7b5a?w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=7d5li4GGiSM',
    description: 'Ginger is a flowering plant whose rhizome is widely used as a spice and folk medicine. It contains gingerol, the main bioactive compound responsible for its anti-nausea and anti-inflammatory properties.',
    uses: 'Nausea relief, morning sickness, muscle pain, anti-inflammatory, blood sugar control, menstrual pain, indigestion',
    preparation_method: 'Fresh ginger tea: steep 1-2 tsp grated ginger in hot water for 10 minutes. Add honey and lemon. Also available as capsules, powder, or juice.',
    precautions: 'May interact with blood thinners and diabetes medications. Large amounts may cause heartburn. Consult doctor if pregnant.',
  },
  {
    name: 'Echinacea',
    scientific_name: 'Echinacea purpurea',
    category: 'Immune Support',
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    video_url: '',
    description: 'Echinacea is a group of flowering plants in the daisy family. It is one of the most popular herbal supplements worldwide, known for its immune-boosting properties and ability to reduce cold duration.',
    uses: 'Immune support, cold prevention, upper respiratory infections, wound healing, anti-viral properties',
    preparation_method: 'Available as teas, tinctures, tablets, and capsules. Best taken at the onset of cold symptoms. Typical dose: 300-500mg three times daily.',
    precautions: 'Not recommended for autoimmune disorders. May cause allergic reactions in those sensitive to daisy family plants. Do not use for more than 8 weeks continuously.',
  },
  {
    name: 'Lavender',
    scientific_name: 'Lavandula angustifolia',
    category: 'Nervine',
    image_url: 'https://images.unsplash.com/photo-1499578124509-1611b77778c8?w=800&q=80',
    video_url: '',
    description: 'Lavender is an aromatic flowering plant native to the Mediterranean region. Its essential oil is one of the most widely used in aromatherapy for its calming and relaxing properties.',
    uses: 'Anxiety relief, sleep aid, stress reduction, mild pain relief, headache treatment, skin healing',
    preparation_method: 'Aromatherapy: diffuse 3-5 drops of essential oil. Tea: steep 1-2 tsp dried flowers in hot water. Topical: dilute essential oil in carrier oil before applying to skin.',
    precautions: 'Do not ingest essential oil in large amounts. May cause skin irritation in some individuals. Avoid during first trimester of pregnancy.',
  },
  {
    name: 'Aloe Vera',
    scientific_name: 'Aloe barbadensis miller',
    category: 'Topical',
    image_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&q=80',
    video_url: '',
    description: 'Aloe vera is a succulent plant used for thousands of years for its healing properties. The gel inside its leaves contains vitamins, minerals, amino acids, and antioxidants that promote skin healing.',
    uses: 'Burn relief, skin healing, sunburn treatment, wound care, digestive Health, constipation relief, moisturizing',
    preparation_method: 'Cut a leaf and apply the clear gel directly to skin. For internal use, drink 1-2 oz of aloe juice daily. Commercial gels and creams are also available.',
    precautions: 'Oral use of aloe latex can cause serious kidney problems. Topical use is generally safe. Avoid oral use during pregnancy. May lower blood sugar levels.',
  },
  {
    name: 'Chamomile',
    scientific_name: 'Matricaria chamomilla',
    category: 'Nervine',
    image_url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&q=80',
    video_url: '',
    description: 'Chamomile is one of the most ancient medicinal herbs known to mankind. Used for centuries as an anti-inflammatory, antioxidant, and mild astringent, it is most commonly consumed as a calming tea.',
    uses: 'Sleep aid, anxiety relief, digestive relief, anti-inflammatory, skin conditions, menstrual cramps',
    preparation_method: 'Tea: steep 1-2 tsp dried flowers in hot water for 5-10 minutes. Drink 1-4 cups daily. Also available as tinctures, capsules, and topical creams.',
    precautions: 'May cause allergic reactions in people sensitive to ragweed. May interact with blood thinners and sedative medications. Avoid during pregnancy in large amounts.',
  },
  {
    name: 'Garlic',
    scientific_name: 'Allium sativum',
    category: 'Cardiovascular',
    image_url: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&q=80',
    video_url: '',
    description: 'Garlic has been used as both food and medicine for over 5,000 years. It contains allicin, a sulfur compound formed when garlic is crushed or chopped, which is responsible for its distinctive smell and Health benefits.',
    uses: 'Cardiovascular Health, blood pressure reduction, cholesterol lowering, antimicrobial, immune support, anti-cancer properties',
    preparation_method: 'Consume 1-2 raw cloves daily for maximum benefit. Can also be taken as aged garlic extract capsules (600-1200mg/day). Crush and let sit 10 minutes before cooking to preserve allicin.',
    precautions: 'May interact with blood thinners and HIV medications. Can cause bad breath and body odor. May cause digestive upset. Avoid large amounts before surgery.',
  },
  {
    name: 'Peppermint',
    scientific_name: 'Mentha piperita',
    category: 'Digestive',
    image_url: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=800&q=80',
    video_url: '',
    description: 'Peppermint is a hybrid mint plant widely used in both culinary and medicinal applications. Its active ingredient menthol provides a cooling sensation and has proven therapeutic effects on digestion and pain.',
    uses: 'IBS relief, indigestion, nausea, headache relief, muscle pain, respiratory congestion, bad breath',
    preparation_method: 'Tea: steep 1 tsp dried leaves in hot water for 10 minutes. For IBS: enteric-coated capsules (187mg). Topical: diluted peppermint oil for headaches and muscle pain.',
    precautions: 'Do not apply near face of infants. May worsen acid reflux. Peppermint oil should be diluted before topical use. Avoid if you have GERD.',
  },
  {
    name: 'Moringa',
    scientific_name: 'Moringa oleifera',
    category: 'Immune Support',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=HohV7K7XZQQ',
    description: 'Moringa, known as the "miracle tree," is native to Africa and Asia. Every part of the tree is edible and packed with nutrients. It contains more vitamin C than oranges, more calcium than milk, and more iron than spinach.',
    uses: 'Nutritional supplement, blood sugar control, anti-inflammatory, antioxidant, energy boost, lactation support, wound healing',
    preparation_method: 'Moringa powder: add 1-2 tsp to smoothies, soups, or tea daily. Fresh leaves can be cooked like spinach. Capsules: 500mg twice daily.',
    precautions: 'Avoid root and root extracts during pregnancy (may cause miscarriage). May lower blood pressure and blood sugar. Start with small doses to assess tolerance.',
  },
  {
    name: 'Neem',
    scientific_name: 'Azadirachta indica',
    category: 'Topical',
    image_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80',
    video_url: '',
    description: 'Neem is a tree native to the Indian subcontinent and has been used in Ayurvedic medicine for over 4,000 years. Known as the "village pharmacy," virtually every part of the neem tree has medicinal value.',
    uses: 'Skin conditions (acne, eczema, psoriasis), dental Health, anti-parasitic, anti-fungal, anti-bacterial, blood purification',
    preparation_method: 'Neem oil: dilute with carrier oil (1:10 ratio) for topical use. Neem powder: 1/4 tsp in warm water daily. Neem toothpaste or chewing neem twigs for dental Health.',
    precautions: 'Do not use neem oil internally. Toxic to children in large amounts. Avoid during pregnancy and breastfeeding. May cause liver damage with excessive use.',
  },
  {
    name: 'Hibiscus',
    scientific_name: 'Hibiscus sabdariffa',
    category: 'Cardiovascular',
    image_url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=800&q=80',
    video_url: '',
    description: 'Hibiscus is a flowering plant widely used in traditional medicine across Africa, Asia, and the Caribbean. The dried calyces are used to make a tart, cranberry-like tea rich in antioxidants.',
    uses: 'Blood pressure reduction, cholesterol management, liver Health, weight management, antioxidant, anti-inflammatory, fever reduction',
    preparation_method: 'Hibiscus tea: steep 1-2 tsp dried calyces in hot water for 5-10 minutes. Drink 2-3 cups daily. Can be served hot or cold. Add honey or ginger for taste.',
    precautions: 'May lower blood pressure significantly — monitor if on BP medication. May interact with acetaminophen. Avoid during pregnancy. May affect estrogen levels.',
  },
  {
    name: 'Valerian Root',
    scientific_name: 'Valeriana officinalis',
    category: 'Nervine',
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    video_url: '',
    description: 'Valerian is a perennial flowering plant native to Europe and Asia. Its root has been used as a medicinal herb since ancient Greek and Roman times, primarily as a sleep aid and anxiety reliever.',
    uses: 'Insomnia, anxiety, stress relief, menopausal symptoms, restless leg syndrome, ADHD',
    preparation_method: 'Capsules: 300-600mg taken 30 minutes to 2 hours before bedtime. Tea: steep 1 tsp dried root in hot water for 10-15 minutes. Tincture: 1/2 tsp in water before bed.',
    precautions: 'May cause drowsiness — do not drive after use. Do not combine with alcohol or sedatives. Not recommended during pregnancy. May cause vivid dreams.',
  },
];

const newsPosts = [
  {
    title: 'The Healing Power of African Herbal Medicine',
    category: 'Traditional Medicine',
    cover_image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80',
    video_url: 'https://www.youtube.com/watch?v=mGa7xhCS_8E',
    content: 'Africa has one of the richest traditions of herbal medicine in the world. For thousands of years, traditional healers have used plants to treat everything from malaria to mental illness. Today, scientists are validating many of these ancient remedies through rigorous clinical research. Plants like Moringa, Neem, and Hibiscus are now recognized globally for their remarkable therapeutic properties. This article explores the growing intersection of traditional African medicine and modern science.',
  },
  {
    title: 'Top 10 Herbs to Boost Your Immune System Naturally',
    category: 'Health Tips',
    cover_image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80',
    video_url: 'https://www.youtube.com/watch?v=HohV7K7XZQQ',
    content: 'As cold and flu season approaches, many people are turning to herbal remedies to strengthen their immune defenses naturally. Herbs such as Echinacea, Elderberry, Astragalus, Garlic, and Ginger have all demonstrated immune-modulating properties in clinical studies. Incorporating these powerful plants into your daily routine may help reduce the frequency and severity of common illnesses. Learn how to use each herb safely and effectively for maximum immune support.',
  },
  {
    title: 'Moringa: The Miracle Tree That Could Change Your Health',
    category: 'Herbal Remedies',
    cover_image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
    video_url: '',
    content: 'Moringa oleifera, often called the "miracle tree," is one of the most nutrient-dense plants on Earth. Native to parts of Africa and Asia, this remarkable tree has been used in traditional medicine for centuries. Recent scientific research has confirmed what traditional healers have long known — moringa is packed with vitamins, minerals, and bioactive compounds that can dramatically improve Health outcomes. From fighting malnutrition to managing diabetes, moringa is proving to be one of nature\'s most powerful Health.',
  },
  {
    title: 'How Turmeric and Ginger Work Together for Better Health',
    category: 'Research',
    cover_image_url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=1200&q=80',
    video_url: 'https://www.youtube.com/watch?v=4Y8WNXQ5Ixo',
    content: 'Two of the most studied medicinal spices — turmeric and ginger — have been used together in traditional medicine for centuries. Modern research is now revealing why this combination is so powerful. Both contain potent anti-inflammatory compounds (curcumin in turmeric, gingerol in ginger) that work synergistically to reduce inflammation, boost immunity, and support digestive Health. This article examines the science behind this powerful herbal duo and how to incorporate them into your daily routine.',
  },
  {
    title: 'Growing Your Own Medicinal Herb Garden: A Beginner\'s Guide',
    category: 'Wellness',
    cover_image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
    video_url: '',
    content: 'Growing your own medicinal herbs is one of the most rewarding things you can do for your Health and wellbeing. Many powerful medicinal herbs — lavender, chamomile, peppermint, and lemon balm — thrive in home gardens and even in containers on a balcony or windowsill. With a little planning and care, you can cultivate a diverse apothecary garden that supports your family\'s Health year-round. This beginner\'s guide covers everything you need to know to get started, from soil preparation to harvesting and drying your herbs.',
  },
  {
    title: 'The Science Behind Herbal Medicine: What Research Says',
    category: 'Research',
    cover_image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&q=80',
    video_url: '',
    content: 'A growing number of peer-reviewed studies are confirming what traditional healers have known for generations — that many herbal remedies have genuine therapeutic value. Researchers at leading universities have published findings supporting the use of turmeric for inflammation, valerian root for sleep disorders, and St. John\'s Wort for mild depression. These scientific validations are helping to bridge the gap between traditional knowledge and modern evidence-based medicine, opening new possibilities for integrative Healthcare.',
  },
];

async function run(pool) {
  console.log('Seeding rich sample Health...');
  for (const m of Health) {
    await pool.execute(
      `INSERT IGNORE INTO Health
        (name, scientific_name, category, image_url, video_url, description, uses,
         preparation_method, precautions, status, submitted_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NULL)`,
      [
        m.name, m.scientific_name, m.category,
        m.image_url, m.video_url || null,
        m.description, m.uses,
        m.preparation_method, m.precautions,
      ]
    );
  }
  console.log(`  Seeded ${Health.length} Health`);

  console.log('Seeding rich sample news posts...');
  for (const p of newsPosts) {
    await pool.execute(
      `INSERT IGNORE INTO news_posts
        (title, category, cover_image_url, video_url, content, status, author_id)
       VALUES (?, ?, ?, ?, ?, 'published', NULL)`,
      [
        p.title, p.category,
        p.cover_image_url || null,
        p.video_url || null,
        p.content,
      ]
    );
  }
  console.log(`  Seeded ${newsPosts.length} news posts`);
}

module.exports = { run };
