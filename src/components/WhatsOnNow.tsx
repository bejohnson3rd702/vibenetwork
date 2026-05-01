import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import LiveChat from './LiveChat';

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
  { id: 'fb1', title: 'Start with Why - Simon Sinek', time: 'LIVE', image: 'https://image.pollinations.ai/prompt/corporate%20leader%20on%20stage%20presentation?width=800&height=600&nologo=true', video_url: 'https://www.youtube.com/watch?v=u4ZoJKF_VuA', tags: ['Leadership', 'Business'] },
  { id: 'fb2', title: 'Warren Buffett: Best Investing Advice', time: 'UP NEXT', image: 'https://image.pollinations.ai/prompt/wall%20street%20bull%20statue%20cinematic?width=800&height=600&nologo=true', video_url: 'https://www.youtube.com/watch?v=SjB-Bf3g-A0', tags: ['Finance', 'Markets'] },
  { id: 'fb3', title: 'Peter Thiel: Competition is for Losers', time: '1:00 PM EST', image: 'https://image.pollinations.ai/prompt/modern%20startup%20office%20glass%20walls?width=800&height=600&nologo=true', video_url: 'https://www.youtube.com/watch?v=3Fx5Q8xGU8k', tags: ['Startups', 'Strategy'] },
  { id: 'fb4', title: 'Steve Jobs 2007 iPhone Keynote', time: '2:30 PM EST', image: 'https://image.pollinations.ai/prompt/minimalist%20stage%20spotlight%20dark?width=800&height=600&nologo=true', video_url: 'https://www.youtube.com/watch?v=VQKMoT-6P4s', tags: ['Keynote', 'Tech'] },
  { id: 'fb5', title: 'How to Pitch a VC - Y Combinator', time: '4:00 PM EST', image: 'https://image.pollinations.ai/prompt/venture%20capital%20boardroom%20meeting?width=800&height=600&nologo=true', video_url: 'https://www.youtube.com/watch?v=pDJaT69p5pY', tags: ['Venture', 'Pitching'] },
  { id: 'fb6', title: 'Ray Dalio: Principles for Success', time: '5:30 PM EST', image: 'https://image.pollinations.ai/prompt/global%20economy%20abstract%20hologram?width=800&height=600&nologo=true', video_url: 'https://www.youtube.com/watch?v=B9XGUpQZY38', tags: ['Economy', 'Success'] },
  { id: 'fb7', title: 'Elon Musk: Advice to Entrepreneurs', time: '7:00 PM EST', image: 'https://image.pollinations.ai/prompt/futuristic%20spaceship%20factory?width=800&height=600&nologo=true', video_url: 'https://www.youtube.com/watch?v=cK2gO5LzEGE', tags: ['Innovation', 'Founder'] },
  { id: 'fb8', title: 'Bill Gates & Warren Buffett', time: '8:30 PM EST', image: 'https://image.pollinations.ai/prompt/two%20businessmen%20shaking%20hands%20silhouette?width=800&height=600&nologo=true', video_url: 'https://www.youtube.com/watch?v=iE1hGzO6y2I', tags: ['Business', 'Wealth'] },
  { id: 'fb9', title: 'Naval Ravikant: How to get rich', time: '10:00 PM EST', image: 'https://image.pollinations.ai/prompt/zen%20meditation%20modern%20home%20office?width=800&height=600&nologo=true', video_url: 'https://www.youtube.com/watch?v=1-TZqOsVCNM', tags: ['Mindset', 'Growth'] },
  { id: 'fb10', title: 'Steve Jobs: Stanford Commencement', time: '11:00 PM EST', image: 'https://image.pollinations.ai/prompt/stanford%20university%20graduates%20throwing%20caps?width=800&height=600&nologo=true', video_url: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc', tags: ['Motivation', 'Career'] }
];

const WhatsOnNow: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
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
            !v.video_url.includes('w3schools') &&
            !v.video_url.includes('.mp4')
          ).map((v: any) => {
            if (v.image && v.image.includes('unsplash.com')) {
               return { ...v, image: `https://image.pollinations.ai/prompt/corporate%20boardroom%20presentation%20cinematic?width=800&height=600&nologo=true` };
            }
            return v;
          });
          
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
      const now = new Date();
      const currentIndex = scheduleItems.findIndex(item => now >= item.startTime && now < item.endTime);
      
      if (currentIndex !== -1) {
        setActiveIndex(currentIndex);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [scheduleItems]);

  if (scheduleItems.length === 0) return null;

  return (
    <section className="px-mobile-sm py-mobile-sm" style={{ maxWidth: '1400px', margin: '80px auto 40px', padding: '0 40px' }}>
      
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
        <div className="tv-video-mobile" style={{ flex: '1 1 auto', position: 'relative', background: '#000', pointerEvents: 'auto' }}>
          {(() => {
             const activeItem = scheduleItems[activeIndex];
             const activeUrl = activeItem?.video_url || 'https://www.youtube.com/watch?v=u4ZoJKF_VuA';
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
                     style={{ border: 'none', background: '#000', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
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
                onClick={() => setActiveIndex(idx)}
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
