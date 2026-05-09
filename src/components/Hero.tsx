import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { ASSETS } from '../data';
import { useWhiteLabel } from '../context/WhiteLabelContext';

const Hero: React.FC = () => {
  const { wlConfig } = useWhiteLabel();
  const [showVideoTitle, setShowVideoTitle] = useState(true);

  useEffect(() => {
    if (wlConfig?.heroLayoutMode === 'video' && wlConfig?.heroVideoTitle) {
      const timer = setTimeout(() => setShowVideoTitle(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [wlConfig?.heroLayoutMode, wlConfig?.heroVideoTitle]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', overflow: 'hidden' }}>
      
      {/* Dynamic Background */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${wlConfig?.heroImage || ASSETS.heroMain})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3) saturate(1.3) contrast(1.1)' }} />
      </motion.div>
      
      {/* Darkening filter applied directly to image for sharp readability without soft overlays */}
      
      <div className="px-mobile-sm" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1200px', padding: '0 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Sleek Top Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: `1px solid ${wlConfig?.accent || 'rgba(255,255,255,0.08)'}66`, borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '40px', boxShadow: `0 0 20px ${wlConfig?.accent || 'rgba(255,255,255,0.1)'}33` }}
        >
          <Sparkles size={16} color={wlConfig?.accent || 'var(--accent-primary)'} style={{ filter: `drop-shadow(0 0 8px ${wlConfig?.accent || 'var(--accent-primary)'})` }} />
          <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
            The Ultimate White Label Architecture
          </span>
        </motion.div>
        
        {/* Massive 3D Typography */}
        <motion.h1 
          className="hero-title-mobile"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ 
            fontSize: '95px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-3px', color: 'var(--text-primary)',
            margin: '0 0 24px 0', textShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}
        >
          {wlConfig?.name ? (
            <>Welcome to<br/> <span style={{ backgroundImage: `linear-gradient(135deg, #fff 0%, ${wlConfig?.accent || 'var(--accent-primary)'} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>{wlConfig.name}</span></>
          ) : (
            <>Step Into The<br/> <span style={{ backgroundImage: `linear-gradient(135deg, #fff 0%, ${wlConfig?.accent || 'var(--accent-primary)'} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>New Dimension</span></>
          )}
        </motion.h1>
        
        {(!wlConfig?.heroLayoutMode || wlConfig.heroLayoutMode === 'verbiage') && (
          <>
            <motion.p 
              className="hero-sub-mobile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ 
                fontSize: '24px', color: 'rgba(255,255,255,0.8)', maxWidth: '850px', 
                margin: '0 0 40px 0', lineHeight: 1.6, fontWeight: 400, textShadow: '0 10px 20px rgba(0,0,0,0.8)'
              }}
            >
              {wlConfig?.heroCopy || "The highest fidelity, ultra-low latency broadcasting architecture built exclusively for global corporate brands, creators, and enterprise media."}
            </motion.p>

          </>
        )}

        {wlConfig?.heroLayoutMode === 'video' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ width: '100%', maxWidth: '800px', minHeight: '300px', margin: '0 auto 50px', borderRadius: '24px', overflow: 'hidden', border: `1px solid ${wlConfig.accent || '#fff'}44`, boxShadow: `0 20px 50px ${wlConfig.accent || '#fff'}33`, aspectRatio: '16/9', background: '#000', position: 'relative' }}
          >
             <AnimatePresence>
               {wlConfig?.heroVideoTitle && showVideoTitle && (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 50 }}
                   transition={{ duration: 0.8 }}
                   style={{ 
                     position: 'absolute', top: 24, left: 24, zIndex: 10, 
                     background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4))', 
                     backdropFilter: 'blur(20px)', padding: '12px 24px', 
                     borderRadius: '16px', border: `1px solid ${wlConfig?.accent || 'var(--accent-primary)'}55`,
                     borderLeft: `4px solid ${wlConfig?.accent || 'var(--accent-primary)'}`,
                     boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
                     display: 'flex', alignItems: 'center', gap: '14px'
                   }}
                 >
                   <motion.div 
                     animate={{ opacity: [1, 0.3, 1] }} 
                     transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} 
                     style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff3366', boxShadow: '0 0 12px #ff3366' }} 
                   />
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                     <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px', fontWeight: 700 }}>Now Playing</span>
                     <h3 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{wlConfig.heroVideoTitle}</h3>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
             {(() => {
                const url = wlConfig.heroVideoUrl || '';
                const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
                const ytId = (match && match[2].length === 11) ? match[2] : null;
                
                if (ytId) {
                  return (
                    <iframe 
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=1`}
                      title="Welcome Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                    />
                  );
                } else if (url && (url.includes('supabase.co') || url.endsWith('.mp4') || url.endsWith('.webm') || url.startsWith('http'))) {
                  return (
                    <video 
                      src={url}
                      controls
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                    />
                  );
                }
                
                return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Invalid or missing video URL</div>;
             })()}
          </motion.div>
        )}

        {wlConfig?.heroLayoutMode === 'slider' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ width: '100%', maxWidth: '1000px', margin: '0 auto 50px', display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}
          >
             {[1, 2, 3].map(i => (
                <div key={i} style={{ minWidth: '300px', flex: 1, aspectRatio: '16/9', borderRadius: '20px', background: `linear-gradient(45deg, #111, #222)`, border: `1px solid ${wlConfig.accent || '#fff'}22`, position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                   <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-${1550751827 + i}?auto=format&fit=crop&w=600&q=80')`, backgroundSize: 'cover', opacity: 0.5 }} />
                   <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Play fill="white" size={24} />
                      </div>
                   </div>
                </div>
             ))}
          </motion.div>
        )}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex-col-mobile gap-mobile-sm" 
            style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}
          >
            {/* Primary Sleek Button */}
            <motion.button 
              onClick={() => document.getElementById('whats-on-now')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 40px', 
                fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px',
                background: wlConfig?.accent || 'var(--accent-primary)', color: 'var(--text-primary)', border: 'none', borderRadius: '14px',
                cursor: 'pointer', boxShadow: `0 10px 30px ${wlConfig?.accent ? wlConfig.accent + '66' : 'rgba(211, 84, 0, 0.4)'}`, transition: 'all 0.3s ease'
              }}
            >
              <Play fill="white" size={18} />
              Watch Live Now
            </motion.button>
            
            {/* Secondary Glass Button */}
            <motion.button 
              onClick={() => window.location.href = `/more-info${window.location.search}`}
              whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 40px', 
                fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', 
                background: 'rgba(100,100,100,0.1)', backdropFilter: 'blur(10px)', color: 'var(--text-primary)',
                border: '1px solid rgba(100,100,100,0.2)', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.3s ease'
              }}
            >
              More Info
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
      </div>
    </div>
  );
};

export default Hero;
