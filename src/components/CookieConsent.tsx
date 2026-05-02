import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

const CookieConsent: React.FC = () => {
  const { wlConfig } = useWhiteLabel();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vibe_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vibe_cookie_consent', 'accepted');
    setIsVisible(false);
  };
  
  const handleDecline = () => {
    // In a strict compliance environment, this might block certain analytics scripts.
    // For now, we dismiss the banner and record the preference.
    localStorage.setItem('vibe_cookie_consent', 'declined');
    setIsVisible(false);
  }

  const accentColor = wlConfig?.accent || 'var(--accent-primary)';
  const platformName = wlConfig?.name || 'Vibe Network';

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, padding: '24px', pointerEvents: 'none', display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '800px',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              pointerEvents: 'auto',
              flexWrap: 'wrap',
              position: 'relative'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${accentColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, flexShrink: 0 }}>
              <Cookie size={24} />
            </div>
            
            <div style={{ flex: '1 1 300px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Your Privacy Choices</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {platformName} uses cookies and similar technologies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexShrink: 0, marginLeft: 'auto' }}>
              <button 
                onClick={handleDecline}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--text-primary)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                Decline
              </button>
              <button 
                onClick={handleAccept}
                style={{
                  padding: '12px 24px',
                  background: accentColor,
                  border: 'none',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: `0 4px 15px ${accentColor}66`
                }}
              >
                Accept All
              </button>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
