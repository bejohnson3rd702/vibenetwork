import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { getChildNetworks } from '../lib/n2n';

interface WhitelabelTheme {
  accent?: string;
}

interface WhitelabelConfig {
  id: string;
  name: string;
  theme?: WhitelabelTheme;
}

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  whitelabel_id: string;
  whitelabel?: WhitelabelConfig;
}

interface PostItem {
  id: string;
  likes: number;
  creator?: Profile;
}

export default function TopAmbassadors({ parentId, accent = 'var(--accent-primary)' }: { parentId: string, accent?: string }) {
  const [ambassadors, setAmbassadors] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parentId) return;
    let cancelled = false;

    async function fetchAmbassadors() {
      try {
        // 1. Fetch child networks
        const children = await getChildNetworks(parentId);
        if (cancelled) return;

        const childIds = children?.map(c => c.id) || [];
        if (childIds.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Fetch all influencer posts from those child networks ordered by likes desc
        const { data: postsData, error: postsErr } = await supabase
          .from('posts')
          .select('id, likes, creator:profiles!inner(id, username, avatar_url, whitelabel_id, whitelabel:whitelabel_configs(name, theme))')
          .in('creator.whitelabel_id', childIds)
          .order('likes', { ascending: false });

        if (postsErr) {
          console.warn('Error fetching posts for top ambassadors:', postsErr);
          return;
        }

        if (cancelled) return;

        // 3. Extract the top liked post creator (ambassador) from each school
        const topAmbassadorMap = new Map<string, PostItem>();
        for (const post of (postsData || []) as PostItem[]) {
          const wlId = post.creator?.whitelabel_id;
          if (wlId && !topAmbassadorMap.has(wlId)) {
            topAmbassadorMap.set(wlId, post);
          }
        }

        const list = Array.from(topAmbassadorMap.values());
        
        // 4. Sort by likes DESC to rank them
        list.sort((a, b) => b.likes - a.likes);

        setAmbassadors(list);
      } catch (err) {
        console.error('Failed to load top ambassadors:', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchAmbassadors();
    return () => {
      cancelled = true;
    };
  }, [parentId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 360;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Loading Top Ambassadors...</p>
      </div>
    );
  }

  if (ambassadors.length === 0) {
    return null;
  }

  return (
    <section style={{ maxWidth: '1400px', margin: '50px auto 20px', padding: '0 40px', overflow: 'hidden' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '16px', letterSpacing: '-0.5px' }}>
          <span style={{ width: '4px', height: '24px', borderRadius: '4px', background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>Top AVO Ambassadors</span>
        </h2>
        
        {/* Nav Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={() => handleScroll('left')} 
            style={{ 
              width: '40px', 
              height: '40px', 
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
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => handleScroll('right')} 
            style={{ 
              width: '40px', 
              height: '40px', 
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
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal List of Ambassadors */}
      <div 
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '32px',
          overflowX: 'auto',
          paddingBottom: '24px',
          paddingTop: '12px',
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
        className="hide-scrollbar"
      >
        {ambassadors.map((ambassador, idx) => {
          const creator = ambassador.creator!;
          const childAccent = creator.whitelabel?.theme?.accent || accent;
          const schoolName = creator.whitelabel?.name || 'AVO Network';
          const shortSchool = schoolName.replace('University of ', '').replace(' University', '');
          const cleanLink = `/?tenant=${creator.whitelabel_id}${window.location.search ? window.location.search.replace('?', '&') : ''}`;

          return (
            <motion.div
              key={creator.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              style={{
                flexShrink: 0,
                width: '150px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={() => {
                window.location.href = cleanLink;
              }}
            >
              {/* Profile Image & Glow Ring Container */}
              <div style={{ position: 'relative', marginBottom: '14px' }}>
                {/* Ranking Badge */}
                {idx < 3 && (
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    zIndex: 10,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: idx === 0 ? 'linear-gradient(135deg, #FFDF00 0%, #D4AF37 100%)' : idx === 1 ? 'linear-gradient(135deg, #E6E6E6 0%, #AEAEAE 100%)' : 'linear-gradient(135deg, #D7A15C 0%, #A0522D 100%)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '12px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                    border: '2px solid #000'
                  }}>
                    {idx + 1}
                  </div>
                )}

                {/* Glowing Colored Ring */}
                <div style={{
                  width: '104px',
                  height: '104px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: `linear-gradient(135deg, ${childAccent} 0%, #000000 100%)`,
                  boxShadow: `0 0 12px ${childAccent}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                className="ambassador-ring"
                onMouseOver={e => {
                  e.currentTarget.style.boxShadow = `0 0 24px ${childAccent}77`;
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.boxShadow = `0 0 12px ${childAccent}20`;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                >
                  <img 
                    src={creator.avatar_url || `https://ui-avatars.com/api/?name=${creator.username}&background=random`}
                    alt={creator.username}
                    referrerPolicy="no-referrer"
                    style={{
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #000'
                    }}
                  />
                </div>
              </div>

              {/* Ambassador details */}
              <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', color: '#fff', fontWeight: 800 }}>
                @{creator.username}
              </h4>
              <p style={{ margin: 0, fontSize: '11px', color: childAccent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {shortSchool}
              </p>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                🔥 {ambassador.likes.toLocaleString()} likes
              </span>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
