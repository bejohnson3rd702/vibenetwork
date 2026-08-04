import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ChevronRight, Sparkles } from 'lucide-react';
import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SliderSection from '../components/SliderSection';
import { supabase } from '../supabaseClient';
import { ASSETS } from '../data';
import type { WhiteLabelConfig, Category, VideoItem, User } from '../types';
import { isOlympianConfig, isMuscleFitnessConfig, isB2kConfig, isKpleConfig } from '../lib/whitelabel';

import { OLYMPIA_CHAMPIONS } from '../lib/n2n';

const ProfileDashboard = lazy(() => import('../components/ProfileDashboard'));
const ShopifyStore = lazy(() => import('../components/ShopifyStore'));
const WatchLive = lazy(() => import('../components/WatchLive'));
const CollegeTicker = lazy(() => import('../components/CollegeTicker'));

interface WhiteLabelHomeProps {
  wlConfig: WhiteLabelConfig;
  categories: Category[];
  user: User | null;
  activeVideo: VideoItem | null;
  setActiveVideo: (video: VideoItem | null) => void;
}

export default function WhiteLabelHome({ wlConfig, categories, user, activeVideo, setActiveVideo }: WhiteLabelHomeProps) {
  const navigate = useNavigate();
  const isOlympian = isOlympianConfig(wlConfig);
  const [showVideoTitle, setShowVideoTitle] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Keep the video title overlay visible permanently
    setShowVideoTitle(true);
  }, [wlConfig.heroLayoutMode, wlConfig.heroVideoTitle]);

  useEffect(() => {
    if (activeVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.warn("WhiteLabelHome: Playback was prevented or failed:", err);
      });
    }
  }, [activeVideo]);

  return (
    <div style={{ background: wlConfig.bg || 'var(--bg-color)', minHeight: '100vh', width: '100%', overflowX: 'hidden', position: 'relative' }}>
       {/* Master Hero Background Layer */}
       <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '120vh', zIndex: 0 }}>
         {wlConfig.heroImage !== '' && (
           <motion.img 
             initial={{ scale: 1.1, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1.5, ease: 'easeOut' }}
             src={wlConfig.heroImage || ASSETS.heroMain}
             alt="Atmospheric Hero Background" 
             loading="eager"
             fetchPriority="high"
             style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) contrast(1.2) saturate(1.3)' }} 
           />
         )}
         {/* Soft fade into network profile background */}
         <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '500px', background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, #000 100%)', pointerEvents: 'none' }} />
       </div>
       {/* Darkening filter applied directly to image for sharp readability without soft overlays */}

       {/* Hero Text Section (Min Height to clear viewport and center properly) */}
       <div className="px-mobile-sm py-mobile-sm px-tablet-md py-tablet-md" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', width: '100%', paddingTop: '120px', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h1 className="hero-title-mobile hero-title-tablet" style={{ fontSize: '70px', fontWeight: '900', margin: 0, letterSpacing: '-4px', lineHeight: 1.1, textAlign: 'center', color: wlConfig.accent || '#ffffff', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              {wlConfig.theme?.heroTitle || wlConfig.name}
            </h1>
          </div>
          
          {(!wlConfig.heroLayoutMode || wlConfig.heroLayoutMode === 'verbiage') && (
            <>
              <p className="hero-sub-mobile hero-sub-tablet" style={{ fontSize: '28px', color: 'rgba(255,255,255,0.8)', maxWidth: '850px', textAlign: 'center', fontWeight: '400', textShadow: '0 10px 20px rgba(0,0,0,0.8)', lineHeight: 1.6, animation: 'fadeIn 1s ease-out 0.4s forwards', opacity: 0 }}>
                {wlConfig.heroCopy || 'The premiere destination for high quality digital content.'}
              </p>
            </>
          )}

          {wlConfig.heroLayoutMode === 'video' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ width: '100%', maxWidth: '800px', minHeight: '300px', margin: '0 auto 50px', borderRadius: '24px', overflow: 'hidden', border: `1px solid ${wlConfig.accent || '#fff'}44`, boxShadow: `0 20px 50px ${wlConfig.accent || '#fff'}33`, aspectRatio: '16/9', background: '#000', position: 'relative' }}
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

          {wlConfig.heroLayoutMode === 'slider' && (() => {
            const sliderItems = wlConfig.theme?.heroSlider || [
              { id: '1', title: 'Featured Content 1', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
              { id: '2', title: 'Featured Content 2', imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
              { id: '3', title: 'Featured Content 3', imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
            ];
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ width: '100%', maxWidth: '1000px', margin: '0 auto 50px', display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}
              >
                 {sliderItems.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setActiveVideo({ id: item.id, title: item.title, videoUrl: item.videoUrl, image: item.imageUrl })}
                      style={{ 
                        minWidth: '300px', 
                        flex: 1, 
                        aspectRatio: '16/9', 
                        borderRadius: '20px', 
                        background: `linear-gradient(45deg, #111, #222)`, 
                        border: `1px solid ${wlConfig.accent || '#fff'}22`, 
                        position: 'relative', 
                        overflow: 'hidden', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        cursor: 'pointer'
                      }}
                    >
                       <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6 }} />
                       <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)' }} />
                       <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 2 }}>
                          <h4 style={{ margin: 0, color: '#fff', fontSize: '16px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{item.title}</h4>
                       </div>
                       <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <Play fill="white" size={24} />
                          </div>
                       </div>
                    </div>
                 ))}
              </motion.div>
            );
          })()}
       </div>

        {/* Mr. Olympia Ticker if it is the Mr. Olympia network */}
        {isOlympian && (
          <div style={{ width: '100%', position: 'relative', zIndex: 10, marginBottom: '20px' }}>
            <Suspense fallback={null}>
              <CollegeTicker accent={wlConfig.accent} isOlympian={true} />
            </Suspense>
          </div>
        )}

        {/* Live Section if enabled and on network level (not sub-tenant creator channels) */}
        {wlConfig.enableWatchLive !== false && !wlConfig.parent_network_id && wlConfig.id !== 'courtney-bee-tenant-id' && wlConfig.id !== 'cb000000-c08f-4260-8540-a0cc8bed4e11' && !(wlConfig.name || '').toLowerCase().includes('courtney bee') && (
          <div id="whats-on-now" style={{ position: 'relative', zIndex: 10, marginTop: '40px' }}>
            <Suspense fallback={null}>
              <WatchLive 
                accent={wlConfig.accent} 
                isOlympian={isOlympianConfig(wlConfig)} 
                isMf={isMuscleFitnessConfig(wlConfig)}
                isB2K={isB2kConfig(wlConfig)} 
                isKple={isKpleConfig(wlConfig)} 
              />
            </Suspense>
          </div>
        )}

        {/* Mr. & Mrs. Olympia Slider if it's the Mr. Olympia network */}
        {isOlympian && (
          <div id="olympia-champions-slider" style={{ width: '100%', position: 'relative', zIndex: 10, marginTop: '40px', marginBottom: '20px' }}>
            <SliderSection
              title="MR. & MRS. OLYMPIA"
              items={OLYMPIA_CHAMPIONS}
              delay={0}
              aspectRatio="1/1"
              onItemClick={(item) => navigate('/profile/' + item.id + window.location.search)}
            />
          </div>
        )}
       
       {/* Full Profile Dashboard Integrated at Network Level */}
       <div style={{ width: '100%', position: 'relative', zIndex: 10 }}>
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
               <div style={{ flex: 1, maxWidth: '1200px', height: '100%', background: 'var(--bg-color)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative' }}>
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
                        key={activeVideo.videoUrl}
                        ref={videoRef}
                        src={activeVideo.videoUrl}
                        poster={activeVideo.image}
                        autoPlay
                        controls
                        playsInline
                        preload="auto"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      >
                        <source src={activeVideo.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    );
                 })()}
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
       
       {wlConfig.customSections && wlConfig.customSections.toLowerCase() !== 'none' && (
          <div className="px-mobile-sm px-tablet-md" style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '80px', padding: '0 40px', maxWidth: '1400px', margin: '80px auto 0', width: '100%', boxSizing: 'border-box' }}>
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
    </div>
  );
}
