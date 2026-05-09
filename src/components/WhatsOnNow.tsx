import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

import { getLiveSchedule } from '../api';

const ScheduleRow: React.FC<{ item: any, isActive: boolean, onClick: () => void }> = ({ item, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        gap: '16px',
        cursor: 'pointer',
        background: isActive ? 'var(--bg-surface-hover)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
        transition: 'all 0.2s ease',
        borderBottom: '1px solid rgba(255,255,255,0.02)'
      }}
      onMouseOver={(e) => {
        if (!isActive) e.currentTarget.style.background = 'var(--bg-surface-hover)';
      }}
      onMouseOut={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
      }}
    >
      <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        <img src={item.image} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {isActive && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(211,84,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Play fill="white" size={20} />
          </div>
        )}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)', fontSize: '12px', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {isActive ? 'Live Now' : item.time}
        </div>
        <h4 style={{ fontSize: '15px', margin: 0, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.title}
        </h4>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {item.tags[0]} • {item.tags[1] || 'Music'}
        </div>
      </div>
    </div>
  );
};

const FALLBACK_10_YOUTUBE = [
  { id: 'fb1', title: 'Kaytranada - Boiler Room Montreal (House/Hip Hop)', time: 'LIVE', image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=-5s1q7RhsME', tags: ['House', 'Live Set'] },
  { id: 'fb2', title: 'Metro Boomin - Live at Coachella (Hip Hop Mix)', time: 'UP NEXT', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=O1R1B0n-sGE', tags: ['Hip Hop', 'Festival'] },
  { id: 'fb3', title: 'Peggy Gou - Sunset Deep House Set', time: '1:00 PM EST', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=7M1rO6p-U30', tags: ['Deep House', 'Sunset'] },
  { id: 'fb4', title: 'DJ Snake - Ultra Miami Main Stage', time: '2:30 PM EST', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=pC3bK6wZJ9c', tags: ['EDM', 'Main Stage'] },
  { id: 'fb5', title: 'Fred Again.. - Studio Live Session', time: '4:00 PM EST', image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=c0-hvjV2A5Y', tags: ['Electronic', 'Studio'] },
  { id: 'fb6', title: 'DJ Khaled - Hip Hop All Stars Mix', time: '5:30 PM EST', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=2v-k90l6OqM', tags: ['Hip Hop', 'Anthems'] },
  { id: 'fb7', title: 'Carl Cox - Ibiza Residency (Techno/House)', time: '7:00 PM EST', image: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=yW6bYk8pGvE', tags: ['Techno', 'Ibiza'] },
  { id: 'fb8', title: 'Black Coffee - Rooftop House Set', time: '8:30 PM EST', image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=zJvH20F63Yc', tags: ['Afro House', 'Rooftop'] },
  { id: 'fb9', title: 'Travis Scott - Cactus Jack Mix', time: '10:00 PM EST', image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f275bd?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=uJ_1HMmZtcQ', tags: ['Rap', 'Concert'] },
  { id: 'fb10', title: 'David Guetta - Afterhours Club Mix', time: '11:00 PM EST', image: 'https://images.unsplash.com/photo-1558369178-6656d78216fc?auto=format&fit=crop&w=800&q=80', video_url: 'https://www.youtube.com/watch?v=Q74z7E7k-zI', tags: ['House', 'Club'] }
];

const WhatsOnNow: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userManuallySelected, setUserManuallySelected] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<any[]>([]);

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
      // Start the schedule from the current hour or half-hour slot
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
      
      const initialIndex = dynamicSchedule.findIndex((item: any) => now >= item.startTime && now < item.endTime);
      if (initialIndex !== -1) {
        setActiveIndex(initialIndex);
      }
    }
    loadSchedule();
  }, []);

  React.useEffect(() => {
    if (scheduleItems.length === 0 || !scheduleItems[0].startTime) return;

    const interval = setInterval(() => {
      if (userManuallySelected) return;
      const now = new Date();
      const currentIndex = scheduleItems.findIndex(item => now >= item.startTime && now < item.endTime);
      
      if (currentIndex !== -1 && currentIndex !== activeIndex) {
        setActiveIndex(currentIndex);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [scheduleItems, userManuallySelected, activeIndex]);

  if (scheduleItems.length === 0) return null;

  return (
    <section id="whats-on-now" className="px-mobile-sm py-mobile-sm" style={{ maxWidth: '1400px', margin: '80px auto 40px', padding: '0 40px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: 0
        }}>
          <span style={{ 
            width: '12px', 
            height: '12px', 
            background: 'var(--accent-primary)', 
            borderRadius: '50%',
            boxShadow: '0 0 15px var(--accent-primary)',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>LIVE NOW</span>
        </h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="tv-dashboard-mobile"
        style={{ 
          display: 'flex', 
          width: '100%', 
          height: '650px', 
          background: 'var(--bg-color)',
          borderRadius: '24px', 
          overflow: 'hidden',
          border: '1px solid var(--bg-surface-hover)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.2)'
        }}
      >
        <div className="tv-video-mobile" style={{ flex: '1 1 auto', position: 'relative', background: 'var(--bg-color)', pointerEvents: 'auto' }}>
          {(() => {
             const activeItem = scheduleItems[activeIndex];
             const activeUrl = activeItem?.video_url || 'https://www.youtube.com/watch?v=jfKfPfyJRdk';
             const youtubeMatch = activeUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
             const youtubeId = (youtubeMatch && youtubeMatch[2].length === 11) ? youtubeMatch[2] : null;

             if (youtubeId) {
                return (
                   <iframe 
                     key={youtubeId}
                     width="100%" 
                     height="100%" 
                     src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${youtubeId}&controls=1`} 
                     title={`${activeItem?.title || 'YouTube Player'}`} 
                     frameBorder="0" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                     allowFullScreen
                     style={{ border: 'none', background: 'var(--bg-color)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                   />
                );
             }

             return (
               <video 
                 key={activeUrl}
                 src={activeUrl.replace('http://', 'https://')}
                 poster={activeItem?.image}
                 muted 
                 controls
                 autoPlay
                 loop 
                 playsInline
                 style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
               />
             );
          })()}
          
          {/* ON AIR overlay removed 
           <div style={{ 
              position: 'absolute', 
              top: '30px', 
              left: '30px', 
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              padding: '8px 16px', 
              borderRadius: '8px', 
              fontSize: '13px', 
              fontWeight: 800,
              letterSpacing: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              zIndex: 20
          }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%' }}></span>
            ON AIR
          </div>
          */}
        </div>

        {/* <div className="tv-chat-mobile" style={{ flexShrink: 0, background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
          <LiveChat streamId={scheduleItems[activeIndex]?.id || 'main-stage'} />
        </div> */}

        <div className="tv-guide-mobile" style={{ 
          width: '380px', 
          flexShrink: 0, 
          background: 'var(--bg-surface)', 
          borderLeft: '1px solid var(--bg-surface-hover)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            padding: '30px 24px', 
            borderBottom: '1px solid var(--bg-surface-hover)',
            background: 'var(--bg-surface-hover)'
          }}>
            <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 700, letterSpacing: '1px' }}>Global Schedule</h3>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Live Enterprise Broadcasts</p>
          </div>
          
          <div className="custom-schedule-scroll" style={{ 
            flex: 1, 
            overflowY: 'auto'
          }}>
            {scheduleItems.map((item: any, idx: number) => (
              <ScheduleRow 
                key={item.id} 
                item={item} 
                isActive={activeIndex === idx}
                onClick={() => {
                  setActiveIndex(idx);
                  setUserManuallySelected(true);
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .custom-schedule-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-schedule-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-schedule-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-schedule-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
};

export default WhatsOnNow;
