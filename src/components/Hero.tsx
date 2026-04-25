import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { ASSETS } from '../data';

const Hero: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', overflow: 'hidden' }}>
      
      {/* Dynamic Cinematic Background Layer */}
      <motion.img 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        src={ASSETS.heroMain}
        alt="B2B Corporate Master"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'brightness(0.5) contrast(1.2)'
        }}
      />
      
      {/* Sleek Mesh Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(2,2,2,0.95) 0%, rgba(2,2,2,0.4) 50%, rgba(2,2,2,0.95) 100%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% -20%, rgba(184, 41, 234, 0.25), transparent 70%)', zIndex: 1, mixBlendMode: 'screen' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, #000000 100%)', zIndex: 1 }} />
      
      {/* Floating Orbital Glow */}
      <motion.div 
        animate={{ filter: ['blur(100px)', 'blur(140px)', 'blur(100px)'], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '10%', right: '15%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--accent-primary)', opacity: 0.15, zIndex: 1 }}
      />
      
      <div className="px-mobile-sm" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1200px', padding: '0 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Sleek Top Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ padding: '8px 24px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
            The Ultimate White Label Architecture
          </span>
        </motion.div>
        
        {/* Main Sleek Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h1 style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
            <span style={{ 
              fontSize: 'clamp(80px, 12vw, 160px)', 
              fontWeight: 900, 
              letterSpacing: '-4px', 
              color: '#ffffff',
              textShadow: '0 20px 50px rgba(0,0,0,0.5)',
              background: 'linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.5))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              VIBE
            </span>
            <span style={{ 
              fontSize: 'clamp(24px, 4vw, 40px)', 
              fontWeight: 700, 
              letterSpacing: '16px', 
              color: 'var(--accent-primary)', 
              transform: 'translateY(-10px)',
              textShadow: '0 10px 20px rgba(184, 41, 234, 0.4)'
            }}>
              NETWORK
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{ 
              fontSize: '20px', 
              color: 'rgba(255,255,255,0.6)', 
              fontWeight: 400, 
              lineHeight: 1.6, 
              maxWidth: '650px', 
              margin: '30px auto 50px' 
            }}
          >
            Launch your own fully branded, monetized streaming platform in minutes. Advanced generative AI deployments and global content delivery.
          </motion.p>
          
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
                background: 'var(--accent-primary)', color: '#ffffff', border: 'none', borderRadius: '14px',
                cursor: 'pointer', boxShadow: '0 10px 30px rgba(184, 41, 234, 0.4)', transition: 'all 0.3s ease'
              }}
            >
              <Play fill="white" size={18} />
              Watch Live Now
            </motion.button>
            
            {/* Secondary Glass Button */}
            <motion.button 
              onClick={() => document.getElementById('slider-section-container')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 40px', 
                fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', 
                background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.3s ease'
              }}
            >
              More Info
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
