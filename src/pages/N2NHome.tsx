import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Network, Volume1, Volume2, VolumeX, Plus, FileText, Copy, Check, Sparkles } from 'lucide-react';
import SliderSection from '../components/SliderSection';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { getChildNetworks, mergeQueryParams, OLYMPIA_CHAMPIONS, WINGS_ATHLETES, WINGS_LEGENDS } from '../lib/n2n';
import { getN2NCategories } from '../api';
import type { Category, VideoItem, User } from '../types';
import { supabase } from '../supabaseClient';
import { isOlympianConfig, isMuscleFitnessConfig, isB2kConfig, isKpleConfig, isKpleOnlyConfig, isBonaireConfig } from '../lib/whitelabel';
import { KpleWatchPlayer } from '../components/KpleWatchPlayer';
import { KpleInlineWatchSection } from '../components/KpleInlineWatchSection';
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

export default function N2NHome({ wlConfig, categories, user, activeVideo, setActiveVideo }: N2NHomeProps) {
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

  const [childItems, setChildItems] = useState<any[]>([]);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [athleteItems, setAthleteItems] = useState<any[]>([]);
  const [kpleChannelVideos, setKpleChannelVideos] = useState<any[]>([]);
  const [showAllKpleVideosModal, setShowAllKpleVideosModal] = useState(false);
  const [videoDetailTab, setVideoDetailTab] = useState<'description' | 'transcript'>('description');
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [kpleSearchQuery, setKpleSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAmbassadorOpen, setIsAmbassadorOpen] = useState(false);
  const [isHoodieVoteOpen, setIsHoodieVoteOpen] = useState(false);
  const [activeNews, setActiveNews] = useState<any>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('admin_panel') === 'true') {
        setIsAdmin(true);
        return;
      }
      if (user?.id) {
        if (config?.owner_id === user.id) {
          setIsAdmin(true);
          return;
        }
        const { data: prof } = await supabase
          .from('profiles')
          .select('is_admin, role')
          .eq('id', user.id)
          .single();

        if (prof?.is_admin || prof?.role === 'admin' || prof?.role === 'influencer') {
          setIsAdmin(true);
          return;
        }
      }
      setIsAdmin(false);
    };
    checkAdmin();
  }, [user?.id, config?.owner_id]);

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

      if (isKpleConfig(config)) {
        const kpleChildren = await getChildNetworks('100d0000-c08f-4260-8540-a0cc8bed4e01');
        const crnChildren = await getChildNetworks('33742e2f-430b-4c2d-9cba-42507891ef02');
        const allKpleNets = [...children, ...kpleChildren, ...crnChildren];
        const uniqueMap = new Map();
        allKpleNets.forEach((c: any) => {
          if (c.id !== config.id && !uniqueMap.has(c.id)) {
            uniqueMap.set(c.id, c);
          }
        });
        children = Array.from(uniqueMap.values());
      }

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
          image: child.logoImage || child.logo || child.theme?.logoImage || child.heroImage || child.theme?.heroImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name)}&background=111&color=fff&size=400`,
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
        let query = supabase
          .from('profiles')
          .select('id, username, avatar_url, bio, whitelabel_id, created_at')
          .in('whitelabel_id', fetchIds)
          .neq('is_active', false);

        if (!isKpleActive) {
          query = query.eq('role', 'influencer');
        } else {
          query = query.in('role', ['influencer', 'admin', 'viewer']);
        }

        const { data: athletesData } = await query.order('created_at', { ascending: false });

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

        if (isKpleConfig(config)) {
          const fetchIds = Array.from(new Set([
            config.id,
            '100d0000-c08f-4260-8540-a0cc8bed4e01',
            '33742e2f-430b-4c2d-9cba-42507891ef02',
            'a0f7c22e-a3ab-4e3f-a3cf-e06cf0cb0bb0',
            ...childIds
          ]));

          const { data: creatorProfiles } = await supabase
            .from('profiles')
            .select('id, username, whitelabel_id')
            .in('whitelabel_id', fetchIds);

          const creatorIds = (creatorProfiles || []).map((p: any) => p.id);

          let query = supabase
            .from('videos')
            .select('*, whitelabel:whitelabel_configs(name), creator:profiles(username)')
            .order('created_at', { ascending: false });

          if (creatorIds.length > 0) {
            query = query.or(`whitelabel_id.in.(${fetchIds.join(',')}),creator_id.in.(${creatorIds.join(',')})`);
          } else {
            query = query.in('whitelabel_id', fetchIds);
          }

          const [vidsResult, episodesResult] = await Promise.all([
            query,
            supabase.from('episodes').select('*, series:series(title, creator_id)').order('created_at', { ascending: false })
          ]);

          const vidsData = vidsResult.data || [];
          const episodesData = episodesResult.data || [];

          if (!cancelled) {
            const nonLiveVideos = vidsData.filter((v: any) => {
              const url = (v.video_url || '').toLowerCase();
              const title = (v.title || '').toLowerCase();
              const tagsStr = (Array.isArray(v.tags) ? v.tags.join(' ') : (v.tags || '')).toLowerCase();
              return (
                !tagsStr.includes('live stream') &&
                !tagsStr.includes('livestream') &&
                !title.includes('live stream') &&
                !title.includes('livestream') &&
                !url.includes('.m3u8') &&
                !url.includes('stream.mux.com')
              );
            });

            const formattedVids = nonLiveVideos.map((v: any) => {
              const cName = v.whitelabel?.name || (v.creator?.username ? v.creator.username.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Channel Video');
              return {
                id: v.id,
                title: v.title,
                image: v.image_url,
                tags: [cName, 'Channel Video'],
                videoUrl: v.video_url,
                linkUrl: v.video_url,
                channelName: cName,
                description: v.description || '',
                transcript: v.transcript || ''
              };
            });

            const validEpisodes = episodesData.filter((ep: any) => {
              const title = (ep.title || '').toLowerCase();
              const url = (ep.video_url || '').toLowerCase();
              return (
                url &&
                (title.includes('doc wales') || title.includes('kple') || title.includes('crn') || ep.series?.title?.toLowerCase().includes('doc wales'))
              );
            }).sort((a: any, b: any) => {
              const numA = parseInt(a.title.match(/Episode\s+(\d+)/i)?.[1] || '0', 10);
              const numB = parseInt(b.title.match(/Episode\s+(\d+)/i)?.[1] || '0', 10);
              return numA - numB;
            });

            const formattedEpisodes = validEpisodes.map((ep: any) => {
              const cName = ep.series?.title || 'Doc Wales Diaries';
              return {
                id: ep.id,
                title: ep.title,
                image: ep.thumbnail_url || ep.image_url || 'https://st1-fs.cdn01.net/subchannels/0000027/0027085/0027085b2.jpg?v=3',
                tags: [cName, 'Episode'],
                videoUrl: ep.video_url,
                linkUrl: ep.video_url,
                channelName: cName,
                description: ep.description || 'Doc Wales Diaries episode featuring Dr. Steve Price on medical missions around the world.',
                transcript: ep.transcript || ''
              };
            });

            const combinedMap = new Map();
            [...formattedEpisodes, ...formattedVids].forEach(v => {
              if (!combinedMap.has(v.id)) {
                combinedMap.set(v.id, v);
              }
            });

            setKpleChannelVideos(Array.from(combinedMap.values()));
          }
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
  const isKpleOnly = isKpleOnlyConfig(config);
  const isBonaire = isBonaireConfig(config);

  const isAvo = config?.id === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7' ||
                config?.name?.toLowerCase().includes('avo');

  const isCourtneyBee = config?.id === 'cb000000-c08f-4260-8540-a0cc8bed4e11' ||
                        config?.name?.toLowerCase().includes('courtney bee network');

  const isVibe100 = config?.id === 'e5c100aa-c08f-4260-8540-a0cc8bed4e11' || 
                    config?.name?.toLowerCase().includes('vibe 100') ||
                    config?.domain?.includes('vibe100');

  const isVibe = !isVibe100 && !isBonaire && !isKple && !isB2K && !isMfFamily && (config?.name?.toLowerCase().includes('vibe') || 
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

  const BONAIRE_HERO_SLIDES = [
    {
      school: 'Bonaire Chamber of Commerce',
      short: 'Bonaire KvK',
      subtitle: 'KvK Bonaire N2N Network',
      copy: 'Promoting trade, commerce, and sustainable local business growth across Bonaire.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
      link: '/marketplace'
    },
    {
      school: 'Salt & Sea Handcrafted',
      short: 'Salt Shop',
      subtitle: 'Authentic Sea Salt Products',
      copy: 'Discover premium culinary sea salts and natural bath crystals hand-harvested from the pink salt pans of Bonaire.',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1200',
      link: '/?tenant=b0ea0001-c08f-4260-8540-a0cc8bed4e11'
    },
    {
      school: 'Diver\'s Paradise Gear',
      short: 'Dive Gear',
      subtitle: 'Dive Apparel & Snorkel Sets',
      copy: 'Equip your island adventure with premium eco-friendly diving shirts, rashguards, dry bags, and mask-snorkel combos.',
      image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=1200',
      link: '/?tenant=b0ea0002-c08f-4260-8540-a0cc8bed4e11'
    },
    {
      school: 'Cadushy Cactus Spirit',
      short: 'Cadushy Shop',
      subtitle: 'World\'s Only Cactus Liqueur',
      copy: 'Order authentic green cactus liqueurs, local rums, and Cadushy merchandise direct from the Rincon distillery.',
      image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=1200',
      link: '/?tenant=b0ea0004-c08f-4260-8540-a0cc8bed4e11'
    }
  ];

  const VIBE_100_HERO_SLIDES = [
    { school: 'AVO Channel', short: 'AVO', subtitle: 'VIBE 100', copy: 'Premium college lifestyle and gameday apparel.', image: '/n2n/baylor.png', link: '/?tenant=100a0000-c08f-4260-8540-a0cc8bed4e11' },
    { school: 'Muscle & Fitness Channel', short: 'Muscle & Fitness', subtitle: 'VIBE 100', copy: 'The ultimate resource for bodybuilding, workouts, nutrition, and fitness.', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200', link: '/?tenant=100b0000-c08f-4260-8540-a0cc8bed4e11' },
    { school: 'B2K Channel', short: 'B2K', subtitle: 'VIBE 100', copy: 'Celebrate 25 years of multi-platinum hits and boy band legacy.', image: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-5-1557518926.jpg', link: '/?tenant=100c0000-c08f-4260-8540-a0cc8bed4e11' },
    { school: 'Christian Revival Channel', short: 'Christian Revival', subtitle: 'VIBE 100', copy: 'Inspirational programming, local community news, and sermons.', image: '/kple_network_thumbnail.png', link: '/?tenant=100d0000-c08f-4260-8540-a0cc8bed4e11' },
    // { school: 'FINFIRE Channel', short: 'FINFIRE', subtitle: 'VIBE 100', copy: 'Empowering financial freedom, investment guides, and real estate strategy.', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200', link: '/?tenant=100e0000-c08f-4260-8540-a0cc8bed4e11' }
  ];

  const HERO_SLIDES = (config?.theme?.heroSlider && config.theme.heroSlider.length > 0)
    ? config.theme.heroSlider.map((slide: any) => {
        return {
          school: slide.title || config?.name || '',
          short: slide.subtitle || slide.title || config?.name || '',
          subtitle: slide.subtitle || 'Featured',
          copy: slide.copy || slide.description || config?.theme?.heroCopy || '',
          image: slide.imageUrl || slide.image || config?.theme?.heroImage || '',
          link: slide.videoUrl || slide.link || config?.theme?.shopifyUrl || ''
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
              : (isBonaire
                ? BONAIRE_HERO_SLIDES
                : (isVibe100 
                  ? VIBE_100_HERO_SLIDES 
                  : (isCourtneyBee 
                    ? COURTNEY_BEE_HERO_SLIDES 
                    : AVO_HERO_SLIDES))))))));

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
                if (isKple) {
                  if (isKpleOnlyConfig(config)) {
                    const watchEl = document.getElementById('whats-on-now');
                    if (watchEl) {
                      watchEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    window.location.href = mergeQueryParams('/?tenant=100d0000-c08f-4260-8540-a0cc8bed4e01', window.location.search);
                  }
                  return;
                }

                const currentSlide = HERO_SLIDES[heroSlide % HERO_SLIDES.length];
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
                border: '1.5px solid #fff', cursor: 'pointer',
                transition: 'all 0.25s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#000';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#fff';
              }}
            >
              {(() => {
                const currentSlide = HERO_SLIDES[heroSlide % HERO_SLIDES.length];
                if (currentSlide.buttonText) return currentSlide.buttonText;
                if (currentSlide.videoUrl) return "Play Video";
                if (config?.theme?.shopifyUrl && !config.theme.shopifyUrl.includes('shop')) return "Visit Website";
                return isOlympian ? "View Schedule" : (isMf ? "Read Workouts" : (isB2K ? "Learn More" : (isKple ? "WATCH" : (isBonaire ? "Shop Now" : (isVibe100 ? "Enter Channel" : "Shop Now")))));
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
                  {isOlympian ? '50+ Years' : (isMf ? '85+ Years' : (isB2K ? '25 Years' : (isKple ? '30+ Years' : (isBonaire ? 'Established 1974' : (isVibe100 ? 'Top 100' : '$17,480,130')))))}<span style={{ color: accent }}>{isVibe100 || isBonaire ? '' : '+'}</span>
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  {isOlympian ? 'Of Championing Legendary Athletes & Fitness Excellence' : (isMf ? 'Of Providing World-Class Fitness Advice, Training & Nutrition Blueprints' : (isB2K ? 'Of R&B Harmonies, Multi-Platinum Hits & Tour Legacies' : (isKple ? 'Serving Central Texas with Inspirational Programming' : (isBonaire ? 'Empowering Local Bonaire Merchants & Supporting Island Trade' : (isVibe100 ? 'Ecosystem Networks Displaying Posts and Content' : 'Raised to empower student‑athletes nationwide')))))}
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
      {!isKple && !isBonaire && (
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Suspense fallback={null}>
            <CollegeTicker accent={config.accent} isOlympian={isOlympian} isB2K={isB2K} isKple={isKple} isWings={config?.id === 'wings-of-strength-tenant-id'} />
          </Suspense>
        </div>
      )}

      {/* Bonaire Live Conditions Weather Ticker — bottom of hero */}
      {isBonaire && (
        <div style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          background: 'rgba(0, 43, 73, 0.85)', // Bonaire corporate deep navy transparent
          backdropFilter: 'blur(10px)',
          color: '#fff',
          borderTop: '1px solid rgba(0, 163, 224, 0.3)',
          borderBottom: '1px solid rgba(0, 163, 224, 0.3)',
          padding: '12px 24px',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          height: '42px',
        }}>
          {/* Left badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', zIndex: 10 }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00A3E0',
              boxShadow: '0 0 8px #00A3E0',
              animation: 'pulse 1.8s infinite'
            }} />
            <span style={{ color: '#00A3E0', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 900 }}>Bonaire Live Conditions</span>
          </div>

          {/* Scrolling text marquee */}
          <div style={{
            flex: 1,
            margin: '0 32px',
            overflow: 'hidden',
            position: 'relative',
            height: '18px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <style>{`
              @keyframes marquee-n2n {
                0% { transform: translateX(35%); }
                100% { transform: translateX(-100%); }
              }
              @keyframes pulse {
                0% { transform: scale(0.95); opacity: 0.5; }
                50% { transform: scale(1.15); opacity: 1; }
                100% { transform: scale(0.95); opacity: 0.5; }
              }
            `}</style>
            <div style={{
              display: 'flex',
              gap: '60px',
              whiteSpace: 'nowrap',
              animation: 'marquee-n2n 35s linear infinite',
              position: 'absolute',
              width: 'max-content'
            }}>
              <span>☀️ Temperature: 84°F / 29°C</span>
              <span>💨 Wind: ENE Trade Winds at 18 knots (Ideal for Windsurfing & Kiting)</span>
              <span>🌡️ Water Temp: 81°F / 27°C</span>
              <span>🌊 Wave Height: 3-4 ft</span>
              <span>🤿 Visibility: 100+ ft (Excellent Shore Diving Conditions today!)</span>
              <span>🐢 Marine Park Status: Open & Active (Remember your STINAPA tag)</span>
              <span>☀️ Temperature: 84°F / 29°C</span>
              <span>💨 Wind: ENE Trade Winds at 18 knots</span>
              <span>🌡️ Water Temp: 81°F / 27°C</span>
              <span>🌊 Wave Height: 3-4 ft</span>
            </div>
          </div>

          {/* Right link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', zIndex: 10, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Local Time:</span>
            <span style={{ color: '#FF5E13', fontWeight: 800 }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'America/Puerto_Rico' })} AST</span>
          </div>
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
                title={isBonaire ? "BONAIRE BUSINESS NETWORKS" : (isOlympian ? "OLYMPIA PARTNERS" : (isMf ? "MUSCLE & FITNESS NETWORKS" : (isB2K ? "B2K MEMBERS" : (isVibe100 ? "VIBE 100 NETWORKS" : (isVibe ? "NEW PROFILES & CHANNELS" : "NETWORKS & CHANNELS")))))}
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

        {/* ── Bonaire Local Merchants Slider positioned directly under Bonaire Business Networks slider ── */}
        {(isBonaire && athleteItems.length > 0) && (
          <div id="bonaire-merchants-slider" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <SliderSection
              title="LOCAL MERCHANTS"
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

        {/* ── Watch Section: New KPLE Watch Cinema for KPLE & CRN ──────── */}
        {isKple ? (
          <KpleInlineWatchSection
            videos={kpleChannelVideos}
            accent={accent}
            networkName={config.name || 'Christian Revival Network'}
            onOpenModal={(vid) => setActiveVideo(vid)}
          />
        ) : (
          <div id="whats-on-now">
            <Suspense fallback={null}>
              <WatchLive accent={config.accent} isOlympian={isOlympian} isMf={isMf} isB2K={isB2K} isVibe={isVibe} isKple={isKple} isVibe100={isVibe100} isBonaire={isBonaire} tenantId={config?.id} />
            </Suspense>
          </div>
        )}

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
                {isOlympian || isVibe ? (
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
                    src={isCourtneyBee ? "/n2n/comedy_club_bg.jpg" : (isMf ? "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800" : isWings ? "/n2n/wings_rising_phoenix_poster.jpg" : (isB2K ? "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" : (isKple ? "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800" : (isBonaire ? "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800" : (isVibe100 ? "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800" : "https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820")))))}
                    alt={isCourtneyBee ? "Courtney Bee Live Media" : (isMf ? "Workout Gear" : isWings ? "Wings Contest Event" : (isB2K ? "Official Tour Merch" : (isKple ? "Support CRN" : (isBonaire ? "Bonaire Chamber" : (isVibe100 ? "Official Merch" : "New Drop")))))}
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
                  {isCourtneyBee ? "Comedy & Culture" : (isOlympian || isVibe ? "Live Webcast" : isMf ? "Workout Gear" : isWings ? "Wings Contest" : (isB2K ? "Official Merch" : (isKple ? "Media Mission" : (isBonaire ? "Bonaire KvK" : (isVibe100 ? "Exclusive Gear" : "New Drop")))))}
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
                  {isCourtneyBee ? "Courtney Bee Collection" : (isOlympian || isVibe ? "Olympia PPV Webcast" : isMf ? "Fitness Collection" : isWings ? "Wings of Strength" : (isB2K ? "Official Tour Merch" : (isKple ? "Support Our Mission" : (isBonaire ? "Local Commerce" : (isVibe100 ? "VIBE 100 Store" : "Summer 2026 Collection")))))}
                </p>
                <h2 style={{
                  fontSize: '44px', fontWeight: 900, color: '#fff', margin: '0 0 16px 0',
                  lineHeight: 1.15, letterSpacing: '-1px', textTransform: 'uppercase',
                }}>
                  {isCourtneyBee ? (
                    <>Courtney Bee<br />Comedy & Merch</>
                  ) : isOlympian || isVibe ? (
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
                        isBonaire ? (
                          <>Support Bonaire<br />Local Shops</>
                        ) : (
                          isVibe100 ? (
                            <>Network Official<br />Collection</>
                          ) : (
                            <>Game Day<br />Essentials</>
                          )
                        )
                      )
                    )
                  )}
                </h2>
                <p style={{
                  fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7,
                  margin: '0 0 32px 0', maxWidth: '520px',
                }}>
                  {isCourtneyBee ? "Explore exclusive stand-up specials, uncensored culture streams, VIP tour passes, and official Courtney Bee merchandise drops." : (isOlympian || isVibe ? "Experience the pinnacle of bodybuilding live from anywhere in the world. Subscribe to the official webcast to stream the 62nd Mr. Olympia pre-judging, finals, and exclusive backstage interviews live in high-definition." : isMf ? "Explore premium workouts, digital training guides, and high-performance activewear designed to take your fitness to the next level." : isWings ? "Experience the pinnacle of professional women's bodybuilding. Purchase official pay-per-view live streams, secure event tickets, and browse the official Alina Popa & Rising Phoenix championship collections." : (isB2K ? "Pre-order exclusive Boys 4 Life tour hoodies, vintage graphic tees, and autographed vinyl. Rep the legendary boy band reunion in style." : (isKple ? "The Christian Revival Network is a 501(c)3 non-profit media mission. Your donations help us broadcast the Gospel 24/7 to Central Texas and the world. Support our ministry today." : (isBonaire ? "Explore local handcrafted products, authentic Caribbean diving apparel, guided eco-tours, and cactus-flavored spirits from local Bonaire chamber members." : (isVibe100 ? "Explore premium merchandise, albums, and exclusive releases from all Top 100 networks. Shop official gear and support your favorite channels." : "Premium collegiate apparel for every school in the AVO family. Rep your team with style — new colorways and exclusive designs just dropped.")))))}
                </p>
                <a
                  href={isOlympian || isVibe ? "https://www.olympiaproductions.com/" : (isWings ? "https://wingsofstrength.net/" : (isKple ? "https://www.paypal.com/donate/?hosted_button_id=A7WXAKZEAGBPA" : (isMf ? "https://www.muscleandfitness.com/" : ('/marketplace' + (typeof window !== 'undefined' ? window.location.search : '')))))}
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
                  {isCourtneyBee ? "Explore Merch" : (isOlympian || isVibe ? "Watch Webcast" : isMf ? "Shop Store" : isWings ? "Explore Shows" : (isB2K ? "Shop The Merch" : (isKple ? "Support Our Station" : (isBonaire ? "Shop Bonaire" : (isVibe100 ? "Shop The Collection" : "Shop The Drop")))))}
                </a>
              </div>
            </div>
          </section>
        )}





        {/* ── Courtney Bee Channels / AVO Campus Athletes / KPLE Channel Profiles Slider ── */}
        {(((isCourtneyBee || isAvo || isKple) && !isBonaire) && athleteItems.length > 0) && (
          <div id="avo-athletes-slider">
            <SliderSection
              title={isCourtneyBee ? "COURTNEY BEE CHANNELS" : (isKple ? "KPLE-TV CHANNELS" : (isBonaire ? "LOCAL MERCHANTS" : "CAMPUS ATHLETES"))}
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
            <ChildNetworkFeeds parentId={config.id} accent={accent} isOlympian={isOlympian} isMf={isMf} isB2K={isB2K} isBonaire={isBonaire} />
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
        {!isMfFamily && !isB2K && !isVibe100 && !isCourtneyBee && (
          <section style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 40px' }}>
            <div style={{
              position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#000',
            }}>
              {/* Background image — full bleed */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${isKple ? "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1200" : (isBonaire ? "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=1200" : "/n2n/hoodie-competition.png")})`,
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
                    {isBonaire ? "Chamber Membership" : (isKple ? "🙏 Prayer Request" : "🏆 Competition")}
                  </div>
                  <h2 style={{
                    fontSize: '38px', fontWeight: 900, color: '#fff', margin: '0 0 14px 0',
                    lineHeight: 1.1, letterSpacing: '-1px', textTransform: 'uppercase',
                  }}>
                    {isBonaire ? <>Join KvK Bonaire<br />Grow Your Business</> : (isKple ? <>Need Prayer?<br />We Are Here</> : <>Best College<br />Hoodie Design</>)}
                  </h2>
                  <p style={{
                    fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
                    margin: '0 0 24px 0',
                  }}>
                    {isBonaire 
                      ? "Get listed, connect with local merchants, gain access to business support programs, and reach customers worldwide with our digital network tools. Join KvK today."
                      : (isKple 
                        ? "Sometimes, all it takes is just one prayer to change everything. You are not alone, and our prayer warriors are here to stand with you. Call our prayer line or send a request."
                        : (isCourtneyBee
                          ? "Check out Courtney Bee's signature apparel collection. Vote on upcoming merch colorways and unlock early access to new drops."
                          : "All 8 AVO schools go head-to-head. Which campus created the best branded hoodie? Browse the entries, rep your school, and cast your vote."
                        )
                      )
                    }
                  </p>

                  {/* School pills or prayer phone */}
                  {isBonaire ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                      {['Retail', 'Tourism', 'Services', 'Hospitality', 'Crafts', 'Logistics'].map(tag => (
                        <span key={tag} style={{
                          padding: '5px 12px', fontSize: '10px', fontWeight: 800,
                          letterSpacing: '1px', textTransform: 'uppercase',
                          border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
                          background: 'rgba(255,255,255,0.04)',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (!isKple ? (
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
                  ))}

                  <button
                    onClick={() => {
                      if (isKple) {
                        window.location.href = 'mailto:prayer@kpletv.org?subject=Prayer Request';
                      } else if (isBonaire) {
                        window.location.href = mergeQueryParams('/contact', window.location.search);
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
                    {isBonaire ? "Join Chamber" : (isKple ? "Send Prayer Request" : "Vote Now")}
                  </button>
                </div>

                {/* Right — Image */}
                <div className="banner-cta-right" style={{ flexShrink: 0, width: '320px', position: 'relative' }}>
                  <img
                    src={isKple ? "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600" : (isBonaire ? "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600" : "/n2n/hoodie-competition.png")}
                    alt={isBonaire ? "Join Bonaire Chamber" : (isKple ? "Prayer Request" : "College Hoodie Competition")}
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
        {!isKple && !isVibe100 && !isWings && !isHers && !isFlex && !isBonaire && (
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
                  {isCourtneyBee ? "🎤 National Stand-Up Tour" : (isMf || isOlympian ? "🏆 Joe Weider's Mr. Olympia Weekend" : (isB2K ? "🎤 The Millennium Tour" : "🎸 Summer 2026 Tour"))}
                </div>
                <h2 style={{
                  fontSize: '38px', fontWeight: 900, color: '#fff', margin: '0 0 16px 0',
                  lineHeight: 1.1, letterSpacing: '-1px', textTransform: 'uppercase',
                }}>
                  {isCourtneyBee ? <>Courtney Bee<br />Comedy Tour 2026</> : (isMf || isOlympian ? <>62nd Mr. Olympia<br />Las Vegas 2026</> : (isB2K ? <>The Boys 4 Life<br />Reunion Tour</> : <>AVO Summer<br />Concert Tour</>))}
                </h2>
                <p style={{
                  fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
                  margin: '0 0 28px 0',
                }}>
                  {isCourtneyBee ? "Catch Courtney Bee live on stage! The national comedy tour is hitting top comedy clubs and arenas nationwide. Get your tickets, VIP meet-and-greet passes, and exclusive tour merch live." : (isMf || isOlympian ? "The ultimate fitness event of the year returns to Las Vegas, Nevada on September 24-27, 2026. Get your tickets to witness bodybuilding history live as elite champions from around the globe battle for the prestigious Sandow Trophy." : (isB2K ? "B2K is back on stage celebrating their 25th anniversary. The 28-city reunion tour features Bow Wow, Jeremih, Pretty Ricky, Amerie, and more, kicking off in Columbia, SC, and routing across the country. Don't miss this historic R&B reunion live! " : "Catch the vibes live! AVO is hitting the road this summer, bringing your favorite bands and artists to collegiate campus parks nationwide. Grab your crew, rep your school colors, and experience the ultimate summer soundtrack."))}
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

        {/* ── Bonaire Local News Section (Separating the 2 bottom CTAs) ── */}
        {isBonaire && (
          <section style={{ maxWidth: '1400px', margin: '60px auto', padding: '0 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '16px', letterSpacing: '-0.5px' }}>
                <span style={{ width: '4px', height: '24px', borderRadius: '4px', background: accent, boxShadow: `0 0 10px ${accent}` }} />
                <span style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>Bonaire Local News</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {[
                {
                  title: 'STINAPA Announces Coral Restoration Zone Expansion',
                  date: 'July 15, 2026',
                  summary: 'New protective guidelines and expanded coral nurseries are implemented across Kralendijk reefs to support marine biodiversity and dive tourism.',
                  image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600',
                  paragraphs: [
                    "The National Parks Foundation Bonaire (STINAPA) has officially launched an expansion of its coral restoration nurseries along the west coast of Bonaire and Klein Bonaire. The initiative aims to propagate over 10,000 new coral colonies, specifically targeting staghorn and elkhorn species, which are critical for reef structure and biodiversity.",
                    "In partnership with local dive operators, STINAPA has established three new nursery zones. These areas will be protected under temporary anchoring and entry restrictions to ensure the young coral fragments can mature undisturbed. Dive merchants are volunteering as nursery monitors, helping clean algae from the trees and transplanting healthy fragments back onto the degraded house reefs.",
                    "Dive tourists visiting Bonaire are encouraged to participate in Reef Renewal courses offered by certified local shops, where they can learn how to assist in coral maintenance and contribute directly to preserving Bonaire's world-famous marine ecosystem."
                  ]
                },
                {
                  title: 'Chamber Announces 2026 Sustainable Business Finalists',
                  date: 'July 10, 2026',
                  summary: 'The Bonaire Chamber of Commerce (KvK) has released the shortlist of local merchants recognized for outstanding environmental practices.',
                  image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
                  paragraphs: [
                    "The Bonaire Chamber of Commerce (Kamer van Koophandel) has unveiled the official shortlist of local merchants nominated for the 2026 Sustainable Commerce Awards. This annual recognition honors businesses that have integrated environmental sustainability, social responsibility, and carbon reduction into their daily operations.",
                    "This year's finalists represent a diverse mix of sectors, from eco-tourism operators using electric boats to local craft distilleries powered by solar energy. The Chamber highlighted that sustainable tourism and trade are vital for Bonaire's long-term economic resilience, given the island's sensitive ecological footprint.",
                    "The winners will be announced during a live ceremony at the KvK headquarters in Kralendijk next month. The selected merchants will receive commercial grants, marketing packages, and the official KvK Green Ribbon seal of approval to display on their shopfronts and digital storefronts."
                  ]
                },
                {
                  title: 'Direct Airline Routes to Flamingo Airport Expanding',
                  date: 'July 05, 2026',
                  summary: 'New direct seasonal flights from North American hubs are set to launch this winter, easing travel and boosting island commercial trade.',
                  image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600',
                  paragraphs: [
                    "Flamingo International Airport (BON) in Kralendijk is set to undergo a major winter flight schedule expansion. Leading airlines have confirmed new direct, non-stop seasonal flights connecting Bonaire to major North American transit hubs including Miami, Atlanta, and Charlotte.",
                    "The airport authority confirmed that airport upgrades completed earlier this year—including runway resurfacing and modernized customs processing lanes—were crucial in securing these agreements. The increased flight frequency is expected to boost winter tourism arrivals by 18% and ease transport routes for local export businesses.",
                    "Local tourism associations and chamber members welcomed the news, stating that direct routes make the island significantly more accessible to international trade partners and tourists, reducing layovers in Curaçao or Aruba and bringing direct economic growth to the island."
                  ]
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.06)', 
                    borderRadius: '24px', 
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, border-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = `${accent}55`;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                  onClick={() => setActiveNews(item)}
                >
                  <div style={{ width: '100%', aspectRatio: '16/10', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                      {item.date}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 12px 0', color: '#fff', lineHeight: 1.3 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                      {item.summary}
                    </p>
                  </div>
                </div>
              ))}
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
        {!isMfFamily && !isB2K && !isKple && !isBonaire && (
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
                backgroundImage: `url(${isCourtneyBee ? "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1200" : (isOlympian || isMf ? "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200" : isWings ? "/n2n/wings_phoenix_iron_games.jpg" : (isB2K ? "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200" : (isKple ? "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=1200" : (isBonaire ? "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200" : "https://shopavo.la/cdn/shop/files/Homepage_Vanderbilt_Desktop2_c7f572ef-cd7e-4de4-bb9c-160b99884e08_1500x.jpg?v=1776284877"))))})}`,
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
                    {isCourtneyBee ? "VIP Fan Club" : (isOlympian ? "Olympia Ambassadors" : isMf ? "Fitness Ambassadors" : isWings ? "Wings Ambassadors" : (isB2K ? "Street Team" : (isKple ? "Media Partner" : (isBonaire ? "Chamber Partners" : "Campus Ambassadors"))))}
                  </p>
                  <h2 style={{
                    fontSize: '36px', fontWeight: 900, color: '#fff', margin: '0 0 16px 0',
                    lineHeight: 1.15, letterSpacing: '-1px', textTransform: 'uppercase',
                  }}>
                    {isCourtneyBee ? (
                      <>Join Courtney Bee's<br />VIP Fan Club</>
                    ) : isOlympian || isMf ? (
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
                          isBonaire ? (
                            <>Support Bonaire<br />Chamber of Commerce</>
                          ) : (
                            <>Represent AVO<br />On Your Campus</>
                          )
                        )
                      )
                    )}
                  </h2>
                  <p style={{
                    fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0,
                  }}>
                    {isCourtneyBee
                      ? "Become an official Courtney Bee VIP Ambassador. Gain exclusive access to private live streams, behind-the-scenes recordings, subscriber discounts, and direct chat perks."
                      : isOlympian || isMf 
                        ? `Join the official ${config?.name || 'Muscle & Fitness'} Ambassador Program. Share fitness tips, review premium workout apparel, and earn exclusive event credentials, early access, and commissions.`
                        : isWings
                          ? "Join the official Wings of Strength Ambassador Program. Spread the passion for female bodybuilding, review premium strength gear, and earn exclusive event passes, backstage credentials, and athlete sponsorship perks."
                          : (isB2K 
                            ? "Join the official B2K Millennium Street Team. Promote the Boys 4 Life Tour, share new music updates, and earn exclusive backstage passes, VIP meet-and-greets, and limited edition merch."
                            : (isKple ? "Become a supporting partner of the Christian Revival Network. Join our media mission to keep the Gospel broadcasting 24/7. Your support enables us to continue revealing the love of Jesus Christ." : (isBonaire ? "Become a supporting partner of the Bonaire Chamber of Commerce. Your collaboration helps us empower local businesses, run training workshops, and sustain a thriving island economy." : "Join the AVO Ambassador Program and bring premium college apparel to your school. Earn exclusive perks, early access to drops, and commissions on every sale."))
                          )}
                  </p>
                </div>
                <button
                  className="banner-cta-right"
                  onClick={() => {
                    if (isKple) {
                      window.open("https://members.kple-tv.org/", "_blank");
                    } else if (isBonaire) {
                      window.open("https://bonairechamber.com/en/", "_blank");
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
                  {isKple ? "Join Now" : isWings ? "Become An Ambassador" : (isBonaire ? "Visit Chamber" : "More Info")}
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
              style={{ marginTop: '20px', textAlign: 'center', maxWidth: '800px', width: '90%' }}
            >
              <h2 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 800 }}>{activeVideo.title}</h2>
              
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                {activeVideo.tags.map((tag: string) => (
                  <span key={tag} style={{ color: accent, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description & Transcript Tabs */}
              {((activeVideo as any).description || (activeVideo as any).transcript) && (
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '20px 24px',
                  textAlign: 'left',
                  marginTop: '16px'
                }}>
                  <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
                    {(activeVideo as any).description && (
                      <button
                        onClick={() => setVideoDetailTab('description')}
                        style={{
                          background: videoDetailTab === 'description' ? accent : 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 18px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        Description
                      </button>
                    )}

                    {(activeVideo as any).transcript && (
                      <button
                        onClick={() => setVideoDetailTab('transcript')}
                        style={{
                          background: videoDetailTab === 'transcript' ? accent : 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 18px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FileText size={14} />
                        <span>Transcript</span>
                      </button>
                    )}
                  </div>

                  {videoDetailTab === 'description' && (activeVideo as any).description && (
                    <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-line' }}>
                      {(activeVideo as any).description}
                    </div>
                  )}

                  {videoDetailTab === 'transcript' && (activeVideo as any).transcript && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: accent }}>
                          Video Transcript
                        </span>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText((activeVideo as any).transcript);
                            setCopiedTranscript(true);
                            setTimeout(() => setCopiedTranscript(false), 2000);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '14px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {copiedTranscript ? <Check size={14} color="#30d158" /> : <Copy size={14} />}
                          <span>{copiedTranscript ? 'Copied!' : 'Copy Transcript'}</span>
                        </button>
                      </div>

                      <div style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '16px',
                        maxHeight: '220px',
                        overflowY: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.9)',
                        whiteSpace: 'pre-line'
                      }}>
                        {(activeVideo as any).transcript}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bonaire News Reader Modal ──────────────────────────── */}
      <AnimatePresence>
        {activeNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveNews(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(5, 5, 5, 0.75)',
              backdropFilter: 'blur(30px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              boxSizing: 'border-box'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(20, 20, 20, 0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '32px',
                width: '100%',
                maxWidth: '750px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header Image */}
              <div 
                style={{ 
                  width: '100%', 
                  aspectRatio: '16/8', 
                  backgroundImage: `url(${activeNews.image})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveNews(null)}
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body Content */}
              <div style={{ padding: '40px' }}>
                <span style={{ fontSize: '12px', color: accent, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
                  {activeNews.date} • LOCAL NEWS
                </span>
                
                <h2 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 24px 0', color: '#fff', lineHeight: 1.25, letterSpacing: '-0.5px' }}>
                  {activeNews.title}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {activeNews.paragraphs && activeNews.paragraphs.map((p: string, idx: number) => (
                    <p key={idx} style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: 0 }}>
                      {p}
                    </p>
                  ))}
                </div>

                <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setActiveNews(null)}
                    style={{
                      background: 'white',
                      color: 'black',
                      border: 'none',
                      padding: '12px 28px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Done Reading
                  </button>
                </div>
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

      {/* ── KPLE All Videos View All Modal ─────────────────── */}
      <AnimatePresence>
        {showAllKpleVideosModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAllKpleVideosModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.92)',
              backdropFilter: 'blur(20px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              padding: '30px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '1280px',
                maxHeight: '88vh',
                background: '#0a0a0f',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
              }}
            >
              {/* Header */}
              <div style={{ padding: '24px 36px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: accent }}>KPLE-TV Network Catalog</span>
                  <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '4px 0 0', letterSpacing: '-0.5px' }}>
                    All Channel Videos <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>({kpleChannelVideos.length} Videos)</span>
                  </h2>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <input 
                    type="text"
                    placeholder="Search title or channel..."
                    value={kpleSearchQuery}
                    onChange={e => setKpleSearchQuery(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      padding: '10px 18px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      width: '240px'
                    }}
                  />
                  <button
                    onClick={() => setShowAllKpleVideosModal(false)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              {/* Grid Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {kpleChannelVideos
                  .filter(v => 
                    v.title.toLowerCase().includes(kpleSearchQuery.toLowerCase()) || 
                    (v.tags && v.tags.some((t: string) => t.toLowerCase().includes(kpleSearchQuery.toLowerCase()))) ||
                    (v.channelName && v.channelName.toLowerCase().includes(kpleSearchQuery.toLowerCase()))
                  )
                  .map(vid => (
                    <motion.div
                      key={vid.id}
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        setShowAllKpleVideosModal(false);
                        setActiveVideo(vid);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', background: '#000' }}>
                        <img src={vid.image} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Play fill="white" size={22} style={{ marginLeft: '3px' }} />
                          </div>
                        </div>
                        <div style={{ position: 'absolute', top: '12px', left: '12px', background: accent, color: '#fff', padding: '4px 12px', borderRadius: '14px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {vid.channelName || 'KPLE Channel'}
                        </div>
                      </div>
                      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.35 }}>{vid.title}</h4>
                        <span style={{ fontSize: '12px', color: accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>▶ Watch Episode</span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── KPLE / CRN Watch Cinema Player UI ────────────────── */}
      {isKple && activeVideo && (
        <KpleWatchPlayer
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          videos={kpleChannelVideos}
          initialVideoId={activeVideo.id}
          accent={accent}
          networkName={config.name || 'Christian Revival Network'}
        />
      )}
    </>
  );
}
