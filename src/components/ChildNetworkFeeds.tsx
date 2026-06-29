import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

interface WhitelabelTheme {
  accent?: string;
  heroCopy?: string;
}

interface WhitelabelConfig {
  id: string;
  name: string;
  domain: string;
  theme?: WhitelabelTheme;
}

interface Profile {
  username: string;
  avatar_url: string;
  whitelabel_id: string;
  whitelabel?: WhitelabelConfig;
}

interface PostItem {
  id: string;
  content: string;
  image_url: string;
  likes: number;
  created_at: string;
  creator_id: string;
  creator?: Profile;
  articleUrl?: string;
}

const ARTICLE_BODIES: Record<string, { category: string; sections: string[]; routine?: string[]; tips?: string }> = {
  'mf-art-1': {
    category: 'INTERVIEWS',
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
  'mf-art-2': {
    category: 'WORKOUT TIPS',
    sections: [
      "Dumbbells or Kettlebells? Here's what most lifters need to hear about both training tools.",
      "For most lifters, old-school tools may be the safest, simplest, and most results-driven choices for muscle development and core stability. While dumbbells are ideal for linear, isolated muscle growth, kettlebells excel at dynamic, explosive, and multi-planar movements."
    ],
    routine: [
      'Dumbbell Romanian Deadlifts: 3 sets x 10 reps (Focus on hamstring stretch)',
      'Kettlebell Swings: 4 sets x 20 reps (Explosive hip extension)',
      'Dumbbell Shoulder Press: 3 sets x 8 reps (Linear overhead power)',
      'Kettlebell Goblet Squats: 3 sets x 12 reps (Core and quad activation)'
    ],
    tips: 'Use dumbbells for hypertrophy and kettlebells for conditioning, core, and functional athleticism.'
  },
  'mf-art-3': {
    category: 'NEWS',
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
};

export default function ChildNetworkFeeds({ parentId, accent = 'var(--accent-primary)', isOlympian = false, isB2K = false, isMf = false }: { parentId: string, accent?: string, isOlympian?: boolean, isB2K?: boolean, isMf?: boolean }) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeArticle, setActiveArticle] = useState<PostItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMf) {
      const mfArticles: PostItem[] = [
        {
          id: 'mf-art-1',
          content: "MAX REPS, NO REST DAYS: ZAcH JOHN KING IS PUTTING EVERYTHING ON THE BAR. There’s strength in honesty with this country artist's new album, \"I'm What You Picture\".",
          image_url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
          likes: 2450,
          created_at: new Date().toISOString(),
          creator_id: 'powell-fit',
          creator: {
            username: 'zachjohnking',
            avatar_url: 'https://images.unsplash.com/photo-1534538327276-14e5300c3a48?auto=format&fit=crop&q=100&w=100',
            whitelabel_id: 'mf-wl',
            whitelabel: {
              id: 'mf-wl',
              name: 'Muscle & Fitness',
              domain: 'muscleandfitness.com',
              theme: { accent: '#E31B23' }
            }
          }
        },
        {
          id: 'mf-art-2',
          content: "DUMBBELLS OR KETTLEBELLS? HERE'S WHAT MOST LIFTERS NEED TO HEAR ABOUT BOTH. For most lifters, old-school tools may be the safest, simplest and most results-driven choices.",
          image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
          likes: 1890,
          created_at: new Date().toISOString(),
          creator_id: 'damien-patrick',
          creator: {
            username: 'mf_workout_tips',
            avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=100&w=100',
            whitelabel_id: 'mf-wl',
            whitelabel: {
              id: 'mf-wl',
              name: 'Muscle & Fitness',
              domain: 'muscleandfitness.com',
              theme: { accent: '#E31B23' }
            }
          }
        },
        {
          id: 'mf-art-3',
          content: "MILOS SARCEV REVEALS THE ONE MISTAKE THAT COULD COST NICK WALKER THE TAMPA PRO. The \"Menace Podcast\" discussed his posing stamina against Joe Palacios.",
          image_url: 'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?auto=format&fit=crop&q=80&w=800',
          likes: 3120,
          created_at: new Date().toISOString(),
          creator_id: 'sam-sulek',
          creator: {
            username: 'menacepodcast',
            avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=100&w=100',
            whitelabel_id: 'mf-wl',
            whitelabel: {
              id: 'mf-wl',
              name: 'Muscle & Fitness',
              domain: 'muscleandfitness.com',
              theme: { accent: '#E31B23' }
            }
          }
        }
      ];
      setPosts(mfArticles);
      setLoading(false);
      return;
    }

    if (!parentId) return;
    let cancelled = false;

    async function fetchTopPosts() {
      try {
        const { data: postsData, error: postsErr } = await supabase
          .from('posts')
          .select('*, creator:profiles!inner(username, avatar_url, whitelabel_id, whitelabel:whitelabel_configs!inner(name, theme, parent_network_id))')
          .eq('creator.whitelabel.parent_network_id', parentId)
          .order('likes', { ascending: false });

        if (postsErr) {
          console.warn('Error fetching posts for child feeds:', postsErr);
          return;
        }

        if (cancelled) return;

        const topPostsMap = new Map<string, PostItem>();
        for (const post of (postsData || []) as PostItem[]) {
          const wlId = post.creator?.whitelabel_id;
          const wlName = post.creator?.whitelabel?.name;
          const username = post.creator?.username;

          if (wlName && username && username.toLowerCase() === wlName.toLowerCase()) {
            continue;
          }

          if (wlId && !topPostsMap.has(wlId)) {
            topPostsMap.set(wlId, post);
          }
        }

        const filteredPosts = Array.from(topPostsMap.values());
        filteredPosts.sort((a, b) => b.likes - a.likes);
        setPosts(filteredPosts);
      } catch (err) {
        console.error('Failed to load child network feeds:', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTopPosts();

    return () => {
      cancelled = true;
    };
  }, [parentId, isMf]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {isOlympian ? "Loading Trending Partner Moments..." : (isB2K ? "Loading Trending Moments..." : "Loading Trending Moments...")}
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  const cardWidthDesktop = 'calc(25% - 18px)';

  // Find detailed reader content for the active modal
  const details = activeArticle ? ARTICLE_BODIES[activeArticle.id] : null;

  return (
    <section style={{ maxWidth: '1400px', margin: '60px auto 40px', padding: '0 40px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '16px', letterSpacing: '-0.5px' }}>
          <span style={{ width: '4px', height: '24px', borderRadius: '4px', background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            {isOlympian ? "Trending Partner Moments" : (isMf ? "M&F Workouts" : (isB2K ? "Trending Moments" : "Trending"))}
          </span>
        </h2>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={() => handleScroll('left')} 
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--bg-surface-hover)', 
              color: 'var(--text-primary)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              transition: 'all 0.2s', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
            }} 
            onMouseOver={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#000'; }} 
            onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => handleScroll('right')} 
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--bg-surface-hover)', 
              color: 'var(--text-primary)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              transition: 'all 0.2s', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
            }} 
            onMouseOver={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#000'; }} 
            onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          paddingBottom: '30px',
          paddingTop: '10px',
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
        className="hide-scrollbar"
      >
        {posts.map((post) => {
          const childAccent = post.creator?.whitelabel?.theme?.accent || accent;
          const schoolName = post.creator?.whitelabel?.name || 'College Network';
          const shortSchool = schoolName.replace('University of ', '').replace(' University', '');
          const params = new URLSearchParams(window.location.search);
          if (post.creator?.whitelabel_id) {
            params.set('tenant', post.creator.whitelabel_id);
          }
          const cleanLink = `/profile/${post.creator_id}?${params.toString()}`;

          return (
            <motion.div
              key={post.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'rgba(15,15,15,0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                position: 'relative',
                flexShrink: 0,
                width: cardWidthDesktop,
                cursor: 'pointer'
              }}
              onClick={() => {
                if (isMf) {
                  setActiveArticle(post);
                } else {
                  window.location.href = cleanLink;
                }
              }}
              className="child-feed-card"
            >
              <div>
                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.03)'
                }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: childAccent,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: childAccent, boxShadow: `0 0 6px ${childAccent}` }} />
                    {isMf ? (details?.category || 'M&F') : shortSchool}
                  </span>
                </div>

                <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img
                    src={post.creator?.avatar_url || `https://ui-avatars.com/api/?name=${post.creator?.username || 'Creator'}&background=random`}
                    alt={post.creator?.username}
                    referrerPolicy="no-referrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1.5px solid rgba(255,255,255,0.1)'
                    }}
                  />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: 700 }}>
                      @{post.creator?.username}
                    </h4>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {isMf ? 'M&F Editor' : 'Influencer'}
                    </span>
                  </div>
                </div>

                {(() => {
                  if (!post.image_url) return null;
                  let src = post.image_url;
                  if (src.startsWith('[') && src.endsWith(']')) {
                    try {
                      const parsed = JSON.parse(src);
                      src = Array.isArray(parsed) ? parsed[0] || '' : src;
                    } catch {}
                  } else if (src.includes(',')) {
                    src = src.split(',')[0].trim();
                  }
                  if (!src) return null;
                  return (
                    <div style={{
                      width: '100%',
                      aspectRatio: '16/10',
                      overflow: 'hidden',
                      background: '#000',
                      borderTop: '1px solid rgba(255,255,255,0.02)',
                      borderBottom: '1px solid rgba(255,255,255,0.02)'
                    }}>
                      <img
                        src={src}
                        alt="Trending moment"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  );
                })()}

                <div style={{
                  padding: '16px 18px',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  color: 'rgba(255,255,255,0.85)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: '58px',
                  fontWeight: 600
                }}>
                  {post.content.split(':').slice(0, 2).join(':')}
                </div>
              </div>

              <div style={{
                padding: '16px 18px',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                background: 'rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ff4d85', fontWeight: 'bold' }}>
                    <Heart size={14} fill="#ff4d85" /> {post.likes}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                    <MessageCircle size={14} /> {isMf ? 'M&F' : 'Top'}
                  </span>
                </div>

                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    border: `1.5px solid ${childAccent}`,
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.25s'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = childAccent;
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#fff';
                  }}
                >
                  {isMf ? 'Read Article' : 'Visit'} <ArrowRight size={10} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modern, glassmorphic Article Modal Reader */}
      <AnimatePresence>
        {activeArticle && details && (
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
              {/* Header Image with close overlay */}
              <div style={{ width: '100%', height: '240px', overflow: 'hidden', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <img 
                  src={activeArticle.image_url} 
                  alt={activeArticle.content.split(':')[0]} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))' }} />
                
                {/* Float Close Button */}
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

                {/* Top Category Badge */}
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
                  {details.category}
                </div>
              </div>

              {/* Reader Body content */}
              <div style={{ padding: '30px 40px 40px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 20px', color: '#fff', lineHeight: '1.4' }}>
                  {activeArticle.content.split(':').slice(0, 2).join(':')}
                </h3>

                {/* Paragraphs */}
                {details.sections.map((p, idx) => (
                  <p key={idx} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', margin: '0 0 20px' }}>
                    {p}
                  </p>
                ))}

                {/* Routine Split */}
                {details.routine && (
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
                      {details.routine.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#fff', lineHeight: '1.5' }}>
                          <span style={{ color: accent, fontWeight: 'bold' }}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pro Tips Alert */}
                {details.tips && (
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
                      {details.tips}
                    </span>
                  </div>
                )}

                {/* Close Button */}
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
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        
        @media (max-width: 1024px) {
          .child-feed-card {
            width: calc(33.333% - 16px) !important;
          }
        }
        @media (max-width: 768px) {
          .child-feed-card {
            width: calc(50% - 12px) !important;
          }
        }
        @media (max-width: 480px) {
          .child-feed-card {
            width: 85% !important;
          }
        }
      `}</style>
    </section>
  );
}
