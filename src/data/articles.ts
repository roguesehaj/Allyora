export interface Article {
  id: string;
  title: string;
  category: 'Menstrual Health' | 'Sleep' | 'Fitness' | 'Nutrition';
  readTime: number;
  image: string;
  excerpt: string;
  content: string;
}

export const articles: Article[] = [
  {
    id: 'article_1',
    title: 'Understanding Your Menstrual Cycle Phases',
    category: 'Menstrual Health',
    readTime: 2,
    image: '🩸',
    excerpt: 'Learn about the four phases of your cycle and how they affect your body and mood.',
    content: `Your menstrual cycle has four distinct phases: menstruation, follicular phase, ovulation, and luteal phase. Understanding these phases can help you predict your symptoms and plan accordingly.

During menstruation (days 1-5), hormone levels are low, which can cause fatigue and cramps. The follicular phase (days 6-14) brings rising estrogen, boosting energy and mood. Ovulation (around day 14) is your fertile window. Finally, the luteal phase (days 15-28) may bring PMS symptoms as progesterone rises then falls.

Tracking these phases helps you understand your body better and manage symptoms proactively.`
  },
  {
    id: 'article_2',
    title: 'Natural Remedies for Period Cramps',
    category: 'Menstrual Health',
    readTime: 2,
    image: '🌿',
    excerpt: 'Discover natural ways to ease menstrual pain without medication.',
    content: `Period cramps affect most menstruating individuals. Here are evidence-based natural remedies:

1. Heat therapy: Apply a heating pad to your lower abdomen for 15-20 minutes
2. Gentle exercise: Yoga and walking release endorphins that reduce pain
3. Herbal teas: Ginger, chamomile, and peppermint can soothe cramps
4. Magnesium-rich foods: Dark chocolate, nuts, and leafy greens help muscle relaxation
5. Hydration: Drink plenty of water to reduce bloating

Remember, severe pain that disrupts daily life should be discussed with a healthcare provider.`
  },
  {
    id: 'article_3',
    title: 'Sleep and Your Cycle: What You Need to Know',
    category: 'Sleep',
    readTime: 2,
    image: '😴',
    excerpt: 'How hormonal changes throughout your cycle affect your sleep quality.',
    content: `Your menstrual cycle significantly impacts sleep quality. During the luteal phase (week before your period), rising progesterone can initially help sleep but its drop right before menstruation may cause insomnia.

During menstruation, pain and discomfort can disrupt sleep. Meanwhile, during the follicular phase, rising estrogen typically improves sleep quality.

Tips for better sleep during your cycle:
- Maintain a consistent sleep schedule
- Keep your bedroom cool (especially important during luteal phase)
- Avoid caffeine after 2 PM
- Practice relaxation techniques before bed
- Use a heating pad if cramps wake you up

Track your sleep patterns alongside your cycle to identify your personal patterns.`
  },
  {
    id: 'article_4',
    title: 'Cycle Syncing Your Workouts',
    category: 'Fitness',
    readTime: 2,
    image: '💪',
    excerpt: 'Optimize your exercise routine by working with your hormonal fluctuations.',
    content: `Cycle syncing means adjusting your workout intensity to match your hormonal phases:

Menstrual Phase (Days 1-5): Low energy is normal. Focus on gentle movement like walking, stretching, or light yoga.

Follicular Phase (Days 6-14): Rising energy! This is your power phase for high-intensity workouts, strength training, and trying new challenges.

Ovulation (Around Day 14): Peak energy and strength. Go for your personal records and intense cardio sessions.

Luteal Phase (Days 15-28): Energy gradually decreases. Shift to moderate intensity—Pilates, swimming, steady-state cardio.

Listen to your body above all. Some variation is normal, and it's okay to rest when needed.`
  },
  {
    id: 'article_5',
    title: 'Foods That Support Hormonal Balance',
    category: 'Nutrition',
    readTime: 2,
    image: '🥗',
    excerpt: 'Discover which foods can help regulate your menstrual cycle and reduce symptoms.',
    content: `Nutrition plays a crucial role in menstrual health. Here are key foods for hormonal balance:

Omega-3 Rich Foods: Salmon, walnuts, and flaxseeds reduce inflammation and cramp severity.

Leafy Greens: Spinach and kale provide iron (important during menstruation) and magnesium (helps muscle relaxation).

Complex Carbs: Quinoa, brown rice, and sweet potatoes stabilize blood sugar and mood.

Fermented Foods: Yogurt, kimchi, and sauerkraut support gut health, which influences hormone metabolism.

Limit: Caffeine and alcohol can worsen PMS symptoms. Processed foods and excess sugar may increase inflammation.

Consider keeping a food-mood diary to identify your personal triggers and supportive foods.`
  },
  {
    id: 'article_6',
    title: 'PCOS: Signs, Symptoms, and Management',
    category: 'Menstrual Health',
    readTime: 2,
    image: '🔬',
    excerpt: 'Essential information about Polycystic Ovary Syndrome and how to manage it.',
    content: `Polycystic Ovary Syndrome (PCOS) affects 1 in 10 women of reproductive age. Key signs include:

- Irregular or absent periods
- Excess facial or body hair
- Weight gain or difficulty losing weight
- Acne and oily skin
- Thinning hair on the scalp
- Difficulty getting pregnant

PCOS is caused by hormonal imbalances, particularly excess androgens. While there's no cure, it's manageable:

1. Lifestyle: Regular exercise and balanced diet improve insulin sensitivity
2. Medications: Birth control pills can regulate cycles; metformin helps with insulin resistance
3. Weight management: Even 5-10% weight loss can significantly improve symptoms
4. Stress reduction: Chronic stress worsens hormonal imbalances

If you suspect PCOS, consult a healthcare provider for proper diagnosis and personalized treatment plan.`
  }
];
