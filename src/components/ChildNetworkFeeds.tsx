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
    category: 'Training & Longevity',
    sections: [
      'LA Clippers star guard Norman Powell shares his in-season workout strategy designed to maintain explosive force, power, and athletic longevity without overtaxing his central nervous system during the rigorous NBA schedule.',
      'During the season, the primary goal is not raw muscle building but rather maintenance, joint stability, injury prevention, and core power. Powell emphasizes high eccentric control and deep activation.'
    ],
    routine: [
      'Bulgarian Split Squats: 3 sets x 8 reps (Focus on depth and glute load)',
      'Single-Arm Dumbbell Incline Bench Press: 3 sets x 10 reps (Unilateral control)',
      'Single-Leg Glute Bridges: 3 sets x 12 reps (Posterior chain activation)',
      'Med Ball Rotational Slams: 3 sets x 10 reps per side (Core power)'
    ],
    tips: 'Keep intensity high but volume moderate during the active season to prioritize recovery.'
  },
  'mf-art-2': {
    category: 'Hypertrophy & Mass',
    sections: [
      'IFBB Pro Damien Patrick details the high-volume back day workout that helped him carve out maximum detail, thickness, and width during his final prep phases for the Olympia stage.',
      'His philosophy revolves around maximum squeeze at peak contraction and slow negative release to target deep motor units.'
    ],
    routine: [
      'Wide-Grip Cable Lat Pulldowns: 4 sets x 12, 10, 8, 8 reps (Squeeze at the bottom)',
      'Single-Arm Machine Rows: 3 sets x 10 reps (Pull with your elbows)',
      'Barbell Bent-Over Rows: 4 sets x 10 reps (Heavy compound lifter)',
      'Straight-Arm Cable Pullovers: 3 sets x 15 reps (Stretches the lat fascia)'
    ],
    tips: 'Control the negative portion of every single repetition to recruit maximum muscle fibers.'
  },
  'mf-art-3': {
    category: 'Leg Hypertrophy',
    sections: [
      'Sam Sulek breaks down his quad-focused leg day routine used during his cutting cycles to carve deep, feather-like detail into the vastus lateralis and rectus femoris.',
      'Sulek focuses on intense knee flexion, pushing past failure, and maximizing volume on isolation machine lifts.'
    ],
    routine: [
      'Leg Extensions: 5 sets x 15-20 reps (Hold contraction, warm up the knees)',
      'Smith Machine Squats: 4 sets x 8-12 reps (Deep depth, slow eccentric tempo)',
      'Horizontal Leg Press: 3 sets x 10-12 reps (High and wide foot placement)',
      'Dumbbell Walking Lunges: 3 sets x 20 steps (Total leg finisher)'
    ],
    tips: 'Focus on full range of motion and deep knee flexion rather than raw weight load.'
  },
  'mf-art-4': {
    category: 'Diet & Nutrition',
    sections: [
      'A comprehensive, science-backed nutrition blueprint designed to safely shred body fat while maintaining high energy levels and retaining lean tissue mass.',
      'Consistent meal prep and precise macro breakdown are critical. Focus on high protein, moderate healthy fats, and low glycemic carbs.'
    ],
    routine: [
      'Meal 1: 5 Egg Whites, 1 Whole Egg, 1/2 Cup Oats with Berries.',
      'Meal 2: 6oz Grilled Chicken Breast, 1 Cup Broccoli, 4oz Sweet Potato.',
      'Meal 3: 6oz Grilled Tilapia, Mixed Greens Salad with Olive Oil.',
      'Meal 4 (Post-Workout): 1.5 scoops Whey Isolate, 1 Medium Banana.',
      'Meal 5: 6oz Lean Sirloin Steak, Grilled Asparagus.'
    ],
    tips: 'Drink at least 1 gallon of clean water daily to support metabolic function and recovery.'
  },
  'mf-art-5': {
    category: 'Endurance & Conditioning',
    sections: [
      'Champion athlete Zach Fowle shares the intense rowing drills, lung-burning interval splits, and mental framing techniques he used to prepare his body for the USRowing Indoor Championships.',
      'Rowing requires an extraordinary balance of aerobic capacity and muscular power. Pacing is everything.'
    ],
    routine: [
      'Interval Work: 4x 1,000m row (Targeting 2k pace, 3 mins rest between)',
      'Aerobic Base: 45-minute steady-state row (Keep strokes per minute at 18-20)',
      'Strength Assist: Deadlifts and plank holds to maintain strong posture.'
    ],
    tips: 'Pace the first quarter of your piece conservatively to preserve energy for a strong finish.'
  },
  'mf-art-6': {
    category: 'Science & Metabolism',
    sections: [
      'Sports science researchers and nutrition physiologists debunk the myths surrounding weight fluctuation and explain how repeated cycles of rapid weight loss and gain affect thyroid production, metabolic rate, and hormone signaling.',
      'Yo-yo dieting damages metabolic efficiency. Protecting muscle mass through resistance training and consuming sufficient protein is key to long-term health.'
    ],
    routine: [
      'Metabolic Adaptation: Energy output decreases to match restricted calories.',
      'Hormonal Shifts: Dieting decreases leptin (fullness) and increases ghrelin (hunger).',
      'The Solution: Deficits should be small (10-15%) with gradual step-ups.'
    ],
    tips: 'Avoid crash dieting; a slow caloric reduction ensures your metabolism remains active.'
  }
};

export default function ChildNetworkFeeds({ parentId, accent = 'var(--accent-primary)', isOlympian = false, isB2K = false, isMf = false, isBonaire = false }: { parentId: string, accent?: string, isOlympian?: boolean, isB2K?: boolean, isMf?: boolean, isBonaire?: boolean }) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeArticle, setActiveArticle] = useState<PostItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parentId === 'cb000000-c08f-4260-8540-a0cc8bed4e11' || parentId === 'courtney-bee-tenant-id') {
      const cbPosts: PostItem[] = [
        {
          id: 'cb-post-1',
          content: "“I'm Ovulating, Nick” with Tiffany Haddish: Courtney Bee & Nick Cannon host Tiffany Haddish at the turquoise table for high-stakes Spades, trash talk, and uncensored stories.",
          image_url: 'https://i.ytimg.com/vi/CytqhMMV7sQ/hqdefault.jpg',
          likes: 5420,
          created_at: new Date().toISOString(),
          creator_id: 'courtney-bee',
          creator: {
            username: 'courtneybee',
            avatar_url: '/n2n/courtney_bee_avatar.jpg',
            whitelabel_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
            whitelabel: {
              id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
              name: 'Courtney Bee Network',
              domain: 'courtneybeenetwork.tv',
              theme: { accent: '#D35400' }
            }
          }
        },
        {
          id: 'cb-post-2',
          content: "Standing on Boundaries and Wrestling with Mercedes Moné: Pro wrestling superstar Mercedes Moné hits the Spades table with Courtney Bee and Nick Cannon.",
          image_url: 'https://i.ytimg.com/vi/pd5J_kQqLB0/hqdefault.jpg',
          likes: 4890,
          created_at: new Date().toISOString(),
          creator_id: 'courtney-bee',
          creator: {
            username: 'courtneybee',
            avatar_url: '/n2n/courtney_bee_avatar.jpg',
            whitelabel_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
            whitelabel: {
              id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
              name: 'Courtney Bee Network',
              domain: 'courtneybeenetwork.tv',
              theme: { accent: '#D35400' }
            }
          }
        },
        {
          id: 'cb-post-3',
          content: "Best Of Courtney Bee Wild 'N Out Highlights: Watch Courtney Bee drop savage punchlines, roast the Black Squad, and dominate the Wild 'N Out stage on MTV.",
          image_url: 'https://i.ytimg.com/vi/gC1V0uL_5xI/hqdefault.jpg',
          likes: 6120,
          created_at: new Date().toISOString(),
          creator_id: 'courtney-bee',
          creator: {
            username: 'courtneybee',
            avatar_url: '/n2n/courtney_bee_avatar.jpg',
            whitelabel_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
            whitelabel: {
              id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
              name: 'Courtney Bee Network',
              domain: 'courtneybeenetwork.tv',
              theme: { accent: '#D35400' }
            }
          }
        }
      ];
      setPosts(cbPosts);
      setLoading(false);
      return;
    }

    if (isMf) {
      const mfArticles: PostItem[] = [
        {
          id: 'mf-art-1',
          content: 'Norman Powell’s LA Clippers In-Season Routine: LA Clippers star Norman Powell details his functional, in-season workout strategy targeting maintenance, joint longevity, and explosive speed on the hardwood.',
          image_url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800',
          likes: 2450,
          created_at: new Date().toISOString(),
          creator_id: 'powell-fit',
          articleUrl: 'https://www.muscleandfitness.com/athletes-celebrities/interviews/norman-powell-la-clippers-in-season-workout/',
          creator: {
            username: 'normanpowell',
            avatar_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=100&w=100',
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
          content: 'Damien Patrick’s Olympia 2025 Back Workout: Learn the latent training techniques, heavy rows, and lat pulldown splits Damien Patrick uses to build thickness and width ahead of his 2025 stage appearance.',
          image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
          likes: 1890,
          created_at: new Date().toISOString(),
          creator_id: 'damien-patrick',
          articleUrl: 'https://www.muscleandfitness.com/workouts/back-exercises/damien-patrick-olympia-back-workout/',
          creator: {
            username: 'damienpatrick',
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
          content: 'Sam Sulek’s Quad-Focused Leg Day Secrets: Sam Sulek breaks down his high-intensity, low-rep leg day routine for maximum quadriceps hypertrophy and deep conditioning during his cutting phases.',
          image_url: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=800',
          likes: 3120,
          created_at: new Date().toISOString(),
          creator_id: 'sam-sulek',
          articleUrl: 'https://www.muscleandfitness.com/workouts/leg-exercises/sam-sulek-quad-focused-leg-day/',
          creator: {
            username: 'samsulek',
            avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=100&w=100',
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
          id: 'mf-art-4',
          content: 'The 28-Days-to-Lean Meal Plan and Nutrition Guide: A comprehensive, science-backed nutrition blueprint outlining high-protein, calorie-controlled meal preparation designed to shred fat while preserving lean muscle mass.',
          image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
          likes: 1280,
          created_at: new Date().toISOString(),
          creator_id: 'mf-nutrition',
          articleUrl: 'https://www.muscleandfitness.com/nutrition/meal-plans/28-days-lean-meal-plan/',
          creator: {
            username: 'mf_nutrition',
            avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=100&w=100',
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
          id: 'mf-art-5',
          content: 'Zach Fowle’s USRowing Indoor Championships Prep: Zach Fowle details the physical conditioning, high-stroke pacing, and mental endurance strategies he used to prepare for the 2025 championships.',
          image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
          likes: 980,
          created_at: new Date().toISOString(),
          creator_id: 'zach-fowle',
          articleUrl: 'https://www.muscleandfitness.com/athletes-celebrities/news/zach-fowle-indoor-rowing/',
          creator: {
            username: 'zachfowle',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=100&w=100',
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
          id: 'mf-art-6',
          content: 'Metabolism Myths: The Physiological Truth About Yo-Yo Dieting: Fitness physiologists break down the science of chronic dieting and how rapid body composition shifts affect daily energy expenditure and thyroid hormones.',
          image_url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800',
          likes: 1670,
          created_at: new Date().toISOString(),
          creator_id: 'mf-science',
          articleUrl: 'https://www.muscleandfitness.com/nutrition/healthy-eating/yo-yo-dieting-metabolism/',
          creator: {
            username: 'mf_science',
            avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=100&w=100',
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
          {isOlympian ? "Loading Trending Partner Moments..." : (isB2K ? "Loading Trending Moments..." : (isBonaire ? "Loading Latest Merchant Updates..." : "Loading Trending Moments..."))}
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
            {isOlympian ? "Trending Partner Moments" : (isMf ? "Muscle & Fitness Workouts" : (isB2K ? "Trending Moments" : (isBonaire ? "Latest Merchant Updates" : "Trending")))}
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
                WebkitBackdropFilter: 'blur(10px)',
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
                    {isMf ? 'M&F Premium' : shortSchool}
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
                      {isMf ? 'Muscle & Fitness Writer' : 'Influencer'}
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

                <div className="line-clamp-3" style={{
                  padding: '16px 18px',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  color: 'rgba(255,255,255,0.65)',
                  minHeight: '58px'
                }}>
                  {post.content}
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
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            {/* Highly-visible Fixed Close Button */}
            <button 
              onClick={() => setActiveArticle(null)}
              style={{
                position: 'fixed',
                top: '24px',
                right: '24px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10005,
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
            >
              <X size={24} />
            </button>

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
                <h3 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 20px', color: '#fff', lineHeight: '1.3' }}>
                  {activeArticle.content.split(':')[0]}
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
                      {details.category.toLowerCase().includes('diet') ? 'Daily Nutritional Plan' : 'Routine Guide & Breakdown'}
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
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
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
