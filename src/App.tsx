import { GENRE_CATEGORIES as MOCK_CATEGORIES, ASSETS } from './data';
import { getCategoriesWithVideos } from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatsOnNow from './components/WhatsOnNow';
import SliderSection from './components/SliderSection';
import AuthModal from './components/AuthModal';
import ProfileDashboard from './components/ProfileDashboard';
import BusinessAdminDashboard from './components/BusinessAdminDashboard';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function App() {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>(MOCK_CATEGORIES);
  
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check Active Session
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for state changes (login, logout)
    supabase!.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    async function fetchDB() {
      const data = await getCategoriesWithVideos();
      if (data && data.length > 0) {
        // setCategories(data); // Temporarily bypass database to force B2B mock UI presentation
      }
    }
    fetchDB();

    const handleCommit = (e: any) => {
       setWlConfig(e.detail);
    };
    window.addEventListener('whitelabel_commit', handleCommit);
    return () => window.removeEventListener('whitelabel_commit', handleCommit);
  }, []);

  const [wlConfig, setWlConfig] = useState<any>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  if (wlConfig) {
    return (
      <Router>
        <div style={{ background: wlConfig.bg, minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
          <Navbar user={user} onLoginClick={() => {}} wlConfig={wlConfig} />
          
          <div style={{
             width: '100%', height: '80vh', 
             backgroundColor: '#000',
             display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', position: 'relative',
             textAlign: 'center', overflow: 'hidden'
          }}>
             {wlConfig.heroImage && (
               <img src={wlConfig.heroImage} alt="Generative Hero Base" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
             )}
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))', zIndex: 1 }} />
             <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
               <span style={{ background: wlConfig.accent, color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                 LIVE ON {wlConfig.domain}
               </span>
               <h1 style={{ fontSize: '80px', fontWeight: '900', margin: 0, letterSpacing: '-2px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>{wlConfig.name}</h1>
               <p style={{ fontSize: '24px', opacity: 0.9, maxWidth: '750px', fontWeight: '500', textShadow: '0 4px 10px rgba(0,0,0,0.5)', lineHeight: 1.5 }}>{wlConfig.heroCopy || 'The premiere destination for high quality digital content.'}</p>
               <button onClick={() => setShowAdminPanel(true)} style={{ padding: '16px 36px', background: '#fff', color: '#000', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '12px', marginTop: '20px', cursor: 'pointer', transition: '0.2s', boxShadow: `0 10px 30px ${wlConfig.accent}44` }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>{wlConfig.btnPrimary || 'Access Admin Dashboard'}</button>
             </div>
          </div>

          <div style={{ padding: '80px 10%', display: 'flex', flexDirection: 'column', gap: '60px', background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.5))' }}>
             
             {Array.from({ length: wlConfig.sliderCount || 4 }).map((_, slotIndex) => (
               <div key={slotIndex} style={{ display: 'flex', flexDirection: 'column', gap: '20px'}}>
                 <h2 style={{ fontSize: '32px', borderLeft: `6px solid ${wlConfig.accent}`, paddingLeft: '16px' }}>{wlConfig.name} Content Roll {slotIndex + 1}</h2>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {[1,2,3,4].map(i => (
                       <div key={i} style={{ aspectRatio: '16/9', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}>
                          <span style={{ opacity: 0.3, fontWeight: 'bold' }}>Empty Video Slot {i}</span>
                       </div>
                    ))}
                 </div>
               </div>
             ))}
             
             {wlConfig.customSections && wlConfig.customSections.toLowerCase() !== 'none' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '40px' }}>
                   {wlConfig.customSections.split(',').map((section: string, idx: number) => {
                      const title = section.trim();
                      if (!title) return null;
                      return (
                         <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
                            <h2 style={{ fontSize: '36px', color: wlConfig.accent || '#fff', margin: 0 }}>{title}</h2>
                            <p style={{ color: '#aaa', fontSize: '18px', maxWidth: '600px' }}>This is the autogenerated structural block for your requested <b>{title}</b> modular section. Connect your CMS to deploy actual structured content here.</p>
                         </div>
                      );
                   })}
                </div>
             )}
             
          </div>
          
          {showAdminPanel && (
            <BusinessAdminDashboard wlConfig={wlConfig} onClose={() => setShowAdminPanel(false)} />
          )}
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <AnimatePresence>
          {showAuthModal && (
            <AuthModal 
              onClose={() => setShowAuthModal(false)} 
              onSuccess={(u) => setUser(u)} 
            />
          )}
        </AnimatePresence>

        <Navbar user={user} onLoginClick={() => setShowAuthModal(true)} />
        
        <Routes>
          <Route path="/" element={<Home categories={categories} activeVideo={activeVideo} setActiveVideo={setActiveVideo} />} />
          <Route path="/profile" element={<ProfileDashboard user={user} />} />
          <Route path="/profile/:creatorId" element={<ProfileDashboard user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

// Separate the massive homepage into a stateless component for router cleanliness
function Home({ categories, activeVideo, setActiveVideo }: any) {
  const navigate = useNavigate();

  return (
    <>
      <Hero />
      <main style={{ background: '#000000', paddingBottom: '100px', zIndex: 10, position: 'relative', width: '100%' }}>
        
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
                alert(`App.tsx router received click payload for: ${item.title}`);
                if (item.tags && item.tags.includes('Influencer Channel')) {
                  // Force a hard redirect specifically for Influencer profiles from the Swiper slider
                  // This entirely bypasses any nested DOM event swallowing bugs from swiper/react wrapper
                  alert(`Navigating directly to /profile/${item.id}`);
                  window.location.href = `/profile/${item.id}`;
                } else {
                  setActiveVideo(item);
                }
              }}
            />
          );
        })}
        </div>

        {/* New content section below sliders */}
        <section style={{ maxWidth: '1400px', margin: '60px auto 0', padding: '0 40px' }}>
          <div className="glass-panel" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center',
            padding: '60px 20px',
            background: 'linear-gradient(135deg, rgba(255,0,85,0.05), rgba(138,43,226,0.1))'
          }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Ready to <span className="gradient-text">Vibe</span> With Us?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '32px', fontSize: '18px', lineHeight: 1.6 }}>
              Create a free account today to get exclusive access to live DJ sets, immersive VR experiences, and behind-the-scenes content from your favorite international artists.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-primary" style={{ padding: '14px 40px' }}>Join the Network</button>
              <button className="btn-secondary" style={{ padding: '14px 40px' }}>View Schedule</button>
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
                background: 'rgba(255,255,255,0.1)',
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
              style={{ width: '90%', maxWidth: '1200px', aspectRatio: '16/9', position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            >
              <video 
                src={activeVideo.videoUrl} 
                autoPlay 
                controls 
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'black' }} 
              />
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
      <footer style={{
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '60px 40px',
        textAlign: 'center'
      }}>
        <img src={ASSETS.logo} alt="Logo" style={{ height: '50px', marginBottom: '20px', opacity: 0.8 }} />
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 30px' }}>
          VIBE NETWORK TV is a global live streaming platform that offers a unique blend of content, focusing on international DJs, fashion, music, sports, lifestyle. JUST VIBE.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          <span style={{cursor: 'pointer'}}>Terms of Service</span>
          <span style={{cursor: 'pointer'}}>Privacy Policy</span>
          <span style={{cursor: 'pointer'}}>Contact Us</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '40px' }}>
          &copy; {new Date().getFullYear()} The VIBE Network. All Rights Reserved.
        </p>
      </footer>
    </>
  );
}

export default App;
