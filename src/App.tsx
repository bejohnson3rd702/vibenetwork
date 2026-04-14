import { GENRE_CATEGORIES as MOCK_CATEGORIES, ASSETS } from './data';
import { getCategoriesWithVideos } from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatsOnNow from './components/WhatsOnNow';
import SliderSection from './components/SliderSection';
import AuthModal from './components/AuthModal';
import ProfileDashboard from './components/ProfileDashboard';
import BusinessAdminDashboard from './components/BusinessAdminDashboard';
import EndUserAuthModal from './components/EndUserAuthModal';
import MasterAdminDashboard from './components/MasterAdminDashboard';
import LiveChat from './components/LiveChat';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function App() {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>(MOCK_CATEGORIES);
  
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [wlConfig, setWlConfig] = useState<any>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showEndUserAuthModal, setShowEndUserAuthModal] = useState(false);

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



    const handleCommit = async (e: any) => {
       setWlConfig(e.detail);
       // Persist to database
       try {
         await supabase!.from('whitelabel_configs').upsert({
           id: e.detail.id,
           name: e.detail.name,
           domain: e.detail.domain,
           accent: e.detail.accent,
           bg: e.detail.bg,
           hero_copy: e.detail.heroCopy,
           btn_primary: e.detail.btnPrimary,
           slider_count: e.detail.sliderCount,
           custom_sections: e.detail.customSections,
           hero_image: e.detail.heroImage
         });
       } catch (err) {
         console.error('Failed to sync whitelabel config', err);
       }
    };
    window.addEventListener('whitelabel_commit', handleCommit);
    return () => window.removeEventListener('whitelabel_commit', handleCommit);
  }, []);

  // Load latest whitelabel config from DB on load, matching domain
  useEffect(() => {
    async function initPlatform() {
      const hostname = window.location.hostname;
      const urlParams = new URLSearchParams(window.location.search);
      const forceTenant = urlParams.get('tenant');

      let query = supabase!.from('whitelabel_configs').select('*');
      let isTenant = false;
      let loadedTenantId = undefined;

      if (forceTenant) {
        query = query.eq('id', forceTenant).limit(1);
        isTenant = true;
      } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        query = query.eq('domain', hostname).limit(1);
        isTenant = true;
      }

      if (isTenant) {
        const { data } = await query;
        if (data && data.length > 0) {
          const dbConf = data[0];
          loadedTenantId = dbConf.id;
          setWlConfig({
             id: dbConf.id,
             name: dbConf.name || 'Vibe B2B Enterprise',
             domain: dbConf.domain || 'vibenetwork.tv',
             accent: dbConf.accent || '#0055ff',
             bg: dbConf.bg || '#050505',
             heroCopy: dbConf.hero_copy,
             btnPrimary: dbConf.btn_primary,
             sliderCount: dbConf.slider_count || 4,
             customSections: dbConf.custom_sections || 'Platform Architecture,Success Stories',
             heroImage: dbConf.hero_image,
             logoImage: dbConf.logo_url || dbConf.navbar_logo || dbConf.logo_image || null
          });
        }
      }

      const freshCategories = await getCategoriesWithVideos(loadedTenantId);
      if (freshCategories && freshCategories.length > 0) {
        setCategories(freshCategories);
      }
    }
    initPlatform();
  }, []);

  if (wlConfig) {
    return (
      <Router>
        <div style={{ background: wlConfig.bg, minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
          <Navbar user={user} onLoginClick={() => setShowEndUserAuthModal(true)} onAdminClick={() => setShowAdminPanel(true)} wlConfig={wlConfig} />
          
          <div style={{
             width: '100%', height: '80vh', 
             backgroundColor: '#000',
             display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', position: 'relative',
             textAlign: 'center', overflow: 'hidden'
          }}>
             <img src={wlConfig.heroImage || `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000`} alt="Generative Hero Base" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, filter: 'brightness(0.6)' }} />
             <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.4), ${wlConfig.bg || '#050505'})`, zIndex: 1 }} />
             <div className="px-mobile-sm py-mobile-sm" style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
               <h1 className="hero-title-mobile" style={{ fontSize: '80px', fontWeight: '900', margin: 0, letterSpacing: '-2px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>{wlConfig.name}</h1>
               <p className="hero-sub-mobile" style={{ fontSize: '24px', opacity: 0.9, maxWidth: '750px', fontWeight: '500', textShadow: '0 4px 10px rgba(0,0,0,0.5)', lineHeight: 1.5 }}>{wlConfig.heroCopy || 'The premiere destination for high quality digital content.'}</p>
             </div>
          </div>

          <div className="px-mobile-sm py-mobile-sm" style={{ padding: '80px 10%', display: 'flex', flexDirection: 'column', gap: '60px', background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.5))' }}>
             
             <div className="mobile-w-full no-margin-mobile" style={{ position: 'relative', width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
               {categories.map((category: any, index: number) => {
                 const isArtist = category.aspectRatio === '3/4' || (category.title && category.title.includes('Artist'));
                 const ratio = isArtist ? '3/4' : '16/9';
                 return (
                   <div key={category.title} style={{ padding: '0 10%', margin: '0 auto 60px' }}>
                     <SliderSection 
                       title={category.title} 
                       items={category.items} 
                       delay={index * 0.2}
                       aspectRatio={ratio}
                       sizeMultiplier={1}
                       onItemClick={(item) => {
                         if (item.linkUrl) {
                           window.location.href = item.linkUrl;
                         } else if (item.tags && item.tags.includes('Influencer Channel')) {
                           window.location.href = `/profile/${item.id}`;
                         } else {
                           setActiveVideo(item);
                         }
                       }}
                     />
                   </div>
                 );
               })}
             </div>
             
             {/* Embed the standard VideoOverlay conditionally */}
             <AnimatePresence>
               {activeVideo && (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   onClick={() => setActiveVideo(null)}
                   style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}
                 >
                   <div style={{ padding: '24px 40px', display: 'flex', justifyContent: 'flex-end' }}>
                     <button onClick={() => setActiveVideo(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, padding: '8px' }} onMouseOver={e=>e.currentTarget.style.opacity='1'} onMouseOut={e=>e.currentTarget.style.opacity='0.7'}><X size={32} /></button>
                   </div>
                   <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px 40px', gap: '20px' }} onClick={e => e.stopPropagation()}>
                     <div style={{ flex: 1, maxWidth: '1200px', height: '100%', background: '#000', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
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
                             />
                           );
                         }
                         return (
                           <video src={activeVideo.videoUrl} poster={activeVideo.image} autoPlay controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                         );
                       })()}
                     </div>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
             
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
          
          {showAdminPanel && user && (
            <BusinessAdminDashboard wlConfig={wlConfig} onClose={() => setShowAdminPanel(false)} />
          )}

          <AnimatePresence>
             {showEndUserAuthModal && (
               <EndUserAuthModal wlConfig={wlConfig} onClose={() => setShowEndUserAuthModal(false)} />
             )}
          </AnimatePresence>
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

        <Routes>
          <Route path="/master-admin" element={<MasterAdminDashboard />} />
          <Route path="*" element={
            <>
              <Navbar 
                user={user} 
                onLoginClick={() => setShowAuthModal(true)} 
                onAdminClick={() => window.location.href = '/master-admin'}
              />
              <Routes>
                <Route path="/" element={<Home categories={categories} activeVideo={activeVideo} setActiveVideo={setActiveVideo} />} />
                <Route path="/profile" element={<ProfileDashboard user={user} />} />
                <Route path="/profile/:creatorId" element={<ProfileDashboard user={user} />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

// Separate the massive homepage into a stateless component for router cleanliness
function Home({ categories, activeVideo, setActiveVideo }: any) {
  // const navigate = useNavigate();

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
                if (item.linkUrl) {
                  window.location.href = item.linkUrl;
                } else if (item.tags && item.tags.includes('Influencer Channel')) {
                  // Force a hard redirect specifically for Influencer profiles from the Swiper slider
                  // This entirely bypasses any nested DOM event swallowing bugs from swiper/react wrapper
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
            background: 'linear-gradient(135deg, rgba(0, 100, 255, 0.05), rgba(0, 200, 255, 0.1))',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Ready to Scale Your <span className="gradient-text">Enterprise</span>?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '32px', fontSize: '18px', lineHeight: 1.6 }}>
              Create an administrative account today to instantly provision high-end corporate streaming nodes, global architecture networks, and executive live-broadcast tools.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-primary" style={{ padding: '14px 40px', background: '#0055ff' }}>Deploy Network Workspace</button>
              <button className="btn-secondary" style={{ padding: '14px 40px' }}>View Case Studies</button>
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
              <div style={{ flexShrink: 0, background: '#050505', borderRadius: '0 16px 16px 0', overflow: 'hidden' }}>
                 <LiveChat streamId={activeVideo.id || 'global'} />
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
      <footer style={{
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '60px 40px',
        textAlign: 'center'
      }}>
        <img src={ASSETS.logo} alt="Logo" style={{ height: '50px', marginBottom: '20px', opacity: 0.8 }} />
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 30px' }}>
          Vibe Network is the premier global enterprise engine for deploying, managing, and scaling dedicated SaaS streaming architectures.
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
