import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import WhatsOnNow from '../components/WhatsOnNow';
import SliderSection from '../components/SliderSection';
import type { Category, VideoItem, User } from '../types';

const LiveChat = lazy(() => import('../components/LiveChat'));

interface HomeProps {
  categories: Category[];
  activeVideo: VideoItem | null;
  setActiveVideo: (video: VideoItem | null) => void;
  user: User | null;
}

export default function Home({ categories, activeVideo, setActiveVideo, user }: HomeProps) {
  // const navigate = useNavigate();

  return (
    <>
      <Hero />
      <main style={{ background: 'var(--bg-color)', paddingBottom: '100px', zIndex: 10, position: 'relative', width: '100%' }}>
        
        <div id="whats-on-now">
          <WhatsOnNow />
        </div>

        <div id="slider-section-container">
          {categories.map((category: any, index: number) => {
            const isArtist = category.aspectRatio === '3/4' || category.title.includes('Artist');
          const ratio = isArtist ? '3/4' : '16/9';
          const multiplier = 1; 
          return (
            <SliderSection 
              key={category.title} 
              title={category.title} 
              items={category.items} 
              delay={index * 0.2}
              aspectRatio={ratio}
              sizeMultiplier={multiplier}
              onItemClick={(item) => {
                if (item.linkUrl) {
                  window.location.href = item.linkUrl + window.location.search;
                } else if (item.tags && item.tags.includes('Influencer Channel')) {
                  // Force a hard redirect specifically for Influencer profiles from the Swiper slider
                  // This entirely bypasses any nested DOM event swallowing bugs from swiper/react wrapper
                  window.location.href = `/profile/${item.id}${window.location.search}`;
                } else {
                  setActiveVideo(item);
                }
              }}
            />
          );
        })}
        </div>

        {/* New content section below sliders */}
        <section style={{ maxWidth: '1400px', margin: '100px auto 40px', padding: '0 40px' }}>
          <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #000 0%, transparent 100%)', zIndex: 1 }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=60")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3, filter: 'brightness(0.6)', zIndex: 0 }} />
            <div style={{ position: 'absolute', right: '-10%', top: '-50%', width: '500px', height: '500px', background: 'var(--accent-primary)', filter: 'blur(150px)', opacity: 0.2, zIndex: 0, borderRadius: '50%' }} />
            
            <div className="px-mobile-sm py-mobile-sm" style={{ position: 'relative', zIndex: 2, padding: '80px 60px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
              <div style={{ padding: '6px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', display: 'inline-block', marginBottom: '24px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Vibe Enterprise Networks</div>
              <h2 className="hero-title-mobile" style={{ fontSize: '56px', fontWeight: 900, marginBottom: '20px', lineHeight: 1.1, letterSpacing: '-1px' }}>Ready to Scale Your<br/><span style={{ color: 'var(--accent-primary)' }}>Architecture</span>?</h2>
              <p className="hero-sub-mobile" style={{ color: 'var(--text-secondary)', maxWidth: '550px', marginBottom: '40px', fontSize: '18px', lineHeight: 1.6 }}>
                Create an administrative account today to instantly provision high-end corporate streaming platforms, global architecture networks, and executive live-broadcast tools.
              </p>
              <div className="flex-col-mobile" style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <button className="mobile-w-full" onClick={() => user ? (window.location.href = '/profile') : window.dispatchEvent(new CustomEvent('open_auth', { detail: { isLogin: false, role: 'business' } }))} style={{ padding: '18px 40px', background: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,255,255,0.2)' }}>{user ? 'Go to Network Dashboard' : 'Create Network'}</button>
                <button className="mobile-w-full" onClick={() => user ? (window.location.href = '/profile') : window.dispatchEvent(new CustomEvent('open_auth', { detail: { isLogin: false, role: 'influencer' } }))} style={{ padding: '18px 40px', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>{user ? 'Go to Profile' : 'Create a Profile'}</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Video Player Overlay */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(5, 5, 5, 0.95)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <button 
              onClick={() => setActiveVideo(null)}
              style={{
                position: 'absolute',
                top: '40px',
                right: '40px',
                background: 'var(--bg-surface-hover)',
                border: 'none',
                color: 'white',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={28} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{ width: '90%', maxWidth: '1400px', height: '70vh', position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex' }}
            >
              <div style={{ flex: 1, height: '100%' }}>
              {(() => {
                const match = activeVideo.videoUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
                const ytId = (match && match[2].length === 11) ? match[2] : null;
                if (ytId) {
                  return (
                    <iframe 
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                      title={activeVideo.title}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay; encrypted-media; fullscreen"
                      allowFullScreen
                      loading="lazy"
                    />
                  );
                }
                return (
                  <video 
                    src={activeVideo.videoUrl} 
                    autoPlay 
                    controls 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'black' }} 
                  />
                );
              })()}
              </div>
              {/* Chat Pane */}
              <div style={{ flexShrink: 0, background: 'var(--bg-color)', borderRadius: '0 16px 16px 0', overflow: 'hidden' }}>
                 <Suspense fallback={<div style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading chat...</div>}>
                   <LiveChat streamId={activeVideo.id || 'global'} />
                 </Suspense>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '24px', textAlign: 'center' }}
            >
              <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>{activeVideo.title}</h2>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {activeVideo.tags.map((tag: string) => (
                  <span key={tag} style={{ color: 'var(--accent-primary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Blur Orbs */}
      <div style={{
        position: 'fixed',
        top: '20%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'rgba(255,255,255,0.03)',
        filter: 'blur(150px)',
        borderRadius: '50%',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '25%',
        width: '400px',
        height: '400px',
        background: 'var(--accent-primary)',
        filter: 'blur(250px)',
        opacity: 0.05,
        borderRadius: '50%',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Premium Footer */}
      <footer style={{ background: 'var(--bg-color)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '80px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', opacity: 0.3 }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
           <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900, letterSpacing: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
             <span style={{ fontSize: '32px', color: 'var(--accent-primary)' }}>V</span> VIBE NETWORK
           </h2>
           <div style={{ display: 'flex', gap: '40px', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
             <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Architecture</span>
             <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Pricing</span>
             <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Scale Networks</span>
             <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Documentation</span>
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '40px' }}>&copy; 2026 Vibe Media Networks LLC. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
