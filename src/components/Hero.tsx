import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWhiteLabel } from '../context/WhiteLabelContext';

const VIBE_HERO_SLIDES = [
  { 
    title: 'Entertainment', 
    short: 'Entertainment', 
    subtitle: 'LATEST LIVE SETS & SHOWS', 
    copy: 'Experience top DJ sets, live concerts, and exclusive music releases streaming 24/7 on the network.', 
    image: '/n2n/vibe_entertainment.png' 
  },
  { 
    title: 'News', 
    short: 'News', 
    subtitle: 'GLOBAL REPORTS & UPDATES', 
    copy: 'Get real-time updates, deep-dive investigative journalism, and breaking stories from around the globe.', 
    image: '/n2n/vibe_newsroom.png' 
  },
  { 
    title: 'Sports', 
    short: 'Sports', 
    subtitle: 'LIVE ACTION & EXPERT ANALYSIS', 
    copy: 'Catch game highlights, athlete interviews, and live coverage of collegiate and professional sports.', 
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    title: 'Money', 
    short: 'Money', 
    subtitle: 'FINANCIAL INSIGHTS & MARKETS', 
    copy: 'Stay ahead with market analytics, personal finance tips, and investment strategies from leading experts.', 
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200' 
  }
];

const Hero: React.FC = () => {
  const { wlConfig } = useWhiteLabel();
  const accent = wlConfig?.accent || 'var(--accent-primary)';
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % VIBE_HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleActionClick = () => {
    const section = document.getElementById('whats-on-now');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="vibe-hero-container" style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#000', overflow: 'hidden' }}>
      
      {/* Full-bleed hero slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={heroSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <img
            src={VIBE_HERO_SLIDES[heroSlide % VIBE_HERO_SLIDES.length]?.image}
            alt={VIBE_HERO_SLIDES[heroSlide % VIBE_HERO_SLIDES.length]?.title}
            className="vibe-hero-image"
            loading="eager"
            fetchPriority="high"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom gradient */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 85%, #000 100%)' }} />

      {/* Hero text overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={heroSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="vibe-hero-text-overlay"
          style={{ position: 'absolute', bottom: '180px', left: '0', zIndex: 2, padding: '0 60px', maxWidth: '700px' }}
        >
          <p className="vibe-hero-subtitle" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
            {VIBE_HERO_SLIDES[heroSlide % VIBE_HERO_SLIDES.length]?.subtitle}
          </p>
          <h1 className="vibe-hero-title" style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1px', color: '#fff', margin: '0 0 16px 0', textTransform: 'uppercase', fontFamily: "'RNS Miles', sans-serif" }}>
            {VIBE_HERO_SLIDES[heroSlide % VIBE_HERO_SLIDES.length]?.title}
          </h1>
          <p className="vibe-hero-copy" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            {VIBE_HERO_SLIDES[heroSlide % VIBE_HERO_SLIDES.length]?.copy}
          </p>
          <button
            onClick={handleActionClick}
            className="vibe-hero-button"
            style={{
              display: 'inline-block', padding: '13px 40px', fontSize: '11px', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '2.5px',
              background: 'transparent', color: '#fff',
              border: '1.5px solid #fff', cursor: 'pointer',
              transition: 'all 0.25s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#000';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#fff';
            }}
          >
            Watch Now
          </button>

          {/* Legacy stat panel */}
          <div className="vibe-hero-stat-panel" style={{
            marginTop: '32px', padding: '16px 24px',
            borderLeft: `3px solid ${accent}`,
            background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
          }}>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1.2 }}>
              24/7 Live<span style={{ color: accent }}>+</span>
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Entertainment, News, Sports & Finance Streams
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide dots — right side, vertical */}
      <div className="vibe-hero-dots" style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {VIBE_HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setHeroSlide(i)}
            style={{
              width: '10px', height: heroSlide === i ? '28px' : '10px',
              borderRadius: '5px', border: 'none', cursor: 'pointer',
              background: heroSlide === i ? '#fff' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s', padding: 0,
            }}
          />
        ))}
      </div>

      {/* Bottom collection bar — category thumbnails */}
      <div className="vibe-hero-bar" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
        padding: '0', display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {VIBE_HERO_SLIDES.map((slide, i) => (
          <button
            key={i}
            onClick={() => setHeroSlide(i)}
            className="vibe-hero-bar-btn"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px 8px', gap: '0', border: 'none',
              background: heroSlide === i ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderBottom: heroSlide === i ? '2px solid #fff' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.25s',
              flexDirection: 'column',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseOut={e => { e.currentTarget.style.background = heroSlide === i ? 'rgba(255,255,255,0.08)' : 'transparent'; }}
          >
            <span className="vibe-hero-bar-text" style={{
              fontSize: '10px', fontWeight: 800, color: heroSlide === i ? '#fff' : 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '1.5px',
              transition: 'color 0.25s', whiteSpace: 'nowrap',
            }}>
              {slide.short}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
};

export default Hero;
