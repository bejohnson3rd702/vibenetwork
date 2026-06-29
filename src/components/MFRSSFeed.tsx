import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle } from 'lucide-react';

interface RSSItem {
  id: string;
  category: string;
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  description: string;
  imageUrl: string;
  content: string[];
  routine?: string[];
  tips?: string;
}

const RSS_ITEMS: RSSItem[] = [
  {
    id: 'rss-1',
    category: 'Interviews',
    title: "Max Reps, No Rest Days: Zach John King Is Putting Everything on the Bar with ‘I’m What You Get’",
    link: 'https://www.muscleandfitness.com/athletes-celebrities/interviews/max-reps-no-rest-days-zach-john-king-is-putting-everything-on-the-bar-with-im-what-you-get/',
    pubDate: 'Fri, 26 Jun 2026',
    creator: 'Jeff Tomko',
    description: "Country artist Zach John King is learning that longevity isn’t just about staying on the road. It’s about taking care of yourself long enough to enjoy the journey.",
    imageUrl: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2026/06/JZK1-e1782507926151.png',
    content: [
      "Country artist Zach John King is learning that longevity isn’t just about staying on the road. It’s about taking care of yourself long enough to enjoy the journey. When we met King on a golf course outside Chicago ahead of the release of his debut album, I’m What You Get, he was exactly who his music suggests he is. He spoke with the same ease about hunting, fishing, and growing up outdoors as he did about high-protein meals, sauna sessions, recovery, and the realities of maintaining healthy habits while living on a tour bus.",
      "That balance between old-school country values and modern wellness has become one of the defining themes of his career. Although performing night-after-night has fulfilled a lifelong dream, King has also learned that success demands discipline away from the stage. Staying physically fit, protecting his mental health, leaning on his faith, and surrounding himself with the right people have become just as important as writing hit songs.",
      "Every afternoon, King and his band schedule what they jokingly call 'recess.' Recess consists of 30 minutes of high-intensity activity that could mean a workout circuit, tossing around a football, or anything that gets everyone moving after hours of sitting. Before each show, they add another tradition to the routine: knocking out 15 to 20 pushups together.",
      "While he’s experimented with cold plunges and enjoys the physical benefits of ice baths, he says they energize him more than relax him. That’s why the sauna has become his go-to recovery ritual. Spending 20 minutes in the heat after a workout helps quiet both his body and mind, making it one of the most valuable wellness habits he’s adopted on and off the road."
    ],
    routine: [
      'Recess Circuit: 30 minutes of team cardio, mobility drills, and sprints.',
      'Pre-Show Pushups: 15 to 20 pushups as a band ritual.',
      'Sauna Recovery: 20 minutes in the dry sauna post-workout.'
    ],
    tips: 'Surround yourself with a solid inner circle that keeps you grounded, and focus on physical recovery to offset high-adrenaline travel.'
  },
  {
    id: 'rss-2',
    category: 'Workout Tips',
    title: 'Kettlebells vs. Dumbbells: Which Is Better for Building Muscle and Strength?',
    link: 'https://www.muscleandfitness.com/workouts/workout-tips/kettlebells-vs-dumbbells-which-is-better-for-building-muscle-and-strength/',
    pubDate: 'Fri, 26 Jun 2026',
    creator: 'vkim',
    description: "Twenty years ago and you’d be hard pressed to find a kettlebell anywhere, let alone a gym. Dumbbells ruled the free weight area and had been doing so for well over a century.",
    imageUrl: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2025/04/Strong-man-performing-a-single-kettlebell-upper-body-workout-in-the-gym.jpg',
    content: [
      "Twenty years ago and you’d be hard pressed to find a kettlebell anywhere, let alone a gym. Dumbbells ruled the free weight area and had been doing so for well over a century. Fast forward to today and kettlebells have staged a dramatic comeback, thanks in large part to the explosion of functional fitness training and the popularity of CrossFit.",
      "A dumbbell distributes weight evenly on both sides of the hand, placing the load directly in line with the wrist, forearm, and elbow. This makes dumbbells extremely stable and highly predictable during movement. A kettlebell, by contrast, positions the bulk of its weight several inches below the handle, shifting the center of gravity away from the hand. This creates instability and introduces a leverage challenge not present with conventional dumbbells.",
      "For roughly 90 percent of lifters, there exists no measurable advantage to kettlebells over traditional dumbbell training when the goal is hypertrophy, general fitness, or strength development. In fact, dumbbells often provide superior exercise variety and more direct overload potential because weight increments are smaller and progression is easier to manage."
    ],
    routine: [
      'Dumbbell Romanian Deadlifts: 3 sets x 10 reps (Focus on hamstring stretch)',
      'Kettlebell Swings: 4 sets x 20 reps (Explosive hip extension)',
      'Dumbbell Shoulder Press: 3 sets x 8 reps (Linear overhead power)',
      'Kettlebell Goblet Squats: 3 sets x 12 reps (Core and quad activation)'
    ],
    tips: 'Lifting is the religion, not the implements. Select the tool that fits your dynamic vs. linear goals.'
  },
  {
    id: 'rss-3',
    category: 'News',
    title: 'Nick Walker vs. Joe Palacios: Bodybuilding Legends Debate the Biggest Threat at the 2026 Tampa Pro',
    link: 'https://www.muscleandfitness.com/flexonline/flex-news/nick-walker-vs-joe-palacios-bodybuilding-legends-debate-the-biggest-threat-at-the-2026-tampa-pro/',
    pubDate: 'Fri, 26 Jun 2026',
    creator: 'vkim',
    description: "On Episode 290 of The Menace Podcast, Dennis “The Menace” James, Milos Sarcev, and Jose Raymond discussed Nick Walker’s chances against Joe Palacios.",
    imageUrl: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2026/06/TMP-Nick-walker.jpg',
    content: [
      "On Episode 290 of The Menace Podcast, host Dennis “The Menace” James was joined by regular panelists Milos Sarcev and Jose Raymond, and the gang discussed Nick Walker’s chances of winning the 2026 IFBB Tampa Pro against popular contenders like Joe Palacios.",
      "The Tampa Pro will take place between July 30 and August 1, 2026, and is a proving ground where the winner in the Open division will receive qualification for this year’s Mr. Olympia final in Las Vegas. Dennis James pointed out that despite Palacios' recent progress, Walker is still the odds-on favorite to win this year. But Milos Sarcev countered that it won’t be a 'walk in the park' because underestimating the competition is a dangerous trap.",
      "Dennis also said that being too cocky could lead to audiences rooting for the underdog ahead of the final in Tampa. The Tampa Pro could certainly be a closer fought fight than Walker would like to believe. They compare pretty well, making it a very fun show to watch."
    ],
    routine: [
      'Side Chest Pose: Keep ribcage high, contract the hamstrings and glutes.',
      'Front Double Biceps: Squeeze and vacuum the midsection.',
      'Most Muscular: Hold for 5 seconds showing maximum striations.'
    ],
    tips: 'Never underestimate your competition. Posing endurance and transition conditioning win championships.'
  },
  {
    id: 'rss-4',
    category: 'Pro Tips',
    title: 'Kenneth H. Cooper’s Career Has Been Focused on Service and Fitness',
    link: 'https://www.muscleandfitness.com/athletes-celebrities/pro-tips/kenneth-h-coopers-career-has-been-focused-on-service-and-fitness/',
    pubDate: 'Fri, 26 Jun 2026',
    creator: 'vkim',
    description: "Dr. Kenneth Cooper, Father of Aerobics, flight surgeon, and NASA consultant, shares key physical conditioning metrics for longevity.",
    imageUrl: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2026/06/Air-Force-Veteran-Kenneth-H.-Cooper-tracking-cadet-physical-perfomance.jpg',
    content: [
      "Dr. Kenneth Cooper, widely revered in the fitness space as the 'Father of Aerobics,' served in the U.S. Air Force as a flight surgeon for 13 years. Cooper worked directly with NASA to help design physical conditioning programs that prepared early astronauts for space travel.",
      "Cooper also famously coached the 1970 Brazilian World Cup soccer team. By testing players with his famous '12-minute test' and establishing a 20-mile-a-week running program, Brazil went on to win six straight matches and take the championship title. 'Jogging' in Brazil is still referred to as 'doing the Cooper.'",
      "Cooper settled in Dallas and his principles remain simple: 150 minutes of aerobic exercise a week, clean nutrition, and consistent discipline. 'Fitness is a journey, not a destination. You must keep it up the rest of your life.'"
    ],
    routine: [
      'Aerobic Baseline: 150 minutes of moderate exercise (running, walking, cycling) per week.',
      'Nutrition: 5 to 9 servings of vegetables and fruit daily.',
      'Waist-to-Height Ratio: Circumference should not exceed 1/2 of height.'
    ],
    tips: 'Fitness is a journey, not a destination. If you can no longer run, walk, swim, or cycle. Where there is a will, there is a way.'
  }
];

export default function MFRSSFeed({ accent = '#E31B23' }: { accent?: string }) {
  const [activeArticle, setActiveArticle] = useState<RSSItem | null>(null);

  return (
    <section style={{ maxWidth: '1400px', margin: '40px auto 60px', padding: '0 40px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <span style={{ width: '4px', height: '24px', borderRadius: '4px', background: accent, boxShadow: `0 0 10px ${accent}` }} />
        <h2 style={{ fontSize: '24px', margin: 0, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Muscle & Fitness Articles
        </h2>
      </div>

      {/* Vertical List of Feed Articles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {RSS_ITEMS.map((article) => (
          <motion.div
            key={article.id}
            whileHover={{ x: 6 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => setActiveArticle(article)}
            style={{
              display: 'flex',
              background: 'rgba(15, 15, 15, 0.4)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              overflow: 'hidden',
              cursor: 'pointer',
              padding: '16px',
              gap: '24px',
              alignItems: 'center'
            }}
            className="article-card-row"
          >
            {/* Image Thumbnail */}
            <div style={{
              width: '180px',
              height: '120px',
              borderRadius: '8px',
              overflow: 'hidden',
              flexShrink: 0,
              background: '#000'
            }}>
              <img
                src={article.imageUrl}
                alt={article.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Details Column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  color: accent,
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  {article.category}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {article.pubDate}
                </span>
              </div>
              
              <h3 style={{
                fontSize: '16px',
                fontWeight: 800,
                margin: 0,
                color: '#fff',
                lineHeight: '1.4',
                letterSpacing: '-0.2px'
              }}>
                {article.title}
              </h3>
              
              <p style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.6)',
                margin: 0,
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {article.description}
              </p>
              
              {/* Link */}
              <div style={{ display: 'inline-flex', marginTop: '4px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: '#fff',
                  borderBottom: `2.5px solid ${accent}`,
                  paddingBottom: '2px',
                  letterSpacing: '0.8px'
                }}>
                  READ ARTICLE
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Reader */}
      <AnimatePresence>
        {activeArticle && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 10000,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'rgba(22, 22, 22, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '28px',
                maxWidth: '650px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
              }}
              className="hide-scrollbar"
            >
              {/* Header Image */}
              <div style={{ width: '100%', height: '240px', overflow: 'hidden', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <img 
                  src={activeArticle.imageUrl} 
                  alt={activeArticle.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))' }} />
                
                <button 
                  onClick={() => setActiveArticle(null)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                >
                  <X size={20} />
                </button>

                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '24px',
                  background: accent,
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: '30px',
                  letterSpacing: '1px',
                  boxShadow: `0 4px 15px ${accent}66`
                }}>
                  {activeArticle.category}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '30px 40px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    By {activeArticle.creator}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Published: {activeArticle.pubDate}
                  </span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 20px', color: '#fff', lineHeight: '1.4' }}>
                  {activeArticle.title}
                </h3>

                {activeArticle.content.map((p, idx) => (
                  <p key={idx} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', margin: '0 0 20px' }}>
                    {p}
                  </p>
                ))}

                {activeArticle.routine && (
                  <div style={{
                    margin: '30px 0',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    padding: '24px 28px',
                    borderRadius: '16px'
                  }}>
                    <h4 style={{ margin: '0 0 16px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', color: accent, fontWeight: 900 }}>
                      Guide & Breakdown
                    </h4>
                    <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {activeArticle.routine.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#fff', lineHeight: '1.5' }}>
                          <span style={{ color: accent, fontWeight: 'bold' }}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeArticle.tips && (
                  <div style={{
                    borderLeft: `3px solid ${accent}`,
                    background: 'rgba(227, 27, 35, 0.05)',
                    padding: '16px 20px',
                    borderRadius: '0 12px 12px 0',
                    margin: '0 0 30px'
                  }}>
                    <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: accent, marginBottom: '4px', fontWeight: 900 }}>
                      M&F Expert Tip
                    </strong>
                    <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5' }}>
                      {activeArticle.tips}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '14px',
                    border: 'none',
                    background: accent,
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: `0 6px 20px ${accent}44`,
                    transition: 'transform 0.2s, filter 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseOut={e => e.currentTarget.style.filter = 'brightness(1.0)'}
                >
                  Close Article Reader
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .article-card-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .article-card-row > div:first-child {
            width: 100% !important;
            height: 180px !important;
          }
        }
      `}</style>
    </section>
  );
}
