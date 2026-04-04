import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { ASSETS } from '../data';

const Hero: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Immersive Parallax Background Image */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${ASSETS.heroMain})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -4,
        }}
      />
      
      {/* Global Dark Overlay for Text Legibility */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)',
          zIndex: -3,
        }}
      />
      
      {/* Subtle bottom fade to blend into the main content below */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40vh',
          background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          zIndex: -1,
        }}
      />
      
      <div style={{ width: '100%', maxWidth: '1200px', padding: '0 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.h4 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '8px', marginBottom: '24px', fontSize: '13px', fontWeight: 900 }}
          >
            The Ultimate White Label Architecture
          </motion.h4>
          
          <h1 style={{ fontSize: 'clamp(80px, 8vw, 140px)', lineHeight: 0.9, marginBottom: '24px', letterSpacing: '-4px', fontWeight: 900, textTransform: 'uppercase' }}>
            <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '2px white' }}>VIBE</span>
            <span style={{ display: 'block', color: 'var(--accent-primary)' }}>NETWORK</span>
          </h1>
          
          <p style={{ fontSize: '22px', color: 'white', fontWeight: 400, marginBottom: '50px', lineHeight: 1.6, maxWidth: '750px', margin: '0 auto 50px' }}>
            Launch your own fully branded, monetized streaming platform in minutes. Advanced generative AI deployments and global content delivery.
          </p>
          
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <motion.button 
              onClick={() => document.getElementById('whats-on-now')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0' }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 48px', 
                fontSize: '15px', 
                fontWeight: 800,
                textTransform: 'uppercase', 
                letterSpacing: '2px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(255,255,255,0.2)'
              }}
            >
              <Play fill="black" size={20} />
              Watch Live Now
            </motion.button>
            
            <motion.button 
              onClick={() => document.getElementById('slider-section-container')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 48px', 
                fontSize: '15px', 
                fontWeight: 800,
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                background: 'rgba(255,255,255,0.05)', 
                backdropFilter: 'blur(12px)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50px',
                cursor: 'pointer'
              }}
            >
              More Info
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
