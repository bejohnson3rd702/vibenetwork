import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
}

export default function ChildNetworkFeeds({ parentId, accent = 'var(--accent-primary)', isOlympian = false, isB2K = false }: { parentId: string, accent?: string, isOlympian?: boolean, isB2K?: boolean }) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

        // 3. Filter to get the top post for each child network
        const topPostsMap = new Map<string, PostItem>();
        for (const post of (postsData || []) as PostItem[]) {
          const wlId = post.creator?.whitelabel_id;
          const wlName = post.creator?.whitelabel?.name;
          const username = post.creator?.username;

          // Exclude official network profiles (where username matches school/whitelabel name)
          if (wlName && username && username.toLowerCase() === wlName.toLowerCase()) {
            continue;
          }

          if (wlId && !topPostsMap.has(wlId)) {
            topPostsMap.set(wlId, post);
          }
        }

        // Convert map back to list
        const filteredPosts = Array.from(topPostsMap.values());
        
        // Sort by likes DESC to show the absolute most popular ones first
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
  }, [parentId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth; // scroll exactly one full slide view
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

  // Calculate widths dynamically for 4 items per page on desktop
  const cardWidthDesktop = 'calc(25% - 18px)';

  return (
    <section style={{ maxWidth: '1400px', margin: '60px auto 40px', padding: '0 40px', overflow: 'hidden' }}>
      
      {/* Section Header with Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '16px', letterSpacing: '-0.5px' }}>
          <span style={{ width: '4px', height: '24px', borderRadius: '4px', background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            {isOlympian ? "Trending Partner Moments" : (isB2K ? "Trending Moments" : "Trending")}
          </span>
        </h2>
        
        {/* Navigation Buttons */}
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

      {/* Horizontal Slider Scroll Container */}
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
                window.location.href = cleanLink;
              }}
              className="child-feed-card"
            >
              <div>
                {/* School Pill / Accent indicator */}
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
                    {shortSchool}
                  </span>
                </div>

                {/* Post Creator Header */}
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
                      Influencer
                    </span>
                  </div>
                </div>

                {/* Post Media (Image) - Sleeker Aspect Ratio */}
                {post.image_url && (
                  <div style={{
                    width: '100%',
                    aspectRatio: '16/10',
                    overflow: 'hidden',
                    background: '#000',
                    borderTop: '1px solid rgba(255,255,255,0.02)',
                    borderBottom: '1px solid rgba(255,255,255,0.02)'
                  }}>
                    <img
                      src={post.image_url}
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
                )}

                {/* Post Body (Content Text) - Shorter height for compactness */}
                <div style={{
                  padding: '16px 18px',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  color: 'rgba(255,255,255,0.65)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: '58px'
                }}>
                  {post.content}
                </div>
              </div>

              {/* Card Footer / Engagement & Action */}
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
                    <MessageCircle size={14} /> Top
                  </span>
                </div>

                <a
                  href={cleanLink}
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
                  Visit <ArrowRight size={10} />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        
        /* Responsive widths for smaller screens */
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
