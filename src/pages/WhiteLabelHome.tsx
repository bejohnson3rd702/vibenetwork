import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { lazy, Suspense } from 'react';
import SliderSection from '../components/SliderSection';
import { supabase } from '../supabaseClient';
import type { WhiteLabelConfig, Category, VideoItem, User } from '../types';

interface WhiteLabelHomeProps {
  wlConfig: WhiteLabelConfig;
  categories: Category[];
  user: User | null;
  activeVideo: VideoItem | null;
  setActiveVideo: (video: VideoItem | null) => void;
}

export default function WhiteLabelHome({ wlConfig, categories, user, activeVideo, setActiveVideo }: WhiteLabelHomeProps) {
  return (
    <div style={{
       width: '100%', minHeight: '100vh', 
       backgroundColor: 'var(--bg-color)',
       display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', position: 'relative',
       textAlign: 'center', overflow: 'hidden'
    }}>
       {/* Background Mesh & Image Layer */}
       <motion.img 
         initial={{ scale: 1.1, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ duration: 1.5, ease: 'easeOut' }}
         src={wlConfig.heroImage || `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2500`} 
         alt="Atmospheric Hero Background" 
         style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, filter: 'brightness(0.4) contrast(1.1) saturate(1.2)' }} 
       />
       {/* Complex Gradient Overlays responding dynamically to Tenant Accent */}
       <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${wlConfig.bg || 'var(--bg-color)'}dd, transparent)`, zIndex: 1 }} />
       <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 30%, ${wlConfig.accent || 'var(--accent-primary)'}44, transparent 60%)`, zIndex: 1, mixBlendMode: 'screen' }} />
       <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${wlConfig.bg || 'var(--bg-color)'} 100%)`, zIndex: 1 }} />
       
       <div className="px-mobile-sm py-mobile-sm" style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', marginTop: '60px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '8px 16px', background: 'var(--bg-surface)', backdropFilter: 'blur(10px)', border: `1px solid ${wlConfig.accent || 'var(--accent-primary)'}44`, borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: wlConfig.accent || 'var(--accent-primary)', boxShadow: `0 0 10px ${wlConfig.accent || 'var(--accent-primary)'}` }} />
              <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: wlConfig.accent || 'var(--accent-primary)' }}>Live Network Initialized</span>
            </div>
            <h1 className="hero-title-mobile" style={{ fontSize: '96px', fontWeight: '900', margin: 0, letterSpacing: '-3px', lineHeight: 1.1, textShadow: '0 20px 40px rgba(0,0,0,0.8)', background: `linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.7))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {wlConfig.name}
            </h1>
          </motion.div>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="hero-sub-mobile" style={{ fontSize: '26px', color: 'rgba(255,255,255,0.7)', maxWidth: '800px', fontWeight: '400', textShadow: '0 10px 20px rgba(0,0,0,0.8)', lineHeight: 1.6 }}>
            {wlConfig.heroCopy || 'The premiere destination for high quality digital content.'}
          </motion.p>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ marginTop: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
             <button onClick={() => { document.getElementById('featured-content')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ padding: '20px 48px', background: wlConfig.accent || 'var(--accent-primary)', color: 'var(--text-primary)', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 10px 30px ${wlConfig.accent || 'var(--accent-primary)'}66`, transition: 'all 0.3s ease' }}>
               {wlConfig.btnPrimary || 'Explore Content'}
             </button>
          </motion.div>
       </div>
       
       <div id="featured-content" style={{ position: 'relative', zIndex: 2, width: '100%', paddingBottom: '80px' }}>
          
          <div id="slider-section-container">
            {(() => {
              const displayCategories = [...categories];
              if (user) {
                displayCategories.unshift({
                  title: 'Network Executives',
                  aspectRatio: '3/4',
                  items: [
                    {
                      id: user.id,
                      title: user.user_metadata?.username || 'Network Founder',
                      image: user.user_metadata?.avatar_url || `https://image.pollinations.ai/prompt/professional%20corporate%20headshot%20portrait%20cinematic%20lighting%20startup%20founder?width=400&height=600&nologo=true&seed=${user.id || 'owner'}`,
                      tags: ['Influencer Channel', 'Executive'],
                      linkUrl: null
                    }
                  ]
                });
              }
              return displayCategories.map((category: any, index: number) => {
                const isArtist = category.aspectRatio === '3/4' || (category.title && category.title.includes('Artist')) || category.title === 'Network Executives';
                const ratio = isArtist ? '3/4' : '16/9';
                return (
                    <SliderSection 
                      key={category.title}
                      title={category.title} 
                      items={category.items} 
                      delay={index * 0.2}
                      aspectRatio={ratio}
                      sizeMultiplier={1}
                      onItemClick={(item) => {
                        if (item.linkUrl) {
                          window.location.href = item.linkUrl + window.location.search;
                        } else if (item.tags && item.tags.includes('Influencer Channel')) {
                          window.location.href = `/profile/${item.id}${window.location.search}`;
                        } else {
                          setActiveVideo(item);
                        }
                      }}
                    />
                );
              });
            })()}
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
    </div>
  );
}
