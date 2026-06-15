import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { lazy, Suspense, useState, useEffect } from 'react';
import Hero from '../components/Hero';
const WatchLive = lazy(() => import('../components/WatchLive'));
import SliderSection from '../components/SliderSection';
import type { Category, VideoItem, User } from '../types';

const LiveChat = lazy(() => import('../components/LiveChat'));
const TrendingFeed = lazy(() => import('../components/TrendingFeed'));

interface HomeProps {
  categories: Category[];
  activeVideo: VideoItem | null;
  setActiveVideo: (video: VideoItem | null) => void;
  user: User | null;
}

import { useWhiteLabel } from '../context/WhiteLabelContext';
import { getChildNetworks, mergeQueryParams } from '../lib/n2n';
import { OLYMPIA_CHAMPIONS } from './N2NHome';

export default function Home({ categories, activeVideo, setActiveVideo, user }: HomeProps) {
  const { wlConfig } = useWhiteLabel();
  const [avoColleges, setAvoColleges] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // AVO parent network ID is 3915f1e5-4c79-4b2a-ad41-7029ce8052d7
      const colleges = await getChildNetworks('3915f1e5-4c79-4b2a-ad41-7029ce8052d7');
      if (!cancelled && colleges) {
        setAvoColleges(
          colleges.map((c: any) => ({
            id: c.id,
            title: c.name,
            image: c.logoImage || c.heroImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=111&color=fff&size=400`,
            tags: ['College'],
            videoUrl: '',
            linkUrl: '/?tenant=' + c.id,
            accent: c.accent,
          }))
        );
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Hero />
      <main style={{ background: 'var(--bg-color)', paddingBottom: '100px', zIndex: 10, position: 'relative', width: '100%' }}>
        {/* ── Networks slider (above Watch) ── */}
        {categories.filter((c: any) => c.title.toLowerCase().includes('network')).map((category: any, index: number) => (
          <SliderSection
            key={category.title}
            title={category.title}
            items={category.items}
            delay={index * 0.2}
            aspectRatio="16/9"
            sizeMultiplier={1}
            onItemClick={(item) => {
              if (item.linkUrl) {
                const targetUrl = item.linkUrl.includes('?') 
                  ? `${item.linkUrl}&fromVibe=true` 
                  : `${item.linkUrl}?fromVibe=true`;
                window.location.href = mergeQueryParams(targetUrl, window.location.search);
              } else {
                setActiveVideo(item);
              }
            }}
          />
        ))}

        {wlConfig?.enableWatchLive !== false && (
          <div id="whats-on-now">
            <Suspense fallback={null}>
              <WatchLive accent={wlConfig?.accent} isVibe={true} />
            </Suspense>
          </div>
        )}

        <div id="slider-section-container">
          {/* AVO Colleges Slider */}
          {avoColleges.length > 0 && (
            <SliderSection
              title="AVO COLLEGES"
              items={avoColleges}
              aspectRatio="16/9"
              onItemClick={(item) => {
                if (item.linkUrl) {
                  const targetUrl = item.linkUrl.includes('?') 
                    ? `${item.linkUrl}&fromVibe=true` 
                    : `${item.linkUrl}?fromVibe=true`;
                  window.location.href = mergeQueryParams(targetUrl, window.location.search);
                }
              }}
            />
          )}

          {/* Other Sliders (excluding network categories and New Content) */}
          {categories
            .filter((c: any) => !c.title.toLowerCase().includes('network') && c.title !== 'New Content')
            .map((category: any, index: number) => {
              const isArtist = category.aspectRatio === '3/4' || category.title.includes('Artist');
              const ratio = isArtist ? '3/4' : '16/9';
              const multiplier = 1; 
              
              const isNewProfiles = category.title === 'New Profiles';
              
              return (
                <div key={category.title}>
                  <SliderSection 
                    title={category.title} 
                    items={category.items} 
                    delay={index * 0.2}
                    aspectRatio={category.aspectRatio || ratio}
                    sizeMultiplier={multiplier}
                    onItemClick={(item) => {
                      if (item.linkUrl) {
                        window.location.href = mergeQueryParams(item.linkUrl, window.location.search);
                      } else if (item.tags && item.tags.includes('Influencer Channel')) {
                        window.location.href = mergeQueryParams(`/profile/${item.id}`, window.location.search);
                      } else {
                        setActiveVideo(item);
                      }
                    }}
                  />
                  {isNewProfiles && (
                    <SliderSection
                      title="MR. & MRS. OLYMPIA"
                      items={OLYMPIA_CHAMPIONS.map(champion => ({
                        ...champion,
                        linkUrl: `/profile/${champion.id}?tenant=7a017c4d-c08f-4260-8540-a0cc8bed4e11`
                      }))}
                      aspectRatio="1/1"
                      onItemClick={(item) => {
                        if (item.linkUrl) {
                          const targetUrl = item.linkUrl.includes('?') 
                            ? `${item.linkUrl}&fromVibe=true` 
                            : `${item.linkUrl}?fromVibe=true`;
                          window.location.href = mergeQueryParams(targetUrl, window.location.search);
                        }
                      }}
                    />
                  )}
                </div>
              );
            })}
        </div>

        <Suspense fallback={null}>
          <TrendingFeed />
        </Suspense>

        {/* New content section below sliders */}
        <section style={{ maxWidth: '1400px', margin: '40px auto 40px', padding: '0 40px' }}>
          <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 100%)', zIndex: 1 }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2500")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6, filter: 'brightness(0.7) contrast(1.2)', zIndex: 0 }} />
            <div style={{ position: 'absolute', right: '-10%', top: '-50%', width: '500px', height: '500px', background: 'var(--accent-primary)', filter: 'blur(150px)', opacity: 0.3, zIndex: 0, borderRadius: '50%' }} />
            
            <div className="px-mobile-sm py-mobile-sm px-tablet-md py-tablet-md" style={{ position: 'relative', zIndex: 2, padding: '80px 60px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
              <div style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', display: 'inline-block', marginBottom: '24px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '1px' }}>Join The Movement</div>
              <h2 className="hero-title-mobile hero-title-tablet" style={{ fontSize: '56px', fontWeight: 900, marginBottom: '20px', lineHeight: 1.1, letterSpacing: '-1px' }}>Ready to Broadcast<br/>Your <span style={{ color: 'var(--accent-primary)' }}>Vibe</span>?</h2>
              <p className="hero-sub-mobile hero-sub-tablet" style={{ color: 'var(--text-secondary)', maxWidth: '550px', marginBottom: '40px', fontSize: '18px', lineHeight: 1.6 }}>
                Create a creator profile to start streaming your live sets to the world, or launch your own dedicated network to host your entire brand and community.
              </p>
              <div className="flex-col-mobile flex-col-tablet" style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <button className="mobile-w-full tablet-w-full" onClick={() => window.dispatchEvent(new CustomEvent('open_auth', { detail: { isLogin: false, role: 'influencer' } }))} style={{ padding: '18px 40px', background: 'var(--accent-primary)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(var(--accent-primary-rgb), 0.3)' }}>Create a Profile</button>
                <button className="mobile-w-full tablet-w-full" onClick={() => window.dispatchEvent(new CustomEvent('open_auth', { detail: { isLogin: false, role: 'business' } }))} style={{ padding: '18px 40px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>Launch a Network</button>
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
              <div style={{ flex: 1, height: '100%', position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
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
    </>
  );
}
