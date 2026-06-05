import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Network } from 'lucide-react';
import SliderSection from '../components/SliderSection';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { getChildNetworks, mergeQueryParams } from '../lib/n2n';
import { getN2NCategories } from '../api';
import type { Category, VideoItem, User } from '../types';
const CollegeTicker = lazy(() => import('../components/CollegeTicker'));
const CollegeNewsFeed = lazy(() => import('../components/CollegeNewsFeed'));
const WatchLive = lazy(() => import('../components/WatchLive'));
const ChildNetworkFeeds = lazy(() => import('../components/ChildNetworkFeeds'));
const TopAmbassadors = lazy(() => import('../components/TopAmbassadors'));
const AmbassadorModal = lazy(() => import('../components/AmbassadorModal'));
const HoodieVoteModal = lazy(() => import('../components/HoodieVoteModal'));

interface N2NHomeProps {
  wlConfig: any;
  categories: Category[];
  user: User | null;
  activeVideo: VideoItem | null;
  setActiveVideo: (video: VideoItem | null) => void;
}

export default function N2NHome({ wlConfig, categories, activeVideo, setActiveVideo }: N2NHomeProps) {
  const { wlConfig: ctxConfig } = useWhiteLabel();
  const config = wlConfig || ctxConfig;
  const accent = config?.accent || 'var(--accent-primary)';
  const videoRef = useRef<HTMLVideoElement>(null);

  // ─── Child Networks ──────────────────────────────────────────────
  const [childItems, setChildItems] = useState<any[]>([]);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [isAmbassadorOpen, setIsAmbassadorOpen] = useState(false);
  const [isHoodieVoteOpen, setIsHoodieVoteOpen] = useState(false);

  useEffect(() => {
    if (!config?.id) return;
    let cancelled = false;
    (async () => {
      const children = await getChildNetworks(config.id);
      if (cancelled) return;

      const childIds = children.map((c: any) => c.id);

      setChildItems(
        children.map((child: any) => ({
          id: child.id,
          title: child.name,
          image: child.logoImage || child.heroImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name)}&background=111&color=fff&size=400`,
          tags: ['Network'],
          videoUrl: '',
          linkUrl: '/?tenant=' + child.id,
          accent: child.accent,
        }))
      );

      // Fetch content from child networks only
      if (childIds.length > 0) {
        const cats = await getN2NCategories(config.id, childIds);
        if (!cancelled) setChildCategories(cats);
      }
    })();
    return () => { cancelled = true; };
  }, [config?.id]);

  useEffect(() => {
    if (activeVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.warn("N2NHome: Playback was prevented or failed:", err);
      });
    }
  }, [activeVideo]);

  const isOlympian = config?.name?.toLowerCase().includes('olympia') || 
                     config?.domain?.includes('mrolympia.com') ||
                     config?.name?.toLowerCase().includes('muscle') ||
                     config?.name?.toLowerCase().includes('fitness');

  // ─── AVO Hero Slides — real shopavo.la CDN images ───────────────
  const AVO_HERO_SLIDES = [
    { school: 'Baylor', short: 'Baylor', subtitle: 'New Collection', copy: 'Represent the Bears with our newest campus essentials.', image: 'https://shopavo.la/cdn/shop/files/msu-hp-hero_1500x.jpg?v=1775144388', link: 'https://shopavo.la/collections/baylor' },
    { school: 'Mississippi State', short: 'Miss. State', subtitle: 'Hail State', copy: 'Maroon and white — gear up for every tailgate and beyond.', image: 'https://shopavo.la/cdn/shop/files/MSU_Homepage_Desktop_1500x.jpg?v=1776105569', link: 'https://shopavo.la/collections/mississippi-state' },
    { school: 'Vanderbilt', short: 'Vanderbilt', subtitle: 'Anchor Down', copy: 'Premium campus wear for the Commodores faithful.', image: 'https://shopavo.la/cdn/shop/files/Homepage_Vanderbilt_Desktop_1500x.jpg?v=1776284269', link: 'https://shopavo.la/collections/vanderbilt' },
    { school: 'Penn State', short: 'Penn State', subtitle: 'We Are', copy: 'Nittany Lions gear crafted for the Happy Valley lifestyle.', image: 'https://shopavo.la/cdn/shop/files/PSU_Homepage_Banner_Desktop2_1500x.jpg?v=1776375978', link: 'https://shopavo.la/collections/penn-state' },
    { school: 'Alabama', schoolSlug: 'avo-x-bama', short: 'Alabama', subtitle: 'Roll Tide', copy: 'Crimson and cream essentials for the Crimson Tide.', image: 'https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820', link: 'https://shopavo.la/pages/avo-x-bama' },
    { school: 'Ole Miss', short: 'Ole Miss', subtitle: 'Hotty Toddy', copy: 'Oxford-inspired style meets college spirit.', image: 'https://shopavo.la/cdn/shop/files/desk-ole-miss-hp_1500x.jpg?v=1774210006', link: 'https://shopavo.la/collections/ole-miss' },
    { school: 'Colorado', short: 'Colorado', subtitle: 'Sko Buffs', copy: 'Boulder vibes and mountain-ready campus apparel.', image: 'https://shopavo.la/cdn/shop/files/co-desktop2_4230eb90-9553-4d72-b205-30e62658bcce_1500x.jpg?v=1776445128', link: 'https://shopavo.la/collections/colorado' },
    { school: 'Georgia', short: 'Georgia', subtitle: 'Go Dawgs', copy: 'Red and black essentials for the Bulldog nation.', image: 'https://shopavo.la/cdn/shop/files/UGA_Collections_Desktop_1500x.jpg?v=1776210559', link: 'https://shopavo.la/collections/georgia' },
  ];

  const OLYMPIAN_HERO_SLIDES = [
    { school: 'Olympia Finals', short: 'Finals', subtitle: 'The Sandow Trophy', copy: 'Watch the historic battle of the titans live from Las Vegas. Witness bodybuilding history.', image: '/n2n/mr_olympia_hero.png', link: 'https://mrolympia.com/weekend-schedule' },
    { school: 'Meet the Olympians', short: 'Expo & Fan Experience', subtitle: 'Expo Weekend', copy: 'Connect with legendary fitness icons, explore world-class brands, and discover new supplements.', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1500', link: 'https://mrolympia.com/weekend-schedule' },
    { school: 'Press Conference', short: 'Press Conf.', subtitle: 'Face‑offs & Predictions', copy: 'Hear from the world\'s best athletes as they face off before taking the stage.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1500', link: 'https://mrolympia.com/weekend-schedule' }
  ];

  const HERO_SLIDES = isOlympian ? OLYMPIAN_HERO_SLIDES : AVO_HERO_SLIDES;

  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [HERO_SLIDES.length]);

  return (
    <>
      {/* ═══ shopavo.la Hero — Identical Recreation ═══ */}
      <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#000', overflow: 'hidden' }}>
        
        {/* Full-bleed hero slideshow — uses actual AVO Shopify CDN images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, zIndex: 0 }}
          >
            <img
              src={HERO_SLIDES[heroSlide % HERO_SLIDES.length]?.image}
              alt={HERO_SLIDES[heroSlide % HERO_SLIDES.length]?.school}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Bottom gradient — matches AVO's clean fade */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.75) 85%, #000 100%)' }} />

        {/* Hero text overlay — bottom-left, matches AVO's exact positioning */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', bottom: '180px', left: '0', zIndex: 2, padding: '0 60px', maxWidth: '700px' }}
          >
            <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
              {HERO_SLIDES[heroSlide % HERO_SLIDES.length]?.subtitle}
            </p>
            <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1px', color: '#fff', margin: '0 0 16px 0', textTransform: 'uppercase', fontFamily: "'RNS Miles', sans-serif" }}>
              {HERO_SLIDES[heroSlide % HERO_SLIDES.length]?.school}
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', margin: '0 0 24px 0', lineHeight: 1.6 }}>
              {HERO_SLIDES[heroSlide % HERO_SLIDES.length]?.copy}
            </p>
            <button
              onClick={() => window.location.href = '/shop' + window.location.search}
              style={{
                display: 'inline-block', padding: '13px 40px', fontSize: '11px', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '2.5px',
                background: 'transparent', color: '#fff',
                border: '1.5px solid #fff', cursor: 'pointer',
                transition: 'all 0.25s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
            >
              Shop Now
            </button>

            {/* Fundraising / Legacy stat */}
            <div style={{
              marginTop: '32px', padding: '16px 24px',
              borderLeft: `3px solid ${accent}`,
              background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
            }}>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1.2 }}>
                {isOlympian ? '50+ Years' : '$17,480,130'}<span style={{ color: accent }}>+</span>
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                {isOlympian ? 'Of Championing Legendary Athletes & Fitness Excellence' : 'Raised to empower student‑athletes nationwide'}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide dots — right side, vertical, matches AVO */}
        <div style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              style={{
                width: '10px', height: heroSlide === i ? '28px' : '10px',
                borderRadius: '5px', border: 'none', cursor: 'pointer',
                background: heroSlide === i ? '#fff' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s', padding: 0,
              }}
            />
          ))}
        </div>

        {/* Bottom collection bar — school thumbnails */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
          padding: '0', display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '14px 8px', gap: '0', border: 'none',
                background: heroSlide === i ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderBottom: heroSlide === i ? '2px solid #fff' : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.25s',
                flexDirection: 'column',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseOut={e => { e.currentTarget.style.background = heroSlide === i ? 'rgba(255,255,255,0.08)' : 'transparent'; }}
            >
              <span style={{
                fontSize: '10px', fontWeight: 800, color: heroSlide === i ? '#fff' : 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase', letterSpacing: '1.5px',
                transition: 'color 0.25s', whiteSpace: 'nowrap',
              }}>
                {slide.short}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* NCAA College Ticker — bottom of hero */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Suspense fallback={null}>
          <CollegeTicker accent={config.accent} isOlympian={isOlympian} />
        </Suspense>
      </div>

      <main style={{ background: 'var(--bg-color)', paddingBottom: '100px', zIndex: 10, position: 'relative', width: '100%' }}>

        {/* ── Watch Live ──────────────────────────────────────── */}
        <div id="whats-on-now">
          <Suspense fallback={null}>
            <WatchLive accent={config.accent} isOlympian={isOlympian} />
          </Suspense>
        </div>

        {/* ── New Drop CTA Banner ─────────────────────────────── */}
        <section style={{ maxWidth: '1400px', margin: '20px auto 40px', padding: '0 40px' }}>
          <div style={{
            position: 'relative', overflow: 'hidden',
            display: 'flex', minHeight: '340px',
            border: '1px solid rgba(255,255,255,0.06)',
            background: '#000',
          }}>
            {/* Left — Image */}
            <div style={{
              flex: '0 0 45%', position: 'relative', overflow: 'hidden',
            }}>
              <img
                src={isOlympian ? "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800" : "https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820"}
                alt={isOlympian ? "Official Gear" : "New Drop"}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #000 100%)' }} />
              {/* NEW DROP / OFFICIAL GEAR pill */}
              <div style={{
                position: 'absolute', top: '24px', left: '24px',
                padding: '6px 14px', background: accent, color: '#000',
                fontSize: '10px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase',
              }}>
                {isOlympian ? "Official Gear" : "New Drop"}
              </div>
            </div>

            {/* Right — Content */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '48px 48px 48px 32px', position: 'relative',
            }}>
              {/* Subtle accent glow */}
              <div style={{
                position: 'absolute', right: '-80px', top: '-40px',
                width: '300px', height: '300px', borderRadius: '50%',
                background: accent, filter: 'blur(120px)', opacity: 0.12,
              }} />

              <p style={{
                fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '3px', color: accent, margin: '0 0 12px 0',
              }}>
                {isOlympian ? "Olympia Collection" : "Summer 2026 Collection"}
              </p>
              <h2 style={{
                fontSize: '34px', fontWeight: 900, color: '#fff', margin: '0 0 14px 0',
                lineHeight: 1.15, letterSpacing: '-1px', textTransform: 'uppercase',
              }}>
                {isOlympian ? (
                  <>Official Weekend<br />Gear & Wear</>
                ) : (
                  <>Game Day<br />Essentials</>
                )}
              </h2>
              <p style={{
                fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
                margin: '0 0 28px 0', maxWidth: '380px',
              }}>
                {isOlympian ? "Premium bodybuilding and lifestyle apparel engineered for champions. Rep the legacy with official Mr. Olympia hoodies, workout shirts, and accessories." : "Premium collegiate apparel for every school in the AVO family. Rep your team with style — new colorways and exclusive designs just dropped."}
              </p>
              <a
                href={'/shop' + (typeof window !== 'undefined' ? window.location.search : '')}
                style={{
                  display: 'inline-block', padding: '13px 40px', fontSize: '11px', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '2.5px', width: 'fit-content',
                  background: 'transparent', color: '#fff',
                  border: '1.5px solid #fff', textDecoration: 'none',
                  transition: 'all 0.25s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
              >
                {isOlympian ? "Shop The Collection" : "Shop The Drop"}
              </a>
            </div>
          </div>
        </section>

        {/* ── Child Networks Slider ────────────────────────────── */}
        {childItems.length > 0 && (
          <div id="child-networks-slider">
            <SliderSection
              title={isOlympian ? "OLYMPIAN PARTNERS" : "AVO NETWORKS"}
              items={childItems}
              delay={0}
              aspectRatio="16/9"
              onItemClick={(item) => {
                if (item.linkUrl) {
                  window.location.href = mergeQueryParams(item.linkUrl, window.location.search);
                }
              }}
            />
          </div>
        )}

        {/* ── Child Network Feeds (Trending Moments) ────────────── */}
        {childItems.length > 0 && (
          <Suspense fallback={null}>
            <ChildNetworkFeeds parentId={config.id} accent={accent} isOlympian={isOlympian} />
          </Suspense>
        )}

        {/* ── Hoodie Competition Banner ───────────────────────── */}
        {!isOlympian && (
          <section style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 40px' }}>
            <div style={{
              position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#000',
            }}>
              {/* Background image — full bleed */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(/n2n/hoodie-competition.png)',
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'brightness(0.35)',
              }} />
              {/* Gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)' }} />

              <div style={{
                position: 'relative', zIndex: 2,
                padding: '64px 60px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px',
              }}>
                {/* Left — Content */}
                <div style={{ maxWidth: '520px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '6px 14px', background: accent, color: '#000',
                    fontSize: '10px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase',
                    marginBottom: '20px',
                  }}>
                    🏆 Competition
                  </div>
                  <h2 style={{
                    fontSize: '38px', fontWeight: 900, color: '#fff', margin: '0 0 14px 0',
                    lineHeight: 1.1, letterSpacing: '-1px', textTransform: 'uppercase',
                  }}>
                    Best College<br />Hoodie Design
                  </h2>
                  <p style={{
                    fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
                    margin: '0 0 24px 0',
                  }}>
                    All 8 AVO schools go head-to-head. Which campus created the best branded hoodie? Browse the entries, rep your school, and cast your vote.
                  </p>

                  {/* School pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                    {['Baylor', 'Colorado', 'Georgia', 'Miss. State', 'Alabama', 'Ole Miss', 'Vanderbilt', 'Penn State'].map(school => (
                      <span key={school} style={{
                        padding: '5px 12px', fontSize: '10px', fontWeight: 800,
                        letterSpacing: '1px', textTransform: 'uppercase',
                        border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
                        background: 'rgba(255,255,255,0.04)',
                      }}>
                        {school}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsHoodieVoteOpen(true)}
                    style={{
                      display: 'inline-block', padding: '14px 44px', fontSize: '11px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '2.5px',
                      background: accent, color: '#fff',
                      border: 'none', textDecoration: 'none',
                      transition: 'all 0.25s',
                      cursor: 'pointer'
                    }}
                    onMouseOver={e => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    Vote Now
                  </button>
                </div>

                {/* Right — Hoodie image */}
                <div style={{ flexShrink: 0, width: '320px', position: 'relative' }}>
                  <img
                    src="/n2n/hoodie-competition.png"
                    alt="College Hoodie Competition"
                    style={{
                      width: '100%', borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── AVO Summer Concert Tour Banner ─────────────────── */}
        {!isOlympian && (
          <section style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 40px' }}>
            <div style={{
              position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)',
              background: '#000',
              minHeight: '380px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {/* Background Image */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(/n2n/concert_in_the_park.png)',
                backgroundSize: 'cover', backgroundPosition: 'center 35%',
                filter: 'brightness(0.32)'
              }} />
              {/* Gradient Overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />

              <div style={{
                position: 'relative', zIndex: 2,
                padding: '64px 60px', maxWidth: '640px',
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 14px', background: 'linear-gradient(90deg, #FF512F, #DD2476)', color: '#fff',
                  fontSize: '10px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase',
                  marginBottom: '20px',
                }}>
                  🎸 Summer 2026 Tour
                </div>
                <h2 style={{
                  fontSize: '38px', fontWeight: 900, color: '#fff', margin: '0 0 16px 0',
                  lineHeight: 1.1, letterSpacing: '-1px', textTransform: 'uppercase',
                }}>
                  AVO Summer<br />Concert Tour
                </h2>
                <p style={{
                  fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
                  margin: '0 0 28px 0',
                }}>
                  Catch the vibes live! AVO is hitting the road this summer, bringing your favorite bands and artists to collegiate campus parks nationwide. Grab your crew, rep your school colors, and experience the ultimate summer soundtrack.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button
                    style={{
                      display: 'inline-block', padding: '14px 44px', fontSize: '11px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '2.5px',
                      background: accent, color: '#fff',
                      border: 'none', transition: 'all 0.25s',
                      cursor: 'pointer'
                    }}
                    onMouseOver={e => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    Buy Now
                  </button>
                  <button
                    style={{
                      display: 'inline-block', padding: '14px 44px', fontSize: '11px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '2.5px',
                      background: 'rgba(255, 255, 255, 0.08)', color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.25s',
                      cursor: 'pointer'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                  >
                    Join The Live Stream
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── College Sports News Feed ──────────────────────── */}
        {!isOlympian && (
          <Suspense fallback={null}>
            <CollegeNewsFeed accent={config.accent} />
          </Suspense>
        )}

        {/* ── M&F Sister Publications Banners ────────────────── */}
        {isOlympian && (
          <section style={{ maxWidth: '1400px', margin: '40px auto 20px', padding: '0 40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              
              {/* Muscle & Fitness Hers Card */}
              <div style={{
                position: 'relative', overflow: 'hidden', minHeight: '340px',
                border: '1px solid rgba(255,255,255,0.06)', background: '#000',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: '40px'
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'url("https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800")',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  filter: 'brightness(0.35)'
                }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    display: 'inline-flex', padding: '5px 12px', background: '#E31B23', color: '#fff',
                    fontSize: '9px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}>
                    Featured Publication
                  </div>
                  <h3 style={{
                    fontSize: '28px', fontWeight: 900, color: '#fff', margin: '0 0 10px 0',
                    lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '-0.5px'
                  }}>
                    M&amp;F Hers
                  </h3>
                  <p style={{
                    fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6,
                    margin: '0 0 24px 0', maxWidth: '420px'
                  }}>
                    Workouts, nutrition advice, and lifestyle tips tailored specifically for active women. Empower your fitness journey today.
                  </p>
                  <a
                    href="https://www.muscleandfitness.com/category/muscle-fitness-hers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block', padding: '12px 36px', fontSize: '10px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '2px',
                      background: 'transparent', color: '#fff',
                      border: '1.5px solid #fff', textDecoration: 'none',
                      transition: 'all 0.25s'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                  >
                    Explore Hers
                  </a>
                </div>
              </div>

              {/* FLEX Online Card */}
              <div style={{
                position: 'relative', overflow: 'hidden', minHeight: '340px',
                border: '1px solid rgba(255,255,255,0.06)', background: '#000',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: '40px'
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'url("https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800")',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  filter: 'brightness(0.35)'
                }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    display: 'inline-flex', padding: '5px 12px', background: '#E31B23', color: '#fff',
                    fontSize: '9px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}>
                    Bodybuilding Authority
                  </div>
                  <h3 style={{
                    fontSize: '28px', fontWeight: 900, color: '#fff', margin: '0 0 10px 0',
                    lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '-0.5px'
                  }}>
                    FLEX Online
                  </h3>
                  <p style={{
                    fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6,
                    margin: '0 0 24px 0', maxWidth: '420px'
                  }}>
                    The definitive resource for hardcore bodybuilding. Mass programs, champion contest prep, and legendary coverage.
                  </p>
                  <a
                    href="https://www.muscleandfitness.com/category/flexonline/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block', padding: '12px 36px', fontSize: '10px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '2px',
                      background: 'transparent', color: '#fff',
                      border: '1.5px solid #fff', textDecoration: 'none',
                      transition: 'all 0.25s'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                  >
                    Explore FLEX
                  </a>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ── Ambassador CTA ──────────────────────────────────── */}
        <section style={{ maxWidth: '1400px', margin: '60px auto 0', padding: '0 40px' }}>
          <div style={{
            position: 'relative', borderRadius: '0', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
            background: '#000',
          }}>
            {/* Background image */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${isOlympian ? "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200" : "https://shopavo.la/cdn/shop/files/Homepage_Vanderbilt_Desktop2_c7f572ef-cd7e-4de4-bb9c-160b99884e08_1500x.jpg?v=1776284877"})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'brightness(0.3)',
            }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)' }} />

            <div style={{ position: 'relative', zIndex: 2, padding: '80px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
              <div style={{ maxWidth: '550px' }}>
                <p style={{
                  fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '3px', color: accent, marginBottom: '12px',
                }}>
                  {isOlympian ? "Olympia Ambassadors" : "Campus Ambassadors"}
                </p>
                <h2 style={{
                  fontSize: '36px', fontWeight: 900, color: '#fff', margin: '0 0 16px 0',
                  lineHeight: 1.15, letterSpacing: '-1px', textTransform: 'uppercase',
                }}>
                  {isOlympian ? (
                    <>Represent Mr. Olympian<br />In Your Community</>
                  ) : (
                    <>Represent AVO<br />On Your Campus</>
                  )}
                </h2>
                <p style={{
                  fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0,
                }}>
                  {isOlympian 
                    ? "Join the official Mr. Olympian Ambassador Program. Share fitness tips, review premium workout apparel, and earn exclusive event credentials, early access, and commissions."
                    : "Join the AVO Ambassador Program and bring premium college apparel to your school. Earn exclusive perks, early access to drops, and commissions on every sale."}
                </p>
              </div>
                            <button
                onClick={() => setIsAmbassadorOpen(true)}
                style={{
                  display: 'inline-block', padding: '15px 48px', fontSize: '11px', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '2.5px',
                  background: 'transparent', color: '#fff',
                  border: '1.5px solid #fff', textDecoration: 'none',
                  transition: 'all 0.25s', flexShrink: 0,
                  cursor: 'pointer'
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
              >
                More Info
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ── Video Player Overlay ──────────────────────────────── */}
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
                      key={activeVideo.videoUrl}
                      ref={videoRef}
                      src={activeVideo.videoUrl}
                      autoPlay
                      controls
                      playsInline
                      preload="auto"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'black' }}
                    >
                      <source src={activeVideo.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
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
                  <span key={tag} style={{ color: accent, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Decorative Blur Orbs ──────────────────────────────── */}
      <div style={{
        position: 'fixed', top: '20%', right: '10%', width: '300px', height: '300px',
        background: 'rgba(255,255,255,0.03)', filter: 'blur(150px)', borderRadius: '50%', zIndex: -1, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', left: '25%', width: '400px', height: '400px',
        background: accent, filter: 'blur(250px)', opacity: 0.05, borderRadius: '50%', zIndex: -1, pointerEvents: 'none'
      }} />



      {/* ── Ambassador Application Modal ─────────────────────── */}
      <Suspense fallback={null}>
        <AmbassadorModal 
          isOpen={isAmbassadorOpen} 
          onClose={() => setIsAmbassadorOpen(false)} 
          accent={accent} 
        />
      </Suspense>

      {/* ── Hoodie Vote Modal ───────────────────────────────── */}
      <Suspense fallback={null}>
        <HoodieVoteModal 
          isOpen={isHoodieVoteOpen} 
          onClose={() => setIsHoodieVoteOpen(false)} 
          accent={accent} 
        />
      </Suspense>
    </>
  );
}
