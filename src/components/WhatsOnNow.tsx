import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Tv, X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

import { getLiveSchedule } from '../api';

const FALLBACK_10_YOUTUBE = [
  { id: 'fb1', title: 'Fred again.. - Boiler Room London', time: 'LIVE', image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=c0-hvjV2A5Y', tags: ['House', 'Live'] },
  { id: 'fb2', title: 'Peggy Gou - Boiler Room London', time: 'UP NEXT', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=Fa8LQLy4C5A', tags: ['Deep House', 'DJ Set'] },
  { id: 'fb3', title: 'Solomun - Boiler Room Tulum', time: '1:00 PM EST', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=bk6Xst6euQk', tags: ['Techno', 'Tulum'] },
  { id: 'fb4', title: 'Chris Stussy - Boiler Room Edinburgh', time: '2:30 PM EST', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=42XFNGZrpaQ', tags: ['Tech House', 'Live'] },
  { id: 'fb5', title: 'Ben Böhmer - Cercle Cappadocia', time: '4:00 PM EST', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=RvRhUHTV_8k', tags: ['Melodic House', 'Live'] },
  { id: 'fb6', title: 'Charli xcx - Boiler Room PARTYGIRL', time: '5:30 PM EST', image: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=rKPBq_j4buQ', tags: ['Electronic', 'Club'] },
  { id: 'fb7', title: 'ISOxo - Boiler Room Calgary', time: '7:00 PM EST', image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=3fqz-7T6Y6w', tags: ['Trap', 'EDM'] },
  { id: 'fb8', title: 'VTSS b2b KI/KI - Boiler Room Glitch', time: '8:30 PM EST', image: '/covers/shm_arena.png', video_url: 'https://www.youtube.com/watch?v=I1mhJjxtJx4', tags: ['Techno', 'B2B'] },
  { id: 'fb9', title: '3ballMTY - Boiler Room Mexico City', time: '10:00 PM EST', image: '/covers/calvin_festival.png', video_url: 'https://www.youtube.com/watch?v=9Nk9Of8XGtg', tags: ['Electronic', 'Live'] },
  { id: 'fb10', title: 'horsegiirL - Boiler Room CDMX', time: '11:00 PM EST', image: '/covers/carl_cox.png', video_url: 'https://www.youtube.com/watch?v=Q9FaUe4b0wI', tags: ['Hard Dance', 'Techno'] }
];

const WhatsOnNow: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scheduleItems, setScheduleItems] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    async function loadSchedule() {
      let finalItems = FALLBACK_10_YOUTUBE;
      try {
        const data = await getLiveSchedule();
        if (data && data.length > 0) {
          const genuineInjections = data.filter((v: any) =>
            v.video_url &&
            !v.video_url.includes('bbb.mp4') &&
            !v.video_url.includes('w3schools')
          );
          if (genuineInjections.length > 0) {
            finalItems = genuineInjections;
          }
        }
      } catch (e) {
        console.error("Failed to load live schedule", e);
      }

      const now = new Date();
      const currentStartTime = new Date(now);
      currentStartTime.setMinutes(now.getMinutes() >= 30 ? 30 : 0, 0, 0);

      const dynamicSchedule = finalItems.map((item: any, index: number) => {
        const startTime = new Date(currentStartTime.getTime() + index * 30 * 60 * 1000);
        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
        return {
          ...item,
          startTime,
          endTime,
          time: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });

      setScheduleItems(dynamicSchedule);
    }
    loadSchedule();
  }, []);

  React.useEffect(() => {
    if (activeVideo) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activeVideo]);

  React.useEffect(() => {
    if (activeVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
    }
  }, [activeVideo]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
  };

  const getYoutubeId = (url: string) => {
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (scheduleItems.length === 0) return null;

  const featured = scheduleItems[0];
  const rest = scheduleItems.slice(1);
  const accent = 'var(--accent-primary)';

  return (
    <>
      <section id="whats-on-now" style={{ padding: '40px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header — AVO style */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-primary), #ff0050)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Tv size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>Watch</h2>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Live sets, DJ mixes & performances</p>
            </div>
          </div>
          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--accent-primary)',
              boxShadow: '0 0 12px var(--accent-primary)',
              animation: 'wonPulse 2s infinite',
            }} />
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-primary)' }}>Live Now</span>
          </div>
        </div>

        {/* Featured video — large hero card */}
        {featured && (
          <div
            onClick={() => setActiveVideo(featured)}
            style={{
              position: 'relative', borderRadius: '20px', overflow: 'hidden',
              marginBottom: '24px', cursor: 'pointer', transition: 'transform 0.3s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.003)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', overflow: 'hidden' }}>
              <img src={featured.image} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, transparent 70%)' }} />
              {/* Play button */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(211,84,0,0.4)', transition: 'transform 0.2s',
                }}>
                  <Play size={28} color="#fff" fill="#fff" style={{ marginLeft: '3px' }} />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--accent-primary)', color: '#000', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {featured.tags?.[0] || 'Live'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> {featured.time}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '26px', fontWeight: 900, lineHeight: 1.2, maxWidth: '700px' }}>{featured.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#aaa', maxWidth: '600px', lineHeight: 1.5 }}>
                  {featured.tags?.join(' · ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable clips — horizontal cards */}
        {rest.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#666', margin: 0 }}>
                Up Next
              </h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => scroll('left')} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={16} /></button>
                <button onClick={() => scroll('right')} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={16} /></button>
              </div>
            </div>
            <div ref={scrollRef} style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollBehavior: 'smooth', paddingBottom: '8px', scrollbarWidth: 'none' }}>
              {rest.map(item => (
                <div
                  key={item.id}
                  onClick={() => setActiveVideo(item)}
                  style={{
                    flexShrink: 0, width: '320px', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(var(--accent-primary-rgb),0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                    <img src={item.image} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(var(--accent-primary-rgb),0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={18} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                      </div>
                    </div>
                    <span style={{ position: 'absolute', bottom: '8px', right: '8px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.8)', fontSize: '10px', fontWeight: 700, color: '#ddd' }}>
                      {item.time}
                    </span>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      {item.tags?.[0] || 'Music'} · {item.tags?.[1] || 'Live'}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.4, color: '#ccc', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ═══ Video Player Overlay ═══ */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 99999,
              background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', padding: '60px 40px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '960px', position: 'relative' }}
            >
              <button onClick={() => setActiveVideo(null)}
                style={{
                  position: 'absolute', top: '-48px', right: '0', zIndex: 10,
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <X size={16} />
              </button>
              <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
                {(() => {
                  const ytId = getYoutubeId(activeVideo.video_url || '');
                  if (ytId) {
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=0`}
                        title={activeVideo.title}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        allow="encrypted-media; fullscreen"
                        allowFullScreen
                      />
                    );
                  }
                  return (
                    <video
                      key={activeVideo.video_url}
                      ref={videoRef}
                      src={activeVideo.video_url}
                      controls
                      playsInline
                      preload="auto"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      poster={activeVideo.image}
                    >
                      <source src={activeVideo.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  );
                })()}
              </div>
              <div style={{ marginTop: '16px' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#fff' }}>{activeVideo.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{activeVideo.tags?.join(' · ')}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes wonPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
};

export default WhatsOnNow;
