import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Network, Volume1, Volume2, VolumeX } from 'lucide-react';
import SliderSection from '../components/SliderSection';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { getChildNetworks, mergeQueryParams, OLYMPIA_CHAMPIONS, WINGS_ATHLETES, WINGS_LEGENDS } from '../lib/n2n';
import { getN2NCategories } from '../api';
import type { Category, VideoItem, User } from '../types';
import { supabase } from '../supabaseClient';
import { isOlympianConfig, isMuscleFitnessConfig, isB2kConfig, isKpleConfig } from '../lib/whitelabel';
const CollegeTicker = lazy(() => import('../components/CollegeTicker'));
const CollegeNewsFeed = lazy(() => import('../components/CollegeNewsFeed'));
const WatchLive = lazy(() => import('../components/WatchLive'));
const ChildNetworkFeeds = lazy(() => import('../components/ChildNetworkFeeds'));
const MFRSSFeed = lazy(() => import('../components/MFRSSFeed'));
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
  const navigate = useNavigate();
  const { wlConfig: ctxConfig } = useWhiteLabel();
  const config = wlConfig || ctxConfig;
  const accent = config?.accent || 'var(--accent-primary)';
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroIframeRef = useRef<HTMLIFrameElement>(null);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [heroVolume, setHeroVolume] = useState(30);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);

  const toggleHeroMute = () => {
    const iframe = heroIframeRef.current;
    if (iframe && iframe.contentWindow) {
      const nextMuteState = !isHeroMuted;
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: nextMuteState ? 'mute' : 'unMute'
      }), '*');
      if (!nextMuteState) {
        iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'setVolume',
          args: [heroVolume]
        }), '*');
      }
      setIsHeroMuted(nextMuteState);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setHeroVolume(newVolume);
    const iframe = heroIframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'setVolume',
        args: [newVolume]
      }), '*');
      if (newVolume > 0 && isHeroMuted) {
        iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'unMute'
        }), '*');
        setIsHeroMuted(false);
      } else if (newVolume === 0 && !isHeroMuted) {
        iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'mute'
        }), '*');
        setIsHeroMuted(true);
      }
    }
  };

  // ─── Child Networks ──────────────────────────────────────────────
  const [childItems, setChildItems] = useState<any[]>([]);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [athleteItems, setAthleteItems] = useState<any[]>([]);
  const [isAmbassadorOpen, setIsAmbassadorOpen] = useState(false);
  const [isHoodieVoteOpen, setIsHoodieVoteOpen] = useState(false);

  useEffect(() => {
    if (!config?.id) return;
    let cancelled = false;
    (async () => {
      const parentId = config.parent_network_id || config.theme?.parent_network_id || '';
      const shouldLoadParentChildren = isMf || isOlympian;

      let targetId = config.id;
      if (shouldLoadParentChildren && parentId) {
        targetId = parentId;
      } else if (shouldLoadParentChildren && !isMf) {
        targetId = '7a017c4d-c08f-4260-8540-a0cc8bed4e11';
      }

      let children = await getChildNetworks(targetId);
      if (cancelled) return;

      // Sort Mr. Olympia first if parent is Muscle & Fitness
      if (shouldLoadParentChildren) {
        children = [...children].sort((a: any, b: any) => {
          const isOlympiaA = a.id === '7a017c4d-c08f-4260-8540-a0cc8bed4e12' || (a.name || '').toLowerCase().includes('olympia');
          const isOlympiaB = b.id === '7a017c4d-c08f-4260-8540-a0cc8bed4e12' || (b.name || '').toLowerCase().includes('olympia');
          if (isOlympiaA && !isOlympiaB) return -1;
          if (!isOlympiaA && isOlympiaB) return 1;
          return 0;
        });
      }

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

        const isKpleActive = isKpleConfig(config);
        const fetchIds = isKpleActive ? [config.id, ...childIds] : childIds;
        const { data: athletesData } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, bio, whitelabel_id, created_at')
          .in('whitelabel_id', fetchIds)
          .eq('role', 'influencer')
          .neq('is_active', false)
          .order('created_at', { ascending: false });

        if (!cancelled && athletesData) {
          const isKpleActive = isKpleConfig(config);
          let filteredAthletes = athletesData;
          if (isKpleActive) {
            filteredAthletes = athletesData.filter((athlete: any) =>
              ['rev bennie johnson', 'kple', 'pastor john', 'doc wales diaries'].includes(athlete.username?.toLowerCase())
            );
          }

          const getCollegeShortName = (wlId: string) => {
            if (wlId === config.id) return config.name || 'KPLE TV';
            const child = children.find(c => c.id === wlId);
            if (!child) return isKpleActive ? 'Host' : 'Athlete';
            let name = child.name || '';
            if (!isKpleActive) {
              name = name.replace(/University of /gi, '');
              name = name.replace(/ University/gi, '');
            }
            return name;
          };

          setAthleteItems(
            filteredAthletes.map((athlete: any) => ({
              id: athlete.id,
              title: athlete.username ? athlete.username.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : (isKpleActive ? 'Channel Host' : 'Student Athlete'),
              image: athlete.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(athlete.username || 'A')}&background=111&color=fff&size=400`,
              tags: [getCollegeShortName(athlete.whitelabel_id), isKpleActive ? 'Host' : 'Athlete'],
              videoUrl: '',
              linkUrl: `/profile/${athlete.id}`
            }))
          );
        }
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

  const isOlympian = isOlympianConfig(config);
  const isMf = isMuscleFitnessConfig(config);
  const isMfFamily = isMf || isOlympian || 
                     config?.id === 'wings-of-strength-tenant-id' ||
                     config?.id === 'mf-hers-tenant-id' ||
                     config?.id === 'flex-online-tenant-id';
  const isWings = config?.id === 'wings-of-strength-tenant-id';
  const isHers = config?.id === 'mf-hers-tenant-id';
  const isFlex = config?.id === 'flex-online-tenant-id';
  const isB2K = isB2kConfig(config);
  const isKple = isKpleConfig(config);

  const isAvo = config?.id === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7' ||
                config?.name?.toLowerCase().includes('avo');

  const isVibe100 = config?.id === 'e5c100aa-c08f-4260-8540-a0cc8bed4e11' || 
                    config?.name?.toLowerCase().includes('vibe 100') ||
                    config?.domain?.includes('vibe100');

  const isVibe = !isVibe100 && (config?.name?.toLowerCase().includes('vibe') || 
                 config?.domain?.includes('vibenetwork.tv') ||
                 config?.id === 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30');


  const WINGS_SPONSORS = [
    { id: 'wos-sponsor-charged', title: 'Charged', image: '/n2n/sponsor_charged.png', linkUrl: 'https://wingsofstrength.net/', tags: ['Network'], accent: '#FF9D00' },
    { id: 'wos-sponsor-s4f', title: 'S4F Summit', image: '/n2n/sponsor_s4f.png', linkUrl: 'https://wingsofstrength.net/', tags: ['Network'], accent: '#FF9D00' },
    { id: 'wos-sponsor-nebbia', title: 'Nebbia', image: '/n2n/sponsor_nebbia.png', linkUrl: 'https://nebbia.fitness/', tags: ['Network'], accent: '#FF9D00' },
    { id: 'wos-sponsor-gymstack', title: 'Gym Stack', image: '/n2n/sponsor_gymstack.png', linkUrl: 'https://wingsofstrength.net/', tags: ['Network'], accent: '#FF9D00' },
    { id: 'wos-sponsor-gymmakers', title: 'Gym Makers', image: '/n2n/sponsor_gymmakers.png', linkUrl: 'https://wingsofstrength.net/', tags: ['Network'], accent: '#FF9D00' },
  ];

  // ─── AVO Hero Slides — real shopavo.la CDN images ───────────────
  const AVO_HERO_SLIDES = [
    { school: 'Baylor', short: 'Baylor', subtitle: 'New Collection', copy: 'Represent the Bears with our newest campus essentials.', image: 'https://shopavo.la/cdn/shop/files/msu-hp-hero_1500x.jpg?v=1775144388', link: 'https://shopavo.la/collections/baylor' },
    { school: 'Mississippi State', short: 'Miss. State', subtitle: 'Hail State', copy: 'Maroon and white — gear up for every tailgate and beyond.', image: 'https://shopavo.la/cdn/shop/files/MSU_Homepage_Desktop_1500x.jpg?v=1776105569', link: 'https://shopavo.la/collections/mississippi-state' },
    { school: 'Vanderbilt', short: 'Vanderbilt', subtitle: 'Anchor Down', copy: 'Premium campus wear for the Commodores faithful.', image: 'https://shopavo.la/cdn/shop/files/Homepage_Vanderbilt_Desktop_1500x.jpg?v=1776284269', link: 'https://shopavo.la/collections/vanderbilt' },
    { school: 'Penn State', short: 'Penn State', subtitle: 'We Are', copy: 'Nittany Lions gear crafted for the Happy Valley lifestyle.', image: 'https://shopavo.la/cdn/shop/files/PSU_Homepage_Banner_Desktop2_1500x.jpg?v=1776375978', link: 'https://shopavo.la/collections/penn-state' },
    { school: 'Alabama', schoolSlug: 'avo-x-bama', short: 'Alabama', subtitle: 'Roll Tide', copy: 'Crimson and cream essentials for the Crimson Tide.', image: 'https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820', link: 'https://shopavo.la/pages/avo-x-bama' },
    { school: 'Ole Miss', short: 'Ole Miss', subtitle: 'Hotty Toddy', copy: 'Oxford-inspired style meets college spirit.', image: 'https://shopavo.la/cdn/shop/files/desk-ole-miss-hp_1500x.jpg?v=1774210006', link: 'https://shopavo.la/collections/ole-miss' },
    { school: 'Georgia', short: 'Georgia', subtitle: 'Go Dawgs', copy: 'Red and black essentials for the Bulldog nation.', image: 'https://shopavo.la/cdn/shop/files/UGA_Collections_Desktop_1500x.jpg?v=1776210559', link: 'https://shopavo.la/collections/georgia' },
  ];

  const OLYMPIAN_HERO_SLIDES = [
    { 
      school: 'Olympia Finals', 
      short: 'Finals', 
      subtitle: 'The Sandow Trophy', 
      copy: 'Watch the historic battle of the titans live from Las Vegas. Witness bodybuilding history.', 
      image: '/n2n/mr_olympia_hero.png', 
      videoUrl: 'https://www.youtube.com/embed/njSC3gMfjjU?autoplay=1&mute=1&loop=1&playlist=njSC3gMfjjU&controls=0&showinfo=0&rel=0&start=56',
      link: 'https://mrolympia.com/weekend-schedule' 
    },
    { school: '62nd Mr. Olympia 2026', short: 'Las Vegas 2026', subtitle: 'September 24–27, 2026', copy: 'Mark your calendars for the ultimate fitness weekend in Las Vegas. Venue, ticket sales, and athlete updates are now online.', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1500', link: 'https://mrolympia.com/' },
    { school: 'Meet the Olympians', short: 'Expo & Fan Experience', subtitle: 'Expo Weekend', copy: 'Connect with legendary fitness icons, explore world-class brands, and discover new supplements.', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1500', link: 'https://mrolympia.com/weekend-schedule' },
    { school: 'Press Conference', short: 'Press Conf.', subtitle: 'Face‑offs & Predictions', copy: 'Hear from the world\'s best athletes as they face off before taking the stage.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1500', link: 'https://mrolympia.com/weekend-schedule' }
  ];

  const MUSCLE_FITNESS_HERO_SLIDES = [
    { school: 'Workout Blueprints', short: 'Workouts', subtitle: 'Training splits', copy: 'Build your dream physique with our science-based training splits and guides.', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1500', link: 'https://www.muscleandfitness.com/workouts' },
    { school: 'Nutrition & Meal Prep', short: 'Nutrition', subtitle: 'Fuel Your Body', copy: 'High-protein recipes, macro calculators, and supplement guides for recovery.', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1500', link: 'https://www.muscleandfitness.com/nutrition' },
    { school: 'Athlete Interviews', short: 'Interviews', subtitle: 'Learn From Pros', copy: 'Read exclusive routines and lifestyle tips from leading fitness professionals and celebrities.', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1500', link: 'https://www.muscleandfitness.com/athletes-celebrities' }
  ];

  const B2K_HERO_SLIDES = [
    { school: 'The Millennium Tour', short: 'Boys 4 Life Tour', subtitle: '25th Anniversary Reunion', copy: 'B2K and Bow Wow live, featuring Jeremih, Pretty Ricky, Amerie, and more. Celebrate 25 years of the boy band legacy.', image: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-5-1557518926.jpg', link: 'https://b2kofficial.com/tour' },
    { school: 'New Studio Album', short: 'New Album', subtitle: 'First Album in Over 20 Years', copy: 'Pre-order the new Boys 4 Life album, capturing the classic B2K R&B harmonies and modern beats.', image: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-6-1557518986-e1660607966438.jpg', link: '/shop' },
    { school: 'B2K Members', short: 'The Members', subtitle: 'Omarion, Lil Fizz, J-Boog & Raz-B', copy: 'Explore individual child networks to get exclusive updates, behind-the-scenes content, and solo releases from all four members.', image: 'https://www.vibe.com/wp-content/uploads/2019/05/B2K-vibe-magazine-digital-cover-1557942120.jpg', link: '#child-networks-slider' }
  ];

  const KPLE_HERO_SLIDES = [
    { school: 'TCT Network', short: 'TCT', subtitle: 'Share the Word of God', copy: 'TCT Network provides quality Christian television programming 24 hours a day, featuring teaching, music, and ministries.', image: '/n2n/kple_hero_tct.png', link: '/?tenant=05b1ac75-a8ed-42d2-a147-c139f389cc35' },
    { school: 'Smile of a Child', short: 'Smile', subtitle: 'Faith-filled Children', copy: 'Inspiring children with faith-filled programs, cartoon series, Bible lessons, and positive, educational entertainment.', image: '/n2n/kple_hero_smile.png', link: '/?tenant=ffa6fa1b-9597-4734-a086-32b113959c8a' },
    { school: 'Positiv', short: 'Positiv', subtitle: 'Family Movies & Stories', copy: 'Good stories and positive family-friendly movies that inspire hope, encourage values, and bring families together.', image: '/n2n/kple_hero_positiv.png', link: '/?tenant=3de7bfde-e4e4-4d80-88ca-9f4724bd0c85' },
    { school: 'The Walk TV', short: 'The Walk', subtitle: 'Christian Lifestyle', copy: 'Walk in faith every day with practical Christian living programming, outdoor shows, talk programs, and ministry feeds.', image: '/n2n/kple_hero_thewalk.png', link: '/?tenant=273a7d16-0533-4a98-92cb-62ad90f08ffa' },
    { school: 'Enlace USA', short: 'Enlace', subtitle: 'Inspirando tu Vida', copy: 'Programación en español de alta calidad que transmite esperanza, fe y valores para la comunidad hispana en EE.UU.', image: '/n2n/kple_hero_enlace.png', link: '/?tenant=5699e417-4b64-4a95-90e2-f813223fdd32' },
    { school: 'Attention Central Texas', short: 'ACT', subtitle: 'Local Community News', copy: "Christian Revival Network's flagship local program featuring interviews from local churches, non-profit organizations, and community events.", image: '/n2n/kple_hero_act.png', link: '/?tenant=0421af68-56cb-4735-b7ee-f72454963bdd' },
  ];

  const VIBE_100_HERO_SLIDES = [
    { school: 'AVO Channel', short: 'AVO', subtitle: 'VIBE 100', copy: 'Premium college lifestyle and gameday apparel.', image: '/n2n/baylor.png', link: '/?tenant=100a0000-c08f-4260-8540-a0cc8bed4e11' },
    { school: 'Muscle & Fitness Channel', short: 'Muscle & Fitness', subtitle: 'VIBE 100', copy: 'The ultimate resource for bodybuilding, workouts, nutrition, and fitness.', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200', link: '/?tenant=100b0000-c08f-4260-8540-a0cc8bed4e11' },
    { school: 'B2K Channel', short: 'B2K', subtitle: 'VIBE 100', copy: 'Celebrate 25 years of multi-platinum hits and boy band legacy.', image: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-5-1557518926.jpg', link: '/?tenant=100c0000-c08f-4260-8540-a0cc8bed4e11' },
    { school: 'Christian Revival Channel', short: 'Christian Revival', subtitle: 'VIBE 100', copy: 'Inspirational programming, local community news, and sermons.', image: '/kple_network_thumbnail.png', link: '/?tenant=100d0000-c08f-4260-8540-a0cc8bed4e11' },
    // { school: 'FINFIRE Channel', short: 'FINFIRE', subtitle: 'VIBE 100', copy: 'Empowering financial freedom, investment guides, and real estate strategy.', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200', link: '/?tenant=100e0000-c08f-4260-8540-a0cc8bed4e11' }
  ];

  const HERO_SLIDES = (config?.theme?.heroSlider && config.theme.heroSlider.length > 0)
    ? config.theme.heroSlider.map((s: any) => {
        const rawVideo = s.videoUrl || '';
        const isActualVideo = rawVideo && (
          rawVideo.includes('youtube.com') ||
          rawVideo.includes('youtu.be') ||
          rawVideo.includes('vimeo.com') ||
          rawVideo.endsWith('.mp4') ||
          rawVideo.endsWith('.webm')
        );
        return {
          id: s.id,
          school: s.title,
          short: s.short || s.title,
          subtitle: s.subtitle || 'Featured Slide',
          copy: s.copy || '',
          image: s.imageUrl,
          videoUrl: isActualVideo ? rawVideo : '',
          link: s.buttonLink || rawVideo || s.linkUrl || '',
          buttonText: s.buttonText || ''
        };
      })
    : ((config?.theme?.heroImage || config?.theme?.heroCopy)
      ? [{
          school: config.name || '',
          short: config.name || '',
          subtitle: 'Welcome',
          copy: config.theme.heroCopy || '',
          image: config.theme.heroImage || '',
          link: config.theme.shopifyUrl || ''
        }]
      : (isOlympian 
        ? OLYMPIAN_HERO_SLIDES 
        : (isMf 
          ? MUSCLE_FITNESS_HERO_SLIDES
          : (isB2K 
            ? B2K_HERO_SLIDES 
            : (isKple 
              ? KPLE_HERO_SLIDES 
              : (isVibe100 
                ? VIBE_100_HERO_SLIDES 
                : AVO_HERO_SLIDES))))));

  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [HERO_SLIDES.length]);

  useEffect(() => {
    setIsHeroMuted(true);
  }, [heroSlide]);

  return (
    <>
      {/* ═══ shopavo.la Hero — Identical Recreation ═══ */}
      <div style={{ position: 'relative', width: '100%', height: isOlympian || isMf ? '80vh' : '100vh', backgroundColor: '#000', overflow: 'hidden' }}>
        
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
            {(isOlympian && (heroSlide % HERO_SLIDES.length) === 0) ? (
              <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <iframe
                  ref={heroIframeRef}
                  src={`https://www.youtube.com/embed/njSC3gMfjjU?autoplay=1&mute=1&loop=1&playlist=njSC3gMfjjU&controls=0&showinfo=0&rel=0&start=56&enablejsapi=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
                  title="Mr. Olympia Hero Promo Video"
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    width: '100vw',
                    height: '56.25vw', /* 16:9 ratio */
                    minHeight: isOlympian || isMf ? '80vh' : '100vh',
                    minWidth: isOlympian || isMf ? '142.22vh' : '177.77vh', /* 16:9 ratio */
                    transform: 'translateX(-50%) scale(1.05)',
                    transformOrigin: 'top center',
                    border: 'none',
                    pointerEvents: 'none'
                  }}
                  allow="autoplay; encrypted-media; fullscreen"
                />
              </div>
            ) : (HERO_SLIDES[heroSlide % HERO_SLIDES.length]?.videoUrl ? (
              <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <iframe
                  src={HERO_SLIDES[heroSlide % HERO_SLIDES.length].videoUrl}
                  title={HERO_SLIDES[heroSlide % HERO_SLIDES.length]?.school}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100vw',
                    height: '56.25vw', /* 16:9 ratio */
                    minHeight: '100vh',
                    minWidth: '177.77vh', /* 16:9 ratio */
                    transform: 'translate(-50%, -50%) scale(1.15)',
                    border: 'none',
                    pointerEvents: 'none'
                  }}
                  allow="autoplay; encrypted-media; fullscreen"
                />
              </div>
            ) : (
              <img
                src={HERO_SLIDES[heroSlide % HERO_SLIDES.length]?.image}
                alt={HERO_SLIDES[heroSlide % HERO_SLIDES.length]?.school}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
            ))}
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
              onClick={() => {
                const currentSlide = HERO_SLIDES[heroSlide % HERO_SLIDES.length];
                const hasCustomSlides = config?.theme?.heroSlider && config.theme.heroSlider.length > 0;
                if (isKple && !hasCustomSlides) return; // Go nowhere for now
                if (currentSlide.videoUrl && (!currentSlide.link || currentSlide.link === currentSlide.videoUrl)) {
                  setActiveVideo({
                    id: currentSlide.id || heroSlide.toString(),
                    title: currentSlide.school || currentSlide.title || '',
                    videoUrl: currentSlide.videoUrl,
                    image: currentSlide.image || currentSlide.imageUrl || ''
                  });
                } else if (currentSlide.link) {
                  if (currentSlide.link.startsWith('http')) {
                    window.open(currentSlide.link, '_blank');
                  } else {
                    window.location.href = mergeQueryParams(currentSlide.link, window.location.search);
                  }
                } else {
                  window.location.href = mergeQueryParams('/shop', window.location.search);
                }
              }}
              style={{
                display: 'inline-block', padding: '13px 40px', fontSize: '11px', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '2.5px',
                background: 'transparent', color: '#fff',
                border: '1.5px solid #fff', cursor: (isKple && !(config?.theme?.heroSlider && config.theme.heroSlider.length > 0)) ? 'default' : 'pointer',
                transition: 'all 0.25s',
              }}
              onMouseOver={e => {
                if (isKple && !(config?.theme?.heroSlider && config.theme.heroSlider.length > 0)) return;
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#000';
              }}
              onMouseOut={e => {
                if (isKple && !(config?.theme?.heroSlider && config.theme.heroSlider.length > 0)) return;
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#fff';
              }}
            >
              {(() => {
                const currentSlide = HERO_SLIDES[heroSlide % HERO_SLIDES.length];
                if (currentSlide.buttonText) return currentSlide.buttonText;
                if (currentSlide.videoUrl) return "Play Video";
                if (config?.theme?.shopifyUrl && !config.theme.shopifyUrl.includes('shop')) return "Visit Website";
                return isOlympian ? "View Schedule" : (isMf ? "Read Workouts" : (isB2K ? "Learn More" : (isKple ? "Watch Network" : (isVibe100 ? "Enter Channel" : "Shop Now"))));
              })()}
            </button>

            {/* Fundraising / Legacy stat */}
            {!isWings && !isHers && !isFlex && (
              <div style={{
                marginTop: '32px', padding: '16px 24px',
                borderLeft: `3px solid ${accent}`,
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
              }}>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1.2 }}>
                  {isOlympian ? '50+ Years' : (isMf ? '85+ Years' : (isB2K ? '25 Years' : (isKple ? '30+ Years' : (isVibe100 ? 'Top 100' : '$17,480,130'))))}<span style={{ color: accent }}>{isVibe100 ? '' : '+'}</span>
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  {isOlympian ? 'Of Championing Legendary Athletes & Fitness Excellence' : (isMf ? 'Of Providing World-Class Fitness Advice, Training & Nutrition Blueprints' : (isB2K ? 'Of R&B Harmonies, Multi-Platinum Hits & Tour Legacies' : (isKple ? 'Serving Central Texas with Inspirational Programming' : (isVibe100 ? 'Ecosystem Networks Displaying Posts and Content' : 'Raised to empower student‑athletes nationwide'))))}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Mute/Unmute and Volume Slider Pill */}
        {isOlympian && (heroSlide % HERO_SLIDES.length) === 0 && (
          <div
            onMouseEnter={() => setIsVolumeHovered(true)}
            onMouseLeave={() => setIsVolumeHovered(false)}
            style={{
              position: 'absolute',
              bottom: '120px',
              right: '30px',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 15, 15, 0.75)',
              backdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '4px',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <button
              onClick={toggleHeroMute}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              title={isHeroMuted ? "Unmute Video" : "Mute Video"}
            >
              {isHeroMuted || heroVolume === 0 ? (
                <VolumeX size={18} />
              ) : heroVolume < 50 ? (
                <Volume1 size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
            <div
              style={{
                width: isVolumeHovered ? '80px' : '0px',
                opacity: isVolumeHovered ? 1 : 0,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={isHeroMuted ? 0 : heroVolume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                style={{
                  width: '70px',
                  height: '4px',
                  WebkitAppearance: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  outline: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  margin: '0 8px 0 4px',
                  accentColor: accent,
                  transition: 'background 0.2s',
                }}
              />
            </div>
          </div>
        )}

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
      {!isKple && (
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Suspense fallback={null}>
            <CollegeTicker accent={config.accent} isOlympian={isOlympian} isB2K={isB2K} isKple={isKple} isWings={config?.id === 'wings-of-strength-tenant-id'} />
          </Suspense>
        </div>
      )}

      <main style={{ background: 'var(--bg-color)', paddingBottom: '100px', zIndex: 10, position: 'relative', width: '100%' }}>

        {/* ── Mr. & Mrs. Olympia Slider ──────────────────────── */}
        {isOlympian && (
          <div id="olympia-champions-slider">
            <SliderSection
              title="MR. & MRS. OLYMPIA"
              items={OLYMPIA_CHAMPIONS}
              delay={0}
              aspectRatio="1/1"
              cardsPerView={4}
              onItemClick={(item) => navigate('/profile/' + item.id + window.location.search)}
            />
          </div>
        )}

        {/* ── Child Networks Section (Slider or KPLE Introduction Call to Action) ── */}
        {isKple ? (
          <div id="child-networks-slider" style={{ maxWidth: '1400px', margin: '20px auto 40px', padding: '0 40px' }}>
            {/* Title styled exactly like SliderSection header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '16px', letterSpacing: '-0.5px' }}>
                <span style={{ width: '4px', height: '24px', borderRadius: '4px', background: accent, boxShadow: `0 0 10px ${accent}` }} />
                <span style={{ color: 'var(--text-primary)' }}>CHRISTIAN REVIVAL NETWORKS</span>
              </h2>
            </div>

            {/* Brand New Call to Action Banner introducing the KPLE parent network */}
            <div className="banner-flex-container" style={{
              position: 'relative', overflow: 'hidden',
              display: 'flex', minHeight: '340px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: '#000',
            }}>
              {/* Left — Image */}
              <div className="banner-image-column" style={{
                flex: '0 0 45%', position: 'relative', overflow: 'hidden',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800"
                  alt="KPLE TV Cross"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #000 100%)' }} />
              </div>

              {/* Right — Content */}
              <div className="banner-text-column" style={{
                flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '48px 48px 48px 32px', position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', right: '-80px', top: '-40px',
                  width: '300px', height: '300px', borderRadius: '50%',
                  background: accent, filter: 'blur(120px)', opacity: 0.12,
                }} />

                <p style={{
                  fontSize: '13px', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '3px', color: accent, margin: '0 0 12px 0',
                }}>
                  KPLE TV-31 Broadcast
                </p>
                <h2 style={{
                  fontSize: '44px', fontWeight: 900, color: '#fff', margin: '0 0 16px 0',
                  lineHeight: 1.15, letterSpacing: '-1px', textTransform: 'uppercase',
                }}>
                  KPLE TV-31<br />Christian Television
                </h2>
                <p style={{
                  fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7,
                  margin: '0 0 32px 0', maxWidth: '520px',
                }}>
                  Welcome to KPLE TV-31, your local source for faith, family, and community-centered programming. Serving Central Texas and streaming worldwide, we are dedicated to broadcasting the message of Jesus Christ 24 hours a day through inspiring sermons, teaching, educational programs, and local community stories.
                </p>
                <a
                  href={mergeQueryParams('/?tenant=100d0000-c08f-4260-8540-a0cc8bed4e01', typeof window !== 'undefined' ? window.location.search : '')}
                  style={{
                    display: 'inline-block', padding: '15px 46px', fontSize: '13px', fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '2.5px', width: 'fit-content',
                    background: 'transparent', color: '#fff',
                    border: '1.5px solid #fff', textDecoration: 'none',
                    transition: 'all 0.25s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                >
                  Watch KPLE Live
                </a>
              </div>
            </div>
          </div>
        ) : (
          childItems.length > 0 && (
            <div id="child-networks-slider">
              <SliderSection
                title={isOlympian ? "OLYMPIA PARTNERS" : (isMf ? "MUSCLE & FITNESS NETWORKS" : (isB2K ? "B2K MEMBERS" : (isVibe100 ? "VIBE 100 NETWORKS" : "AVO NETWORKS")))}
                items={(() => {
                  if (isMfFamily) {
                    const mfNetworkItems = [];
                    if (!isMf) {
                      mfNetworkItems.push({
                        id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11',
                        title: 'Muscle & Fitness',
                        image: '/n2n/muscle_fitness_logo.png',
                        tags: ['Network'],
                        videoUrl: '',
                        linkUrl: '/?tenant=7a017c4d-c08f-4260-8540-a0cc8bed4e11',
                        accent: '#E31B23'
                      });
                    }
                    if (!isOlympian) {
                      const mrO = childItems.find(item => item.id === '7a017c4d-c08f-4260-8540-a0cc8bed4e12' || (item.title || '').toLowerCase().includes('olympia'));
                      if (mrO) {
                        mfNetworkItems.push(mrO);
                      } else {
                        mfNetworkItems.push({
                          id: '7a017c4d-c08f-4260-8540-a0cc8bed4e12',
                          title: 'Mr. Olympia',
                          image: '/n2n/mr_olympia_logo.png',
                          tags: ['Network'],
                          videoUrl: '',
                          linkUrl: '/?tenant=7a017c4d-c08f-4260-8540-a0cc8bed4e12',
                          accent: '#D4AF37'
                        });
                      }
                    }
                    if (config?.id !== 'wings-of-strength-tenant-id') {
                      mfNetworkItems.push({
                        id: 'wings-of-strength-tenant-id',
                        title: 'Wings of Strength',
                        image: 'https://wingsofstrength.net/wp-content/uploads/2025/02/27/inner-page-logo-min-1.png',
                        tags: ['Network', 'FullBleed'],
                        videoUrl: '',
                        linkUrl: '/?tenant=wings-of-strength-tenant-id',
                        accent: '#FF9D00'
                      });
                    }
                    if (config?.id !== 'mf-hers-tenant-id') {
                      mfNetworkItems.push({
                        id: 'mf-hers-tenant-id',
                        title: 'M&F Hers',
                        image: '/n2n/mf_hers_bodybuilder.jpg',
                        tags: ['Network', 'FullBleed'],
                        videoUrl: '',
                        linkUrl: '',
                        accent: '#E31B23'
                      });
                    }
                    if (config?.id !== 'flex-online-tenant-id') {
                      mfNetworkItems.push({
                        id: 'flex-online-tenant-id',
                        title: 'Flex Online',
                        image: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2026/06/Bodybuilders-Mike-Mentzer-and-Dorian-Yates-training-and-mentoring-the-young-bodybuilder-on-the-Maximum-Results-training-method.jpg',
                        tags: ['Network', 'FullBleed'],
                        videoUrl: '',
                        linkUrl: '',
                        accent: '#E31B23'
                      });
                    }
                    return mfNetworkItems;
                  }
                  return childItems;
                })()}
                delay={isOlympian || isMf ? 0.1 : 0}
                aspectRatio="16/9"
                cardsPerView={isMf ? 4 : (isOlympian ? 3 : 4)}
                onItemClick={(item) => {
                  if (item.id === 'mf-hers-tenant-id' || item.id === 'flex-online-tenant-id') {
                    return; // Don't link anywhere for now
                  }
                  if (item.linkUrl) {
                    if (item.linkUrl.startsWith('http')) {
                      window.open(item.linkUrl, '_blank');
                    } else {
                      window.location.href = mergeQueryParams(item.linkUrl, window.location.search);
                    }
                  }
                }}
              />
            </div>
          )
        )}

        {/* ── Wings of Strength Legends & Champions Slider ────── */}
        {isWings && (
          <div id="wings-legends-slider" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <SliderSection
              title="LEGENDS & CHAMPIONS"
              items={WINGS_LEGENDS}
              delay={0.1}
              aspectRatio="1/1"
              cardsPerView={4}
              onItemClick={(item) => {
                // Button goes nowhere for now
              }}
            />
          </div>
        )}

        {/* ── Watch Live ──────────────────────────────────────── */}
        <div id="whats-on-now">
          <Suspense fallback={null}>
            <WatchLive accent={config.accent} isOlympian={isOlympian} isMf={isMf} isB2K={isB2K} isVibe={isVibe} isKple={isKple} isVibe100={isVibe100} tenantId={config?.id} />
          </Suspense>
        </div>

        {/* ── Wings of Strength Athletes Slider ────────────────── */}
        {isWings && (
          <div id="wings-athletes-slider" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <SliderSection
              title="ATHLETES"
              items={WINGS_ATHLETES}
              delay={0.1}
              aspectRatio="1/1"
              cardsPerView={4}
              onItemClick={(item) => {
                // Button goes nowhere for now
              }}
            />
          </div>
        )}

        {isMf && (
          <Suspense fallback={null}>
            <MFRSSFeed accent={accent} />
          </Suspense>
        )}

        {/* ── New Drop CTA Banner (disabled for KPLE since it is moved to the top) ── */}
        {!isKple && (
          <section style={{ maxWidth: '1400px', margin: '20px auto 40px', padding: '0 40px' }}>
            <div className="banner-flex-container" style={{
              position: 'relative', overflow: 'hidden',
              display: 'flex', minHeight: '340px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: '#000',
            }}>
              {/* Left — Image */}
              <div className="banner-image-column" style={{
                flex: '0 0 45%', position: 'relative', overflow: 'hidden',
              }}>
                {isOlympian || isMf || isVibe ? (
                  <iframe
                    src="https://www.youtube.com/embed/njSC3gMfjjU?autoplay=1&mute=1&loop=1&playlist=njSC3gMfjjU&controls=0&showinfo=0&rel=0&start=56"
                    title="Mr. Olympia Promo Video"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      display: 'block',
                      pointerEvents: 'none',
                      transform: 'scale(1.35)',
                      transformOrigin: 'center',
                    }}
                    allow="autoplay; encrypted-media; fullscreen"
                  />
                ) : (
                  <img
                    src={isMf ? "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800" : isWings ? "/n2n/wings_rising_phoenix_poster.jpg" : (isB2K ? "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" : (isKple ? "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800" : (isVibe100 ? "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800" : "https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820")))}
                    alt={isMf ? "Workout Gear" : isWings ? "Wings Contest Event" : (isB2K ? "Official Tour Merch" : (isKple ? "Support CRN" : (isVibe100 ? "Official Merch" : "New Drop")))}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #000 100%)' }} />
                {/* NEW DROP / OFFICIAL GEAR pill */}
                <div style={{
                  position: 'absolute', top: '24px', left: '24px',
                  padding: '6px 14px', background: accent, color: '#000',
                  fontSize: '10px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase',
                }}>
                  {isOlympian || isVibe ? "Live Webcast" : isMf ? "Workout Gear" : isWings ? "Wings Contest" : (isB2K ? "Official Merch" : (isKple ? "Media Mission" : (isVibe100 ? "Exclusive Gear" : "New Drop")))}
                </div>
              </div>

              {/* Right — Content */}
              <div className="banner-text-column" style={{
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
                  fontSize: '13px', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '3px', color: accent, margin: '0 0 12px 0',
                }}>
                  {isOlympian || isVibe ? "Olympia PPV Webcast" : isMf ? "Fitness Collection" : isWings ? "Wings of Strength" : (isB2K ? "Official Tour Merch" : (isKple ? "Support Our Mission" : (isVibe100 ? "VIBE 100 Store" : "Summer 2026 Collection")))}
                </p>
                <h2 style={{
                  fontSize: '44px', fontWeight: 900, color: '#fff', margin: '0 0 16px 0',
                  lineHeight: 1.15, letterSpacing: '-1px', textTransform: 'uppercase',
                }}>
                  {isOlympian || isVibe ? (
                    <>Watch Mr. Olympia<br />Live Webcast</>
                  ) : isMf ? (
                    <>Muscle & Fitness<br />Training Guides</>
                  ) : isWings ? (
                    <>Rising Phoenix<br />World Champions</>
                  ) : (
                    isB2K ? (
                      <>Millennium Tour<br />Official Merch</>
                    ) : (
                      isKple ? (
                        <>Keep The Gospel<br />On The Air</>
                      ) : (
                        isVibe100 ? (
                          <>Network Official<br />Collection</>
                        ) : (
                          <>Game Day<br />Essentials</>
                        )
                      )
                    )
                  )}
                </h2>
                <p style={{
                  fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7,
                  margin: '0 0 32px 0', maxWidth: '520px',
                }}>
                  {isOlympian || isVibe ? "Experience the pinnacle of bodybuilding live from anywhere in the world. Subscribe to the official webcast to stream the 62nd Mr. Olympia pre-judging, finals, and exclusive backstage interviews live in high-definition." : isMf ? "Explore premium workouts, digital training guides, and high-performance activewear designed to take your fitness to the next level." : isWings ? "Experience the pinnacle of professional women's bodybuilding. Purchase official pay-per-view live streams, secure event tickets, and browse the official Alina Popa & Rising Phoenix championship collections." : (isB2K ? "Pre-order exclusive Boys 4 Life tour hoodies, vintage graphic tees, and autographed vinyl. Rep the legendary boy band reunion in style." : (isKple ? "The Christian Revival Network is a 501(c)3 non-profit media mission. Your donations help us broadcast the Gospel 24/7 to Central Texas and the world. Support our ministry today." : (isVibe100 ? "Explore premium merchandise, albums, and exclusive releases from all Top 100 networks. Shop official gear and support your favorite channels." : "Premium collegiate apparel for every school in the AVO family. Rep your team with style — new colorways and exclusive designs just dropped.")))}
                </p>
                <a
                  href={isOlympian || isVibe ? "https://www.olympiaproductions.com/" : (isWings ? "https://wingsofstrength.net/" : (isKple ? "https://www.paypal.com/donate/?hosted_button_id=A7WXAKZEAGBPA" : (isMf ? "https://www.muscleandfitness.com/" : ('/shop' + (typeof window !== 'undefined' ? window.location.search : '')))))}
                  target={isOlympian || isVibe || isWings || isKple || isMf ? "_blank" : "_self"}
                  style={{
                    display: 'inline-block', padding: '15px 46px', fontSize: '13px', fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '2.5px', width: 'fit-content',
                    background: 'transparent', color: '#fff',
                    border: '1.5px solid #fff', textDecoration: 'none',
                    transition: 'all 0.25s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                >
                  {isOlympian || isVibe ? "Watch Webcast" : isMf ? "Shop Store" : isWings ? "Explore Shows" : (isB2K ? "Shop The Merch" : (isKple ? "Support Our Station" : (isVibe100 ? "Shop The Collection" : "Shop The Drop")))}
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ── AVO Campus Athletes / KPLE Channel Profiles Slider ──────────────────────── */}
        {((isAvo || isKple) && athleteItems.length > 0) && (
          <div id="avo-athletes-slider">
            <SliderSection
              title={isKple ? "CHANNEL PROFILES" : "CAMPUS ATHLETES"}
              items={athleteItems}
              delay={0.1}
              aspectRatio="1/1"
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
            <ChildNetworkFeeds parentId={config.id} accent={accent} isOlympian={isOlympian} isMf={isMf} isB2K={isB2K} />
          </Suspense>
        )}

        {/* ── Mr. Olympia Gymreapers Gear CTA Banner ── */}
        {isOlympian && (
          <section style={{ maxWidth: '1400px', margin: '20px auto 40px', padding: '0 40px' }}>
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
                backgroundImage: 'url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200")',
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'brightness(0.3)'
              }} />
              {/* Gradient Overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)' }} />

              <div className="banner-full-bleed-content" style={{
                position: 'relative', zIndex: 2,
                padding: '64px 60px', maxWidth: '640px',
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 14px', background: accent, color: '#000',
                  fontSize: '10px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase',
                  marginBottom: '20px',
                }}>
                  🔥 Limited Edition Drop
                </div>
                <h2 style={{
                  fontSize: '38px', fontWeight: 900, color: '#fff', margin: '0 0 16px 0',
                  lineHeight: 1.1, letterSpacing: '-1px', textTransform: 'uppercase',
                }}>
                  Gymreapers x Olympia<br />Official Collection
                </h2>
                <p style={{
                  fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
                  margin: '0 0 28px 0',
                }}>
                  Shop the official Gymreapers Mr. Olympia collaboration. Premium weightlifting belts, lifting straps, wraps, and apparel engineered for elite performance and styled with the iconic Olympia golden crest.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <a
                    href="https://www.gymreapers.com/collections/olympia-collection?utm_source=Website&utm_medium=Olympia&utm_campaign=Web+Banner&utm_id=Olympia&utm_term=limited+drop"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block', padding: '14px 44px', fontSize: '11px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '2.5px',
                      background: accent, color: '#000',
                      border: 'none', textDecoration: 'none', transition: 'all 0.25s',
                      cursor: 'pointer'
                    }}
                    onMouseOver={e => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    Shop Collection
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Muscle & Fitness Sponsors Slider ──────────────────── */}
        {(isMfFamily && (childItems.length > 0 || config?.id === 'wings-of-strength-tenant-id')) && (
          <div id="mf-sponsors-slider" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <SliderSection
              title="SPONSORS"
              items={config?.id === 'wings-of-strength-tenant-id' ? WINGS_SPONSORS : childItems.filter(item => {
                const isCurrent = (item.title || '').toLowerCase() === (config?.name || '').toLowerCase() || item.id === config?.id;
                const isOlympia = (item.title || '').toLowerCase().includes('olympia');
                const isMediaNetwork = item.id === 'wings-of-strength-tenant-id' || 
                                       item.id === 'mf-hers-tenant-id' || 
                                       item.id === 'flex-online-tenant-id' ||
                                       item.id === '7a017c4d-c08f-4260-8540-a0cc8bed4e11' ||
                                       item.id === '7a017c4d-c08f-4260-8540-a0cc8bed4e12';
                return !isCurrent && !isOlympia && !isMediaNetwork;
              }).map(item => {
                const lowerTitle = (item.title || '').toLowerCase();
                let linkUrl = item.linkUrl;
                if (lowerTitle.includes('gymshark')) linkUrl = 'https://www.gymshark.com/';
                else if (lowerTitle.includes('gaspari')) linkUrl = 'https://gasparinutrition.com/';
                else if (lowerTitle.includes('gold')) linkUrl = 'https://www.goldsgym.com/';
                else if (lowerTitle.includes('rogue')) linkUrl = 'https://www.roguefitness.com/';
                else if (lowerTitle.includes('redcon')) linkUrl = 'https://redcon1.com/';
                return { ...item, linkUrl };
              })}
              delay={0}
              aspectRatio="16/9"
              cardsPerView={4}
              onItemClick={(item) => {
                if (item.linkUrl) {
                  if (item.linkUrl.startsWith('http')) {
                    window.open(item.linkUrl, '_blank');
                  } else {
                    window.location.href = mergeQueryParams(item.linkUrl, window.location.search);
                  }
                }
              }}
            />
          </div>
        )}

        {/* ── Hoodie Competition Banner / Prayer Request Banner ── */}
        {!isMfFamily && !isB2K && !isVibe100 && (
          <section style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 40px' }}>
            <div style={{
              position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#000',
            }}>
              {/* Background image — full bleed */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${isKple ? "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1200" : "/n2n/hoodie-competition.png"})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'brightness(0.35)',
              }} />
              {/* Gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)' }} />

              <div className="banner-cta-container" style={{
                position: 'relative', zIndex: 2,
                padding: '64px 60px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px',
              }}>
                {/* Left — Content */}
                <div className="banner-cta-content" style={{ maxWidth: '520px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '6px 14px', background: accent, color: '#000',
                    fontSize: '10px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase',
                    marginBottom: '20px',
                  }}>
                    {isKple ? "🙏 Prayer Request" : "🏆 Competition"}
                  </div>
                  <h2 style={{
                    fontSize: '38px', fontWeight: 900, color: '#fff', margin: '0 0 14px 0',
                    lineHeight: 1.1, letterSpacing: '-1px', textTransform: 'uppercase',
                  }}>
                    {isKple ? <>Need Prayer?<br />We Are Here</> : <>Best College<br />Hoodie Design</>}
                  </h2>
                  <p style={{
                    fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
                    margin: '0 0 24px 0',
                  }}>
                    {isKple 
                      ? "Sometimes, all it takes is just one prayer to change everything. You are not alone, and our prayer warriors are here to stand with you. Call our prayer line or send a request."
                      : "All 8 AVO schools go head-to-head. Which campus created the best branded hoodie? Browse the entries, rep your school, and cast your vote."
                    }
                  </p>

                  {/* School pills or prayer phone */}
                  {!isKple ? (
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
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>
                        📞 Toll Free: <a href="tel:8776405673" style={{ color: accent, textDecoration: 'none' }}>(877) 640-5673</a>
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (isKple) {
                        window.location.href = 'mailto:prayer@kpletv.org?subject=Prayer Request';
                      } else {
                        setIsHoodieVoteOpen(true);
                      }
                    }}
                    style={{
                      display: 'inline-block', padding: '14px 44px', fontSize: '11px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '2.5px',
                      background: accent, color: '#000',
                      border: 'none', textDecoration: 'none',
                      transition: 'all 0.25s',
                      cursor: 'pointer'
                    }}
                    onMouseOver={e => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    {isKple ? "Send Prayer Request" : "Vote Now"}
                  </button>
                </div>

                {/* Right — Image */}
                <div className="banner-cta-right" style={{ flexShrink: 0, width: '320px', position: 'relative' }}>
                  <img
                    src={isKple ? "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600" : "/n2n/hoodie-competition.png"}
                        alt={isKple ? "Prayer Request" : "College Hoodie Competition"}
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



        {/* ── AVO Summer Concert Tour Banner / B2K Tour Banner / Mr. Olympia CTA ── */}
        {!isKple && !isVibe100 && !isWings && !isHers && !isFlex && (
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
                backgroundImage: `url(${(isMf || isOlympian) ? "/n2n/derek.jpeg" : (isB2K ? "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200" : "/n2n/concert_in_the_park.png")})`,
                backgroundSize: 'cover', backgroundPosition: (isMf || isOlympian) ? '125% center' : 'center 35%',
                filter: 'brightness(0.35)'
              }} />
              {/* Gradient Overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />

              <div className="banner-full-bleed-content" style={{
                position: 'relative', zIndex: 2,
                padding: '64px 60px', maxWidth: '640px',
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 14px', background: (isMf || isOlympian || isB2K) ? accent : 'linear-gradient(90deg, #FF512F, #DD2476)', color: (isMf || isOlympian || isB2K) ? '#000' : '#fff',
                  fontSize: '10px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase',
                  marginBottom: '20px',
                }}>
                  {isMf || isOlympian ? "🏆 Joe Weider's Mr. Olympia Weekend" : (isB2K ? "🎤 The Millennium Tour" : "🎸 Summer 2026 Tour")}
                </div>
                <h2 style={{
                  fontSize: '38px', fontWeight: 900, color: '#fff', margin: '0 0 16px 0',
                  lineHeight: 1.1, letterSpacing: '-1px', textTransform: 'uppercase',
                }}>
                  {isMf || isOlympian ? <>62nd Mr. Olympia<br />Las Vegas 2026</> : (isB2K ? <>The Boys 4 Life<br />Reunion Tour</> : <>AVO Summer<br />Concert Tour</>)}
                </h2>
                <p style={{
                  fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
                  margin: '0 0 28px 0',
                }}>
                  {isMf || isOlympian ? "The ultimate fitness event of the year returns to Las Vegas, Nevada on September 24-27, 2026. Get your tickets to witness bodybuilding history live as elite champions from around the globe battle for the prestigious Sandow Trophy." : (isB2K ? "B2K is back on stage celebrating their 25th anniversary. The 28-city reunion tour features Bow Wow, Jeremih, Pretty Ricky, Amerie, and more, kicking off in Columbia, SC, and routing across the country. Don't miss this historic R&B reunion live! " : "Catch the vibes live! AVO is hitting the road this summer, bringing your favorite bands and artists to collegiate campus parks nationwide. Grab your crew, rep your school colors, and experience the ultimate summer soundtrack.")}
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      if (isMf || isOlympian) {
                        window.open("https://mrolympia.com/ticket-type", "_blank");
                      } else if (isB2K) {
                        window.open("https://b2kofficial.com/tour", "_blank");
                      }
                    }}
                    style={{
                      display: 'inline-block', padding: '14px 44px', fontSize: '11px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '2.5px',
                      background: accent, color: '#000',
                      border: 'none', transition: 'all 0.25s',
                      cursor: 'pointer'
                    }}
                    onMouseOver={e => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    {isMf || isOlympian ? "Get Tickets" : "Buy Now"}
                  </button>
                  <button
                    onClick={() => {
                      if (isMf || isOlympian) {
                        window.open("https://mrolympia.com/weekend-schedule", "_blank");
                      } else if (isB2K) {
                        window.location.hash = "#whats-on-now";
                      }
                    }}
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
                    {isMf || isOlympian ? "View Schedule" : "Join The Live Stream"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {isMf && (
          <div id="olympia-champions-slider-mf">
            <SliderSection
              title="MR. & MRS. OLYMPIA"
              items={OLYMPIA_CHAMPIONS}
              delay={0}
              aspectRatio="1/1"
              cardsPerView={4}
              onItemClick={(item) => navigate('/profile/' + item.id + window.location.search)}
            />
          </div>
        )}

        {/* ── College Sports News Feed ──────────────────────── */}
        {!isMfFamily && !isB2K && !isKple && (
          <Suspense fallback={null}>
            <CollegeNewsFeed accent={config.accent} />
          </Suspense>
        )}

        {/* ── M&F Sister Publications Banners ────────────────── */}
        {isMf && (
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
        {!isVibe100 && (
          <section style={{ maxWidth: '1400px', margin: '60px auto 0', padding: '0 40px' }}>
            <div style={{
              position: 'relative', borderRadius: '0', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)',
              background: '#000',
            }}>
              {/* Background image */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${isOlympian || isMf ? "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200" : isWings ? "/n2n/wings_phoenix_iron_games.jpg" : (isB2K ? "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200" : (isKple ? "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=1200" : "https://shopavo.la/cdn/shop/files/Homepage_Vanderbilt_Desktop2_c7f572ef-cd7e-4de4-bb9c-160b99884e08_1500x.jpg?v=1776284877"))})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'brightness(0.3)',
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)' }} />

              <div className="banner-cta-container" style={{ position: 'relative', zIndex: 2, padding: '80px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
                <div className="banner-cta-content" style={{ maxWidth: '550px' }}>
                  <p style={{
                    fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
                    letterSpacing: '3px', color: accent, marginBottom: '12px',
                  }}>
                    {isOlympian ? "Olympia Ambassadors" : isMf ? "Fitness Ambassadors" : isWings ? "Wings Ambassadors" : (isB2K ? "Street Team" : (isKple ? "Media Partner" : "Campus Ambassadors"))}
                  </p>
                  <h2 style={{
                    fontSize: '36px', fontWeight: 900, color: '#fff', margin: '0 0 16px 0',
                    lineHeight: 1.15, letterSpacing: '-1px', textTransform: 'uppercase',
                  }}>
                    {isOlympian || isMf ? (
                      <>Represent {config?.name || 'Muscle & Fitness'}<br />In Your Community</>
                    ) : isWings ? (
                      <>Represent Wings<br />Everywhere You Go</>
                    ) : (
                      isB2K ? (
                        <>B2K Street Team &amp;<br />Millennium Ambassador</>
                      ) : (
                        isKple ? (
                          <>Become A Partner &amp;<br />Support CRN</>
                        ) : (
                          <>Represent AVO<br />On Your Campus</>
                        )
                      )
                    )}
                  </h2>
                  <p style={{
                    fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0,
                  }}>
                    {isOlympian || isMf 
                      ? `Join the official ${config?.name || 'Muscle & Fitness'} Ambassador Program. Share fitness tips, review premium workout apparel, and earn exclusive event credentials, early access, and commissions.`
                      : isWings
                        ? "Join the official Wings of Strength Ambassador Program. Spread the passion for female bodybuilding, review premium strength gear, and earn exclusive event passes, backstage credentials, and athlete sponsorship perks."
                        : (isB2K 
                          ? "Join the official B2K Millennium Street Team. Promote the Boys 4 Life Tour, share new music updates, and earn exclusive backstage passes, VIP meet-and-greets, and limited edition merch."
                          : (isKple ? "Become a supporting partner of the Christian Revival Network. Join our media mission to keep the Gospel broadcasting 24/7. Your support enables us to continue revealing the love of Jesus Christ." : "Join the AVO Ambassador Program and bring premium college apparel to your school. Earn exclusive perks, early access to drops, and commissions on every sale.")
                        )}
                  </p>
                </div>
                <button
                  className="banner-cta-right"
                  onClick={() => {
                    if (isKple) {
                      window.open("https://members.kple-tv.org/", "_blank");
                    } else {
                      setIsAmbassadorOpen(true);
                    }
                  }}
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
                  {isKple ? "Join Now" : isWings ? "Become An Ambassador" : "More Info"}
                </button>
              </div>
            </div>
          </section>
        )}

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
