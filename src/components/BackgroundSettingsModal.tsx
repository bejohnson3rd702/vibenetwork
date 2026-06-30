import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

interface BackgroundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  homepageImageUrl: string;
  setHomepageImageUrl: (url: string) => void;
  currentBgIndex: number;
  setCurrentBgIndex: (index: number) => void;
  onAddBackgroundClick: () => void;
  userId?: string;
  isNetworkLevel?: boolean;
  wlConfig?: any;
}

export const BackgroundSettingsModal: React.FC<BackgroundSettingsModalProps> = ({
  isOpen,
  onClose,
  homepageImageUrl,
  setHomepageImageUrl,
  currentBgIndex,
  setCurrentBgIndex,
  onAddBackgroundClick,
  userId,
  isNetworkLevel,
  wlConfig,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} onClick={onClose} />
          
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', color: '#fff' }}>
            <h2 style={{ margin: 0, fontSize: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Manage Channel Backgrounds
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>Upload images to cycle through in the background of your channel.</p>
            
            {homepageImageUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.div
                      key={`modal-preview-bg-${currentBgIndex}`}
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url("${homepageImageUrl.split(',')[currentBgIndex]}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  </AnimatePresence>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', zIndex: 1 }} />
                  <button type="button" onClick={onAddBackgroundClick} style={{ position: 'absolute', bottom: 12, right: 12, padding: '8px 16px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'background 0.2s', zIndex: 2 }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
                    + Add Background
                  </button>
                  <button type="button" onClick={() => {
                    const arr = homepageImageUrl.split(',').filter(Boolean);
                    arr.splice(currentBgIndex, 1);
                    const newUrls = arr.join(',');
                    setHomepageImageUrl(newUrls);
                    setCurrentBgIndex(0);
                    supabase!.from('profiles').update({ homepage_image_url: newUrls }).eq('id', userId);
                    
                    const shouldSync = (isNetworkLevel || userId === wlConfig?.owner_id) && wlConfig?.id;
                    if (shouldSync) {
                       const newHero = newUrls ? newUrls.split(',')[0] : null;
                       const currentTheme = wlConfig.theme || {};
                       supabase!.from('whitelabel_configs').update({ theme: { ...currentTheme, heroImage: newHero } }).eq('id', wlConfig.id).then();
                    }
                  }} style={{ position: 'absolute', top: 12, right: 12, padding: '6px 12px', background: 'rgba(255,0,0,0.5)', backdropFilter: 'blur(8px)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', zIndex: 2 }}>
                    Remove
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                  {homepageImageUrl.split(',').filter(Boolean).map((imgUrl, idx) => (
                    <div key={idx} onClick={() => setCurrentBgIndex(idx)} style={{ width: '80px', height: '45px', borderRadius: '6px', backgroundImage: `url("${imgUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', border: currentBgIndex === idx ? '2px solid #ff4d85' : '2px solid transparent', flexShrink: 0, opacity: currentBgIndex === idx ? 1 : 0.5, transition: '0.2s' }} />
                  ))}
                </div>
              </div>
            ) : (
              <button type="button" onClick={onAddBackgroundClick} style={{ width: '100%', padding: '40px', background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.15)', color: 'var(--text-primary)', fontSize: '15px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 'bold', marginTop: '10px' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                + Select or Generate Background Image
              </button>
            )}
            
            <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none', fontSize: '20px' }}>✕</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
