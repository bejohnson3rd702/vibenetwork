import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { SCHEDULE_ITEMS as LOCAL_SCHEDULE_ITEMS, MOCK_VIDEO } from '../data';
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
        background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
        transition: 'all 0.2s ease',
        borderBottom: '1px solid rgba(255,255,255,0.02)'
      }}
      onMouseOver={(e) => {
        if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
      }}
      onMouseOut={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
      }}
    >
      <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {isActive && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(229,9,20,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Play fill="white" size={20} />
          </div>
        )}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)', fontSize: '12px', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {isActive ? 'Live Now' : item.time}
        </div>
        <h4 style={{ fontSize: '15px', margin: 0, color: isActive ? '#fff' : 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.title}
        </h4>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
          {item.tags[0]} • {item.tags[1] || 'Music'}
        </div>
      </div>
    </div>
  );
};

const WhatsOnNow: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scheduleItems, setScheduleItems] = useState<any[]>(LOCAL_SCHEDULE_ITEMS);

  React.useEffect(() => {
    async function loadSchedule() {
      const data = await getLiveSchedule();
      if (data && data.length > 0) {
        setScheduleItems(data);
      }
    }
    loadSchedule();
  }, []);

  if (scheduleItems.length === 0) return null;

  return (
    <section style={{ maxWidth: '1400px', margin: '80px auto 40px', padding: '0 40px' }}>
      
      {/* Sleek Subdued Header */}
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
          <span style={{ color: 'white', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Live Network</span>
        </h2>
      </div>

      {/* Unified TV Dashboard Console */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ 
          display: 'flex', 
          width: '100%', 
          height: '650px', 
          background: '#050505',
          borderRadius: '24px', 
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
        }}
      >
        {/* Left Side: Video Player */}
        <div style={{ flex: '1 1 auto', position: 'relative', background: '#000' }}>
          <video 
            src={MOCK_VIDEO}
            poster={scheduleItems[activeIndex]?.image}
            muted 
            controls
            autoPlay={activeIndex === 0}
            loop 
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          {/* Subtle Live Badge Overlay */}
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
              border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%' }}></span>
            ON AIR
          </div>
        </div>

        {/* Right Side: Channel Guide / Up Next */}
        <div style={{ 
          width: '380px', 
          flexShrink: 0, 
          background: '#0a0a0a', 
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Guide Header */}
          <div style={{ 
            padding: '30px 24px', 
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 700, letterSpacing: '1px' }}>Programming</h3>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Today's Live Schedule</p>
          </div>
          
          {/* Guide List */}
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
