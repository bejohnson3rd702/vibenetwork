import { useEffect, useState, lazy, Suspense } from 'react';
import { ASSETS } from './data';
import { getCategoriesWithVideos } from './api';
import Navbar from './components/Navbar';
const CollegeTicker = lazy(() => import('./components/CollegeTicker'));

const AuthModal = lazy(() => import('./components/AuthModal'));
const ProfileDashboard = lazy(() => import('./components/ProfileDashboard'));
const BusinessAdminDashboard = lazy(() => import('./components/BusinessAdminDashboard'));
const EndUserAuthModal = lazy(() => import('./components/EndUserAuthModal'));
const MasterAdminDashboard = lazy(() => import('./components/MasterAdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const LiveCustomizer = lazy(() => import('./components/LiveCustomizer'));
const LiveChat = lazy(() => import('./components/LiveChat'));
const BookingModal = lazy(() => import('./components/BookingModal'));
const MoreInfo = lazy(() => import('./components/MoreInfo'));
const Contact = lazy(() => import('./components/Contact'));
const VirtualCallRoom = lazy(() => import('./components/VirtualCallRoom'));
const Marketplace = lazy(() => import('./components/Marketplace'));
const ProductPage = lazy(() => import('./components/ProductPage'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const Footer = lazy(() => import('./components/Footer'));
const FoodTruck = lazy(() => import('./pages/FoodTruck'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Community = lazy(() => import('./pages/Community'));
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { WhiteLabelContext } from './context/WhiteLabelContext';
import { supabase, storageKey } from './supabaseClient';
import { MASTER_DOMAIN, DEFAULT_PLATFORM_NAME } from './constants';
const Home = lazy(() => import('./pages/Home'));
import { normalizeWlConfig, isOlympianConfig, isMuscleFitnessConfig, isKpleConfig } from './lib/whitelabel';
const WhiteLabelHome = lazy(() => import('./pages/WhiteLabelHome'));
const N2NHome = lazy(() => import('./pages/N2NHome'));
const AvoMarketplace = lazy(() => import('./components/AvoMarketplace'));
const ShopifyStore = lazy(() => import('./components/ShopifyStore'));
const BibleDrawer = lazy(() => import('./components/BibleDrawer'));
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';



function App() {

  const location = useLocation();
  const tenantParam = new URLSearchParams(location.search).get('tenant');

  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authDefaults, setAuthDefaults] = useState({ isLogin: true, role: 'viewer' as 'viewer' | 'influencer' | 'business', showWizard: false, referredBy: undefined as string | undefined });
  const [wlConfig, setWlConfig] = useState<any>(null);
  const [isTenantMode, setIsTenantMode] = useState(() => {
    const hostname = window.location.hostname.replace(/^www\./, '');
    const params = new URLSearchParams(window.location.search);
    const isMaster = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === MASTER_DOMAIN || hostname === 'vibenetwork.com' || hostname === 'vibenetwork.tv' || hostname.includes('vercel.app');
    return params.has('tenant') || !isMaster;
  });
  const [showAdminPanel, setShowAdminPanel] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('admin_panel') === 'true';
  });
  const [showEndUserAuthModal, setShowEndUserAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingProfile, setBookingProfile] = useState<any>(null);

  useEffect(() => {
    const handleOpenBooking = (e: any) => {
       if (e.detail?.profile) {
          setBookingProfile(e.detail.profile);
       } else {
          setBookingProfile(null);
       }
       setShowBookingModal(true);
    };
    window.addEventListener('open_booking', handleOpenBooking);
    return () => window.removeEventListener('open_booking', handleOpenBooking);
  }, []);

  useEffect(() => {
    const handleOpenAuth = (e: any) => {
      if (e.detail) {
        setAuthDefaults({ 
          isLogin: e.detail.isLogin ?? true, 
          role: e.detail.role ?? 'viewer', 
          showWizard: e.detail.showWizard ?? false,
          referredBy: e.detail.referredBy
        });
      } else {
        setAuthDefaults({ isLogin: true, role: 'viewer', showWizard: false, referredBy: undefined });
      }
      setShowAuthModal(true);
    };
    window.addEventListener('open_auth', handleOpenAuth);
    return () => window.removeEventListener('open_auth', handleOpenAuth);
  }, []);

  // Load NaluAsk Widget Script dynamically with dynamic branding accent (only on tenant change to prevent chat state resets)
  useEffect(() => {
    if (!wlConfig?.id) return;

    let timeoutId: any;
    let observer: MutationObserver | null = null;

    const loadNalu = () => {
      // 1. Remove existing NaluAsk elements to prevent duplicates
      const existingBubble = document.getElementById('nalu-bubble');
      if (existingBubble) existingBubble.remove();
      
      const existingContainer = document.getElementById('nalu-container');
      if (existingContainer) existingContainer.remove();

      const existingScripts = document.querySelectorAll('script[src*="naluask.com/widget.js"]');
      existingScripts.forEach(s => s.remove());

      // 2. Append new script with dynamic color
      const script = document.createElement('script');
      const accentColor = wlConfig.accent || '#D35400';
      
      // Use a color-specific query parameter to force browser to re-execute the widget script
      script.src = `https://naluask.com/widget.js?color=${encodeURIComponent(accentColor)}`;
      script.setAttribute('data-client-key', 'vbn_k_2026_vibenetwork');
      script.setAttribute('data-color', accentColor);
      script.defer = true;
      document.body.appendChild(script);

      // 3. Start MutationObserver to fix sandbox/iframe issues on mobile Safari/Chrome
      observer = new MutationObserver(() => {
        const iframe = document.querySelector('#nalu-container iframe') as HTMLIFrameElement;
        if (iframe) {
          // Remove sandboxing to ensure third-party cookies/localStorage work on iOS/mobile Safari
          if (iframe.hasAttribute('sandbox')) {
            iframe.removeAttribute('sandbox');
          }
          
          // Style container background so it's not transparent during iframe load
          const container = document.getElementById('nalu-container');
          if (container) {
            container.style.background = '#0a0a0a';
            container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };

    // Load after 3 seconds on mobile to prioritize main thread rendering, 1.5 seconds on desktop
    const delay = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 3000 : 1500;
    
    timeoutId = setTimeout(() => {
      loadNalu();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (observer) {
        observer.disconnect();
      }
      const bubble = document.getElementById('nalu-bubble');
      if (bubble) bubble.remove();
      const container = document.getElementById('nalu-container');
      if (container) container.remove();
      // Remove any scripts created during this lifecycle
      const scripts = document.querySelectorAll('script[src*="naluask.com/widget.js"]');
      scripts.forEach(s => s.remove());
    };
  }, [wlConfig?.id]);

  // Dynamically update Nalu bubble background color when accent changes, without re-injecting the script
  useEffect(() => {
    if (!wlConfig?.accent) return;
    const bubble = document.getElementById('nalu-bubble');
    if (bubble) {
      bubble.style.background = `linear-gradient(135deg, ${wlConfig.accent}, ${wlConfig.accent}cc)`;
    }
  }, [wlConfig?.accent]);

  useEffect(() => {
    // Check Active Session
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for state changes (login, logout)
    supabase!.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        
        // Handle Stripe Checkout Return for Business Owners
        if (session?.user?.user_metadata?.role === 'business') {
           const urlParams = new URLSearchParams(window.location.search);
           if (urlParams.get('checkout') === 'success') {
              window.dispatchEvent(new CustomEvent('open_auth', { detail: { showWizard: true, role: 'business', isLogin: false } }));
              // Clean URL
              window.history.replaceState({}, document.title, window.location.pathname);
           }
        }
      }
    );



    const handleCommit = async (e: any) => {
       try {
         const newId = e.detail.id || 'test_wl_' + Date.now();
         let finalId = newId;

         const { data: { session: currentSession } } = await supabase!.auth.getSession();
         const isNew = newId.includes('test_wl');
         
         let defaultFee = 30.00;
         if (isNew) {
            const { data: platformSettings } = await supabase!.from('platform_settings').select('global_whitelabel_fee').limit(1).single();
            if (platformSettings?.global_whitelabel_fee !== undefined) {
                defaultFee = platformSettings.global_whitelabel_fee;
            }
         }
         
         const payload = {
           owner_id: currentSession?.user?.id,
           name: e.detail.name,
           domain: e.detail.domain,
           logo: e.detail.logoImage,
           platform_fee_percentage: defaultFee,
           theme: {
              accent: e.detail.accent,
              heroCopy: e.detail.heroCopy,
              bg: e.detail.bg,
              btnPrimary: e.detail.btnPrimary,
              customSections: e.detail.customSections,
              sliderCount: e.detail.sliderCount,
              logoImage: e.detail.logoImage,
              contactEmail: e.detail.contactEmail,
              contactPhone: e.detail.contactPhone,
              contactAddress: e.detail.contactAddress,
              enableWatchLive: e.detail.enableWatchLive !== undefined ? e.detail.enableWatchLive : true,
              enableBooking: e.detail.enableBooking !== undefined ? e.detail.enableBooking : false,
              heroLayoutMode: e.detail.heroLayoutMode || 'verbiage',
              heroVideoUrl: e.detail.heroVideoUrl || '',
              heroVideoTitle: e.detail.heroVideoTitle || '',
              inviteOnly: false
           }
         };

         let wlData = null;
         let wlError = null;

         if (isNew) {
             const { data, error } = await supabase!.from('whitelabel_configs').insert(payload).select().single();
             wlData = data;
             wlError = error;
         } else {
             const { data, error } = await supabase!.from('whitelabel_configs').update(payload).eq('id', newId).select().single();
             wlData = data;
             wlError = error;
         }

         // Always update the local storage cache so it doesn't get stale if DB succeeds!
         const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
         const existingIndex = localNetworks.findIndex((n: any) => n.id === newId);
         if (existingIndex >= 0) {
            localNetworks[existingIndex] = { ...e.detail, id: finalId || newId, owner_id: currentSession?.user?.id };
         } else {
            localNetworks.push({ ...e.detail, id: finalId || newId, owner_id: currentSession?.user?.id });
         }
         localStorage.setItem('vibe_local_networks', JSON.stringify(localNetworks));

         if (wlError) {
            console.warn('DB upsert failed (likely RLS). Falling back to local storage sync.', wlError);
         } else if (wlData) {
            finalId = wlData.id;
            const { data: { session } } = await supabase!.auth.getSession();
            if (session?.user) {
               await supabase!.from('profiles').update({ whitelabel_id: finalId }).eq('id', session.user.id);
            }
         }
         
         // Only run the initialization logic if this is a NEW network creation
         if (!e.detail.id) {
            // Ensure the business owner stays logged into their newly created White Label!
            const masterToken = localStorage.getItem(storageKey);
            if (masterToken) {
               localStorage.setItem(`sb-${finalId}-auth-token`, masterToken);
               // Log them out of the master Vibe site locally so they don't bleed back into the public network
               localStorage.removeItem(storageKey);
            }
            
            setTimeout(() => {
               window.open(`/?tenant=${finalId}`, '_blank');
               // Clean up the master site's UI after launching the network
               setTimeout(() => { window.location.reload(); }, 500);
            }, 1000);
         } else {
            // It's an update. Just reload the current window so changes take effect
            setTimeout(() => { window.location.reload(); }, 500);
         }
       } catch (err) {
         console.error('Failed to sync whitelabel config', err);
         setTimeout(() => { window.location.reload(); }, 1000);
       }
    };
    window.addEventListener('whitelabel_commit', handleCommit);
    return () => window.removeEventListener('whitelabel_commit', handleCommit);
  }, []);

  // Load latest whitelabel config from DB on load, matching domain
  useEffect(() => {
    async function initPlatform() {
      try {
        const hostname = window.location.hostname.replace(/^www\./, '');
        const urlParams = new URLSearchParams(window.location.search);
        const forceTenant = urlParams.get('tenant');

        let query = supabase!.from('whitelabel_configs').select('*');
        let isTenant = false;
        let loadedTenantId = undefined;
        let loadedConfig = null;
        let localNetworks = [];
        try {
          const stored = localStorage.getItem('vibe_local_networks');
          if (stored && stored !== 'undefined') {
            localNetworks = JSON.parse(stored);
          }
        } catch (e) {
          console.warn('Could not parse local networks', e);
        }

        // Check if there is an active user session to fall back on their whitelabel config
        let userWlId = null;
        try {
          const { data: { session } } = await supabase!.auth.getSession();
          if (session?.user) {
            const { data: prof } = await supabase!.from('profiles').select('whitelabel_id').eq('id', session.user.id).single();
            if (prof?.whitelabel_id) {
              userWlId = prof.whitelabel_id;
            }
          }
        } catch (authErr) {
          console.warn('Could not retrieve session for tenant resolution', authErr);
        }

        const activeTenantId = forceTenant || userWlId;
        const isMaster = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === MASTER_DOMAIN || hostname === 'vibenetwork.com' || hostname === 'vibenetwork.tv' || hostname.includes('vercel.app');
        
        let configPromise;
        let categoriesPromise;

        if (activeTenantId) {
          isTenant = true;
          setIsTenantMode(true);
          loadedTenantId = activeTenantId;
          configPromise = supabase!.from('whitelabel_configs').select('*').eq('id', activeTenantId).limit(1);
          categoriesPromise = getCategoriesWithVideos(activeTenantId);
        } else if (!isMaster) {
          isTenant = true;
          setIsTenantMode(true);
          configPromise = supabase!.from('whitelabel_configs').select('*').eq('domain', hostname).limit(1);
        } else {
          isTenant = false;
          setIsTenantMode(false);
          configPromise = supabase!.from('whitelabel_configs').select('*').eq('domain', MASTER_DOMAIN).limit(1);
          categoriesPromise = getCategoriesWithVideos(undefined);
        }

        const [configRes, categoriesRes] = await Promise.all([
          configPromise,
          categoriesPromise || Promise.resolve(null)
        ]);

        const dbTenantData = configRes?.data;
        if (activeTenantId === 'wings-of-strength-tenant-id') {
          loadedTenantId = 'wings-of-strength-tenant-id';
          loadedConfig = normalizeWlConfig({
            id: 'wings-of-strength-tenant-id',
            name: 'Wings of Strength',
            domain: 'wingsofstrength.net',
            logo: 'https://wingsofstrength.net/wp-content/uploads/2025/02/27/inner-page-logo-min-1.png',
            parent_network_id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11',
            is_active: true,
            theme: {
              accent: '#FF9D00',
              heroCopy: 'The Premier Global Promoter for Elite Female Bodybuilding and Professional Strength Sports.',
              heroImage: '/n2n/wings_home_banner.jpg',
              logoImage: 'https://wingsofstrength.net/wp-content/uploads/2025/02/27/inner-page-logo-min-1.png',
              shopifyUrl: 'https://wingsofstrength.net/',
              sliderCount: 4,
              enableBooking: false,
              heroLayoutMode: 'verbiage',
              enableWatchLive: true,
              heroSlider: [
                {
                  id: 'wos-slide-2',
                  title: 'Alina Popa Classic',
                  subtitle: 'IFBB Pro League Contest',
                  copy: 'Celebrate strength, muscle, and dedication at the annual Alina Popa Classic featuring elite professional athletes.',
                  imageUrl: '/n2n/wings_alina_popa_classic.jpg',
                  videoUrl: 'https://wingsofstrength.net/'
                },
                {
                  id: 'wos-slide-3',
                  title: 'Arizona Women\'s Pro',
                  subtitle: 'Rising Phoenix Arizona Pro',
                  copy: 'The road to the Rising Phoenix World Championships continues in Phoenix. Discover ticket releases and schedules.',
                  imageUrl: '/n2n/wings_rising_phoenix_poster.jpg',
                  videoUrl: 'https://wingsofstrength.net/'
                },
                {
                  id: 'wos-slide-4',
                  title: 'Phoenix Iron Games',
                  subtitle: 'IFBB Pro & NPC Amateur',
                  copy: 'A premier fitness weekend featuring both professional face-offs and national NPC amateur qualifiers.',
                  imageUrl: '/n2n/wings_phoenix_iron_games.jpg',
                  videoUrl: 'https://wingsofstrength.net/'
                }
              ]
            }
          });
        } else if (activeTenantId === 'mf-hers-tenant-id') {
          loadedTenantId = 'mf-hers-tenant-id';
          loadedConfig = normalizeWlConfig({
            id: 'mf-hers-tenant-id',
            name: 'M&F Hers',
            domain: 'muscleandfitness.com/hers',
            logo: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2024/04/MF-Circle-Blk-Wht.jpg',
            parent_network_id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11',
            is_active: true,
            theme: {
              accent: '#E31B23',
              heroCopy: 'M&F Hers — Workouts, Nutrition, Tips, and Guides Tailored for Active Women.',
              heroImage: '/n2n/mf_hers_bodybuilder.jpg',
              logoImage: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2024/04/MF-Circle-Blk-Wht.jpg',
              shopifyUrl: 'https://www.muscleandfitness.com/hers/',
              sliderCount: 4,
              enableBooking: false,
              heroLayoutMode: 'verbiage',
              enableWatchLive: true
            }
          });
        } else if (activeTenantId === 'flex-online-tenant-id') {
          loadedTenantId = 'flex-online-tenant-id';
          loadedConfig = normalizeWlConfig({
            id: 'flex-online-tenant-id',
            name: 'Flex Online',
            domain: 'muscleandfitness.com/flexonline',
            logo: 'https://www.muscleandfitness.com/wp-content/themes/muscle-and-fitness/assets/source/images/logo.png',
            parent_network_id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11',
            is_active: true,
            theme: {
              accent: '#E31B23',
              heroCopy: 'Flex Online — The Ultimate Source for Hardcore Bodybuilding, Athlete Contests, and Classic Strength Coaching.',
              heroImage: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2026/06/Bodybuilders-Mike-Mentzer-and-Dorian-Yates-training-and-mentoring-the-young-bodybuilder-on-the-Maximum-Results-training-method.jpg',
              logoImage: 'https://www.muscleandfitness.com/wp-content/themes/muscle-and-fitness/assets/source/images/logo.png',
              shopifyUrl: 'https://www.muscleandfitness.com/flexonline/',
              sliderCount: 4,
              enableBooking: false,
              heroLayoutMode: 'verbiage',
              enableWatchLive: true
            }
          });
        } else if (dbTenantData && dbTenantData.length > 0) {
          const dbConf = dbTenantData[0];
          loadedTenantId = dbConf.id;
          loadedConfig = normalizeWlConfig(dbConf, { name: dbConf.name || 'Vibe B2B Enterprise' });
        } else {
          // Fallback to local storage for completely un-published preview networks or offline domain matches
          const localTenant = localNetworks.find((n: any) => n.id === forceTenant || n.domain === hostname);
          if (localTenant) {
            isTenant = true;
            setIsTenantMode(true);
            loadedTenantId = localTenant.id;
            loadedConfig = normalizeWlConfig(localTenant, { name: localTenant.name || 'Vibe B2B Enterprise' });
          }

          if (!isTenant && !loadedConfig) {
            const localMaster = localNetworks.find((n: any) => n.domain === MASTER_DOMAIN || n.id === 'master');
            if (localMaster) {
              loadedConfig = normalizeWlConfig(localMaster, { accent: localMaster.accent || localMaster.theme?.accent || '#D35400', enableWatchLive: true });
            }
          }
        }

        if (!loadedConfig) {
          loadedConfig = normalizeWlConfig({});
        }

        setWlConfig(loadedConfig);

        let freshCategories = categoriesRes;
        if (!freshCategories) {
          freshCategories = await getCategoriesWithVideos(loadedTenantId);
        }
        setCategories(freshCategories || []);
      } catch (err) {
        console.error("Critical error during Network OS initialization", err);
        // Guarantee the site loads in fallback mode even if DB/network throws an exception
        setWlConfig(normalizeWlConfig({}));
      }
    }
    initPlatform();
  }, [tenantParam]);

  useEffect(() => {
    if (wlConfig) {
      if (wlConfig.accent) {
         document.documentElement.style.setProperty('--accent-primary', wlConfig.accent);
      }
      
      // Dynamic High-Impact Typography for Muscle & Fitness / Olympia
      const isOlympian = isOlympianConfig(wlConfig);
      const isMf = isMuscleFitnessConfig(wlConfig);
      if (isOlympian || isMf) {
        document.documentElement.style.setProperty('--font-heading', "'Barlow Condensed', 'Outfit', sans-serif");
      } else {
        document.documentElement.style.setProperty('--font-heading', "'Outfit', sans-serif");
      }
      
      if (wlConfig.bg) {
        document.documentElement.style.setProperty('--bg-color', wlConfig.bg);
        
        // Dynamic Light/Dark Mode Toggle
        const bgHex = wlConfig.bg.toLowerCase().trim();
        const lightThemes = ['#f4f4f4', '#ffffff', '#fff', 'white', '#f7f7f7', '#f5f5f5', '#eeeeee', '#e5e5e5', '#fafafa', '#f8f9fa', '#d1d5db', '#cccccc', '#e0e0e0', '#f0f0f0', '#f3f4f6', '#d3d3d3'];
        
        if (lightThemes.includes(bgHex)) {
           document.documentElement.setAttribute('data-theme', 'light');
        } else {
           document.documentElement.removeAttribute('data-theme');
        }
      }
      
      // Dynamic SEO Injection
      const platformName = wlConfig.name || DEFAULT_PLATFORM_NAME;
      document.title = platformName;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', wlConfig.heroCopy || `Welcome to ${platformName}`);
      }

      // Update Favicon
      const faviconUrl = wlConfig.faviconImage || wlConfig.theme?.faviconImage || wlConfig.logoImage || wlConfig.logo;
      if (faviconUrl) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = faviconUrl;
      }
    }
  }, [wlConfig]);

  if (isTenantMode) {
    if (!wlConfig) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient, var(--bg-color))', color: 'var(--text-muted)' }}>Initializing Network OS...</div>;
    
    if (wlConfig.is_active === false) {
      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff', textAlign: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ padding: '40px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', maxWidth: '500px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
            </div>
            <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 800 }}>Network Suspended</h1>
            <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>This whitelabel network portal has been deactivated by the platform administrator. Please contact support or the network administrator for further details.</p>
          </div>
        </div>
      );
    }

    return (
      <WhiteLabelContext.Provider value={{ wlConfig, setWlConfig }}>
          <div style={{ background: 'var(--content-bg)', minHeight: '100vh', color: 'var(--text-primary)', overflowX: 'hidden' }}>
            <Helmet>
              <title>{wlConfig.name || 'Vibe Network'}</title>
              <meta name="description" content={wlConfig.heroCopy || 'The premiere destination for high quality digital content.'} />
              <meta property="og:title" content={wlConfig.name || 'Vibe Network'} />
              <meta property="og:description" content={wlConfig.heroCopy || 'The premiere destination for high quality digital content.'} />
              <meta property="og:image" content={wlConfig.logoImage || wlConfig.heroImage || 'https://vibenetwork.tv/og-image.jpg'} />
            </Helmet>
            <Navbar user={user} onLoginClick={() => setShowEndUserAuthModal(true)} onAdminClick={() => setShowAdminPanel(true)} />
          
          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading interface...</div>}>
            <Routes>
              <Route path="/" element={
                 (wlConfig?.n2n_enabled || 
                   wlConfig?.parent_network_id === '7a017c4d-c08f-4260-8540-a0cc8bed4e11' ||
                   wlConfig?.theme?.parent_network_id === '7a017c4d-c08f-4260-8540-a0cc8bed4e11' ||
                   wlConfig?.id === 'wings-of-strength-tenant-id' ||
                   wlConfig?.id === 'mf-hers-tenant-id' ||
                   wlConfig?.id === 'flex-online-tenant-id' ||
                   wlConfig?.id === '7a017c4d-c08f-4260-8540-a0cc8bed4e12' ||
                   (wlConfig?.name || '').toLowerCase().includes('olympia'))
                   ? <N2NHome wlConfig={wlConfig} categories={categories} user={user} activeVideo={activeVideo} setActiveVideo={setActiveVideo} />
                   : <WhiteLabelHome wlConfig={wlConfig} categories={categories} user={user} activeVideo={activeVideo} setActiveVideo={setActiveVideo} />
              } />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/shop" element={
                <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-color)' }}>
                  {(() => {
                    const isAvo = wlConfig?.id === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7' || wlConfig?.parent_network_id === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7';
                    return isAvo ? (
                      <AvoMarketplace accent={wlConfig?.accent || '#D35400'} />
                    ) : (
                      <ShopifyStore />
                    );
                  })()}
                </div>
              } />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<MoreInfo />} />
              <Route path="/more-info" element={<MoreInfo />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/product/:productId" element={<ProductPage />} />
              <Route path="/profile" element={<ProfileDashboard user={user} />} />
              <Route path="/profile/:creatorId" element={<ProfileDashboard user={user} />} />
              <Route path="/call/:callId" element={<VirtualCallRoom />} />
              <Route path="/food-truck" element={<FoodTruck />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
          </Suspense>
          
          {showAdminPanel && user && (
            <Suspense fallback={null}>
              <BusinessAdminDashboard onClose={() => setShowAdminPanel(false)} />
            </Suspense>
          )}

          <AnimatePresence>
             {showEndUserAuthModal && (
               <Suspense fallback={null}>
                 <EndUserAuthModal onClose={() => setShowEndUserAuthModal(false)} />
               </Suspense>
             )}
             {showBookingModal && (
               <Suspense fallback={null}>
                 <BookingModal onClose={() => setShowBookingModal(false)} profile={bookingProfile} />
               </Suspense>
             )}
          </AnimatePresence>
          
          <Suspense fallback={null}>
             <Footer />
             <CookieConsent />
          </Suspense>

          {user && (user.id === wlConfig.owner_id || user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'business' || user.user_metadata?.role === 'business_admin' || user.email?.includes('admin')) && (
            <Suspense fallback={null}>
              <LiveCustomizer />
            </Suspense>
          )}

          {wlConfig && isKpleConfig(wlConfig) && (
            <Suspense fallback={null}>
              <BibleDrawer accent={wlConfig.theme?.accent || wlConfig.accent || '#004e98'} />
            </Suspense>
          )}

        </div>
      </WhiteLabelContext.Provider>
    );
  }

  return (
    <WhiteLabelContext.Provider value={{ wlConfig: wlConfig || normalizeWlConfig({}), setWlConfig }}>
        <div style={{ background: 'var(--content-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
          <Helmet>
            <title>Vibe Network OS</title>
            <meta name="description" content="The premiere destination for high quality digital content." />
            <meta property="og:title" content="Vibe Network OS" />
            <meta property="og:description" content="The premiere destination for high quality digital content." />
          </Helmet>
          <AnimatePresence>
            {showAuthModal && (
              <Suspense fallback={null}>
                <AuthModal 
                  onClose={() => setShowAuthModal(false)} 
                  onSuccess={(u) => setUser(u)} 
                  defaultIsLogin={authDefaults.isLogin}
                  defaultRole={authDefaults.role}
                  defaultShowWizard={authDefaults.showWizard}
                  referredBy={authDefaults.referredBy}
                />
              </Suspense>
            )}
            {showBookingModal && (
               <Suspense fallback={null}>
                 <BookingModal onClose={() => setShowBookingModal(false)} profile={bookingProfile} />
               </Suspense>
            )}
          </AnimatePresence>

          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading platform...</div>}>
            <Routes>
              <Route path="/master-admin" element={<MasterAdminDashboard />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              {/* <Route path="/director" element={<DirectorStudio />} /> */}
              <Route path="*" element={
                <>
                  <Navbar 
                    user={user} 
                    onLoginClick={() => setShowAuthModal(true)} 
                    onAdminClick={() => window.location.href = '/master-admin'}
                  />
                  <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading interface...</div>}>
                    <Routes>
                      <Route path="/" element={<Home categories={categories} activeVideo={activeVideo} setActiveVideo={setActiveVideo} user={user} />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/product/:productId" element={<ProductPage />} />
                      <Route path="/about" element={<MoreInfo />} />
                      <Route path="/more-info" element={<MoreInfo />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/terms" element={<TermsOfService />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/profile" element={<ProfileDashboard user={user} />} />
                      <Route path="/profile/:creatorId" element={<ProfileDashboard user={user} />} />
                      <Route path="/call/:callId" element={<VirtualCallRoom />} />
                      <Route path="/food-truck" element={<FoodTruck />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                    </Routes>
                  </Suspense>
                </>
              } />
            </Routes>
          </Suspense>

          <Suspense fallback={null}>
             <Footer />
             <CookieConsent />
          </Suspense>

        </div>
    </WhiteLabelContext.Provider>
  );
}

// Separate the massive homepage into a stateless component for router cleanliness
export default App;
