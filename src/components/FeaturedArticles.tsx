import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ArticleItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  likes: number;
  sections: string[];
  routine?: string[];
  tips?: string;
}

const FEATURED_ARTICLES: ArticleItem[] = [
  {
    id: 'mf-feat-1',
    category: 'INTERVIEWS',
    title: 'MAX REPS, NO REST DAYS: ZACH JOHN KING IS PUTTING EVERYTHING ON THE BAR',
    excerpt: "There’s strength in honesty with this country artist's new album, \"I'm What You Picture\". Learn his high-intensity training splits.",
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    likes: 2450,
    sections: [
      "Max Reps, No Rest Days: Zach John King is putting everything on the bar. There’s strength in honesty with this country artist's new album, 'I'm What You Picture'.",
      "Between writing hit records and touring across the country, Zach John King follows a heavy lifting, high-intensity split to build raw power. Here is a look at his daily physical grind."
    ],
    routine: [
      'Deadlifts: 4 sets x 8, 6, 4, 2 reps (Heavy weight, maximal effort)',
      'Dumbbell Flat Bench Press: 4 sets x 10, 8, 8, 6 reps',
      'Weighted Pull-ups: 3 sets x max reps (To complete failure)',
      'Barbell Bicep Curls: 3 sets x 12 reps'
    ],
    tips: 'Consistency is your main driver. Keep pushing the boundaries of your lifts every single week.'
  },
  {
    id: 'mf-feat-2',
    category: 'WORKOUT TIPS',
    title: "DUMBBELLS OR KETTLEBELLS? HERE'S WHAT MOST LIFTERS NEED TO HEAR ABOUT BOTH",
    excerpt: 'For most lifters, old-school tools may be the safest, simplest and most results-driven choices for muscle development and core stability.',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    likes: 1890,
    sections: [
      "Dumbbells or Kettlebells? Here's what most lifters need to hear about both training tools.",
      "For most lifters, old-school tools may be the safest, simplest, and most results-driven choices. While dumbbells are ideal for linear, isolated muscle growth, kettlebells excel at dynamic, explosive, and multi-planar movements."
    ],
    routine: [
      'Dumbbell Romanian Deadlifts: 3 sets x 10 reps (Focus on hamstring stretch)',
      'Kettlebell Swings: 4 sets x 20 reps (Explosive hip extension)',
      'Dumbbell Shoulder Press: 3 sets x 8 reps (Linear overhead power)',
      'Kettlebell Goblet Squats: 3 sets x 12 reps (Core and quad activation)'
    ],
    tips: 'Use dumbbells for hypertrophy and kettlebells for conditioning, core, and functional athleticism.'
  },
  {
    id: 'mf-feat-3',
    category: 'NEWS',
    title: 'MILOS SARCEV REVEALS THE ONE MISTAKE THAT COULD COST NICK WALKER THE TAMPA PRO',
    excerpt: "The \"Menace Podcast\" discussed Nick Walker's chances against Joe Palacios and Milos Sarcev's analysis of his posing stamina.",
    imageUrl: 'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?auto=format&fit=crop&q=80&w=800',
    likes: 3120,
    sections: [
      "Milos Sarcev reveals the one mistake that could cost Nick Walker the Tampa Pro.",
      "On the recent 'Menace Podcast', legendary coach Milos Sarcev analyzed Nick Walker's conditioning and pointed out a crucial error in his transition posing that might impact his scoring against Joe Palacios."
    ],
    routine: [
      'Transition Posing: Hold every mandatory pose for 10 seconds without breathing out.',
      'Side Chest Pose: Focus on keeping the ribcage high and contracting the hamstrings.',
      'Front Double Biceps: Keep elbows high and vacuum the midsection.',
      'Abdominal and Thigh: Control breathing and maintain complete core stability.'
    ],
    tips: 'Bodybuilding shows are won in the transitions. Posing stamina is just as important as heavy training.'
  }
];

export default function FeaturedArticles({ accent = '#E31B23' }: { accent?: string }) {
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);

  return (
    <section style={{ maxWidth: '1400px', margin: '40px auto 60px', padding: '0 40px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <span style={{ width: '4px', height: '24px', borderRadius: '4px', background: accent, boxShadow: `0 0 10px ${accent}` }} />
        <h2 style={{ fontSize: '24px', margin: 0, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Featured Articles
        </h2>
      </div>

      {/* Vertical List of Articles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {FEATURED_ARTICLES.map((article) => (
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
              <span style={{
                fontSize: '11px',
                fontWeight: 900,
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                {article.category}
              </span>
              
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
                {article.excerpt}
              </p>
              
              {/* Underlined Read Article link */}
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

      {/* Reader Modal */}
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
                <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 20px', color: '#fff', lineHeight: '1.4' }}>
                  {activeArticle.title}
                </h3>

                {activeArticle.sections.map((p, idx) => (
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
                      Routine Guide & Breakdown
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
                      Muscle & Fitness Pro-Tip
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
                  Close Reader
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
