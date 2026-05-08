import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ChevronRight, Sparkles } from 'lucide-react';
import { lazy, Suspense, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SliderSection from '../components/SliderSection';
import { supabase } from '../supabaseClient';
import type { WhiteLabelConfig, Category, VideoItem, User } from '../types';

const ProfileDashboard = lazy(() => import('../components/ProfileDashboard'));

interface WhiteLabelHomeProps {
  wlConfig: WhiteLabelConfig;
  categories: Category[];
  user: User | null;
  activeVideo: VideoItem | null;
  setActiveVideo: (video: VideoItem | null) => void;
}

export default function WhiteLabelHome({ wlConfig, categories, user, activeVideo, setActiveVideo }: WhiteLabelHomeProps) {
  const navigate = useNavigate();
  const [showVideoTitle, setShowVideoTitle] = useState(true);

  useEffect(() => {
    if (wlConfig.heroLayoutMode === 'video' && wlConfig.heroVideoTitle) {
      const timer = setTimeout(() => setShowVideoTitle(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [wlConfig.heroLayoutMode, wlConfig.heroVideoTitle]);

  return (
    <div style={{ background: wlConfig.bg || 'var(--bg-color)', minHeight: '100vh', width: '100%', overflowX: 'hidden', position: 'relative' }}>
       {/* Master Hero Wrapper */}
       <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '120px' }}>
         {/* Background Layer */}
         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
           <motion.img 
             initial={{ scale: 1.1, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1.5, ease: 'easeOut' }}
             src={wlConfig.heroImage || `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2500`} 
             alt="Atmospheric Hero Background" 
             style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) contrast(1.2) saturate(1.3)' }} 
           />
           {/* Soft fade into dark content section */}
           <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '350px', background: `linear-gradient(to bottom, transparent 0%, var(--bg-color) 100%)`, pointerEvents: 'none' }} />
         </div>

         {/* Hero Text Section */}
         <div className="px-mobile-sm py-mobile-sm" style={{ zIndex: 2, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '32px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <motion.div whileHover={{ scale: 1.05 }} style={{ padding: '10px 20px', background: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(16px)', border: `1px solid ${wlConfig.accent || 'var(--accent-primary)'}66`, borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: `0 0 20px ${wlConfig.accent || 'var(--accent-primary)'}33` }}>
              <Sparkles size={16} color={wlConfig.accent || 'var(--accent-primary)'} style={{ filter: `drop-shadow(0 0 8px ${wlConfig.accent || 'var(--accent-primary)'})` }} />
              <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff' }}>Live Network Initialized</span>
            </motion.div>
            <h1 className="hero-title-mobile" style={{ fontSize: '70px', fontWeight: '900', margin: 0, letterSpacing: '-4px', lineHeight: 1.1, textAlign: 'center', textShadow: '0 20px 40px rgba(0,0,0,0.8)', background: `linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.5) 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }}>
              {wlConfig.name}
            </h1>
          </motion.div>
          
          {(!wlConfig.heroLayoutMode || wlConfig.heroLayoutMode === 'verbiage') && (
            <>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="hero-sub-mobile" style={{ fontSize: '28px', color: 'rgba(255,255,255,0.8)', maxWidth: '850px', textAlign: 'center', fontWeight: '400', textShadow: '0 10px 20px rgba(0,0,0,0.8)', lineHeight: 1.6 }}>
                {wlConfig.heroCopy || 'The premiere destination for high quality digital content.'}
              </motion.p>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ marginTop: '30px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                 <motion.button 
                   whileHover={{ scale: 1.05, boxShadow: `0 20px 40px ${wlConfig.accent || 'var(--accent-primary)'}88`, filter: 'brightness(1.1)' }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => { document.getElementById('featured-content')?.scrollIntoView({ behavior: 'smooth' }); }} 
                   style={{ padding: '22px 54px', background: `linear-gradient(135deg, ${wlConfig.accent || 'var(--accent-primary)'}, rgba(0,0,0,0.8))`, color: '#fff', border: `1px solid ${wlConfig.accent || 'var(--accent-primary)'}44`, borderRadius: '40px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 10px 30px ${wlConfig.accent || 'var(--accent-primary)'}55`, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '12px' }}
                 >
                   {wlConfig.btnPrimary === 'Access Admin Dashboard' ? 'Explore Content' : (wlConfig.btnPrimary || 'Explore Content')}
                   <ChevronRight size={24} />
                 </motion.button>
              </motion.div>
            </>
          )}

          {wlConfig.heroLayoutMode === 'video' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ width: '100%', maxWidth: '800px', minHeight: '300px', margin: '0 auto 50px', borderRadius: '24px', overflow: 'hidden', border: `1px solid ${wlConfig.accent || '#fff'}44`, boxShadow: `0 20px 50px ${wlConfig.accent || '#fff'}33`, aspectRatio: '16/9', background: 'var(--bg-color)', position: 'relative' }}
            >
               <AnimatePresence>
                 {wlConfig.heroVideoTitle && showVideoTitle && (
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 50 }}
                     transition={{ duration: 0.8 }}
                     style={{ 
                       position: 'absolute', top: 24, left: 24, zIndex: 10, 
                       background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4))', 
                       backdropFilter: 'blur(20px)', padding: '12px 24px', 
                       borderRadius: '16px', border: `1px solid ${wlConfig.accent || 'var(--accent-primary)'}55`,
                       borderLeft: `4px solid ${wlConfig.accent || 'var(--accent-primary)'}`,
                       boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
                       display: 'flex', alignItems: 'center', gap: '14px'
                     }}
                   >
                     <motion.div 
                       animate={{ opacity: [1, 0.3, 1] }} 
                       transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} 
                       style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff3366', boxShadow: '0 0 12px #ff3366' }} 
                     />
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
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

          {wlConfig.heroLayoutMode === 'slider' && (
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
       </div>
       </div>
       
       {/* Dark Content Area Below Hero */}
       <div style={{ background: 'var(--bg-color)', width: '100%', position: 'relative', zIndex: 10, paddingBottom: '100px' }}>
         {/* Full Profile Dashboard Integrated at Network Level */}
         <div style={{ width: '100%', position: 'relative' }}>
            <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>Loading network profile...</div>}>
              <ProfileDashboard user={user} creatorIdOverride={wlConfig.owner_id} isNetworkLevel={true} />
            </Suspense>
         </div>
         
         <AnimatePresence>
           {activeVideo && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setActiveVideo(null)}
               style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}
             >
               <div style={{ padding: '24px 40px', display: 'flex', justifyContent: 'flex-end' }}>
                 <button onClick={() => setActiveVideo(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', opacity: 0.7, padding: '8px' }} onMouseOver={e=>e.currentTarget.style.opacity='1'} onMouseOut={e=>e.currentTarget.style.opacity='0.7'}><X size={32} /></button>
               </div>
               <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px 40px', gap: '20px' }} onClick={e => e.stopPropagation()}>
                 <div style={{ flex: 1, maxWidth: '1200px', height: '100%', background: 'var(--bg-color)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
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
                       <video src={activeVideo.videoUrl} poster={activeVideo.image} autoPlay controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                     );
                   })()}
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
         
         {wlConfig.customSections && wlConfig.customSections.toLowerCase() !== 'none' && (
            <div className="px-mobile-sm" style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '80px', padding: '0 40px', maxWidth: '1400px', margin: '80px auto 0', width: '100%', boxSizing: 'border-box' }}>
               {wlConfig.customSections.split(',').map((section: string, idx: number) => {
                  const title = section.trim();
                  if (!title) return null;
                  const lTitle = title.toLowerCase();
                  if (lTitle === 'contact us form' || lTitle === 'contact us' || lTitle === 'contact' || lTitle === 'about us' || lTitle === 'about') return null;

                  return (
                     <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                        <h2 style={{ fontSize: '36px', color: wlConfig.accent || '#fff', margin: 0 }}>{title}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px' }}>This is the autogenerated structural block for your requested <b>{title}</b> modular section. Connect your CMS to deploy actual structured content here.</p>
                     </div>
                  );
               })}
            </div>
         )}
         
         {/* Global Branded Network CTA */}
         <div className="px-mobile-sm" style={{ padding: '0 40px', maxWidth: '1400px', margin: '100px auto 60px', width: '100%', boxSizing: 'border-box' }}>
           <div style={{ 
             background: `linear-gradient(135deg, ${wlConfig.accent || 'var(--accent-primary)'}22, rgba(0,0,0,0.6))`,
             border: `1px solid ${wlConfig.accent || 'var(--accent-primary)'}44`,
             borderRadius: '24px',
             padding: '60px 40px',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             textAlign: 'center',
             gap: '30px',
             boxShadow: `0 20px 60px -10px ${wlConfig.accent || 'var(--accent-primary)'}22`
           }}>
             <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>
               Ready to expand your reach?
             </h2>
             <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
               Join <span style={{ color: wlConfig.accent || '#fff', fontWeight: 'bold' }}>{wlConfig.name || 'Vibe Network'}</span> as a creator to monetize your audience, or launch your very own independent streaming architecture.
             </p>
             <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
               <button 
                 onClick={() => window.dispatchEvent(new CustomEvent('open_auth', { detail: { isLogin: false, role: 'influencer' } }))}
                 style={{ 
                   padding: '16px 32px', 
                   background: wlConfig.accent || 'var(--accent-primary)', 
                   color: '#fff', 
                   border: 'none', 
                   borderRadius: '12px', 
                   fontWeight: 800, 
                   fontSize: '15px', 
                   cursor: 'pointer',
                   boxShadow: `0 10px 20px -5px ${wlConfig.accent || 'var(--accent-primary)'}66`
                 }}
               >
                 Get Your Own Profile
               </button>
               <button 
                 onClick={() => window.dispatchEvent(new CustomEvent('open_auth', { detail: { isLogin: false, role: 'business', referredBy: wlConfig.id } }))}
                 style={{ 
                   padding: '16px 32px', 
                   background: 'rgba(255,255,255,0.05)', 
                   color: '#fff', 
                   border: '1px solid rgba(255,255,255,0.2)', 
                   borderRadius: '12px', 
                   fontWeight: 800, 
                   fontSize: '15px', 
                   cursor: 'pointer',
                   backdropFilter: 'blur(10px)'
                 }}
               >
                 Get Your Own Network
               </button>
             </div>
           </div>
         </div>

       </div>
    </div>
  );
}
