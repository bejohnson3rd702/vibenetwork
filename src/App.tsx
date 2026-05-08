import { useEffect, useState, lazy, Suspense } from 'react';
import { ASSETS } from './data';
import { getCategoriesWithVideos } from './api';
import Navbar from './components/Navbar';

import AuthModal from './components/AuthModal';
const ProfileDashboard = lazy(() => import('./components/ProfileDashboard'));
const BusinessAdminDashboard = lazy(() => import('./components/BusinessAdminDashboard'));
import EndUserAuthModal from './components/EndUserAuthModal';
const MasterAdminDashboard = lazy(() => import('./components/MasterAdminDashboard'));
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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WhiteLabelContext } from './context/WhiteLabelContext';
import { supabase, storageKey } from './supabaseClient';
import { MASTER_DOMAIN, DEFAULT_PLATFORM_NAME } from './constants';
import Home from './pages/Home';
import WhiteLabelHome from './pages/WhiteLabelHome';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function App() {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authDefaults, setAuthDefaults] = useState({ isLogin: true, role: 'viewer' as 'viewer' | 'influencer' | 'business', showWizard: false, referredBy: undefined as string | undefined });
  const [wlConfig, setWlConfig] = useState<any>(null);
  const [isTenantMode, setIsTenantMode] = useState(() => {
    const hostname = window.location.hostname;
    const params = new URLSearchParams(window.location.search);
    return params.has('tenant') || (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== MASTER_DOMAIN);
  });
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showEndUserAuthModal, setShowEndUserAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const handleOpenBooking = () => setShowBookingModal(true);
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
         const { data: wlData, error: wlError } = await supabase!.from('whitelabel_configs').upsert({
           id: newId.includes('test_wl') ? undefined : newId, // allow DB to gen_random_uuid if test
           owner_id: currentSession?.user?.id,
           name: e.detail.name,
           domain: e.detail.domain,
           logo: e.detail.logoImage,
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
              heroVideoTitle: e.detail.heroVideoTitle || ''
           }
         }).select().single();

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
      const hostname = window.location.hostname;
      const urlParams = new URLSearchParams(window.location.search);
      const forceTenant = urlParams.get('tenant');

      let query = supabase!.from('whitelabel_configs').select('*');
      let isTenant = false;
      let loadedTenantId = undefined;

      if (forceTenant) {
        const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
        
        // Always try to fetch from DB first as the absolute source of truth
        const { data: dbTenantData } = await supabase!.from('whitelabel_configs').select('*').eq('id', forceTenant).limit(1);
        
        if (dbTenantData && dbTenantData.length > 0) {
           isTenant = true;
           setIsTenantMode(true);
           loadedTenantId = forceTenant;
           const dbConf = dbTenantData[0];
           setWlConfig({
              id: dbConf.id,
              name: dbConf.name || 'Vibe B2B Enterprise',
              domain: dbConf.domain || MASTER_DOMAIN,
              accent: dbConf.theme?.accent || '#0055ff',
              bg: dbConf.theme?.bg || 'var(--bg-color)',
              heroCopy: dbConf.theme?.heroCopy || 'The premiere destination for high quality digital content.',
              btnPrimary: dbConf.theme?.btnPrimary || 'Explore Content',
              sliderCount: dbConf.theme?.sliderCount || 4,
              customSections: dbConf.theme?.customSections || '',
              heroImage: dbConf.theme?.heroImage || null,
              logoImage: dbConf.logo || dbConf.theme?.logoImage || null,
              contactEmail: dbConf.theme?.contactEmail,
              contactPhone: dbConf.theme?.contactPhone,
              contactAddress: dbConf.theme?.contactAddress,
              owner_id: dbConf.owner_id,
              enableWatchLive: dbConf.theme?.enableWatchLive !== undefined ? dbConf.theme.enableWatchLive : (dbConf.enableWatchLive !== undefined ? dbConf.enableWatchLive : true),
              enableBooking: dbConf.theme?.enableBooking !== undefined ? dbConf.theme.enableBooking : (dbConf.enableBooking !== undefined ? dbConf.enableBooking : false),
              heroLayoutMode: dbConf.theme?.heroLayoutMode || 'verbiage',
              heroVideoUrl: dbConf.theme?.heroVideoUrl || '',
              heroVideoTitle: dbConf.theme?.heroVideoTitle || '',
              theme: dbConf.theme || {}
           });
        } else {
           // Fallback to local storage for completely un-published preview networks
           const localTenant = localNetworks.find((n: any) => n.id === forceTenant);
           if (localTenant) {
              isTenant = true;
              setIsTenantMode(true);
              loadedTenantId = forceTenant;
              setWlConfig({
                 id: localTenant.id,
                 name: localTenant.name || 'Vibe B2B Enterprise',
                 domain: localTenant.domain || MASTER_DOMAIN,
                 accent: localTenant.theme?.accent || localTenant.accent || '#0055ff',
                 bg: localTenant.theme?.bg || localTenant.bg || 'var(--bg-color)',
                 heroCopy: localTenant.theme?.heroCopy || localTenant.heroCopy,
                 btnPrimary: localTenant.theme?.btnPrimary || localTenant.btnPrimary,
                 sliderCount: localTenant.theme?.sliderCount || localTenant.sliderCount || 4,
                 customSections: localTenant.theme?.customSections || localTenant.customSections || '',
                 heroImage: localTenant.theme?.heroImage || localTenant.heroImage,
                 logoImage: localTenant.logo || localTenant.theme?.logoImage || localTenant.logoImage || null,
                 contactEmail: localTenant.theme?.contactEmail || localTenant.contactEmail,
                 contactPhone: localTenant.theme?.contactPhone || localTenant.contactPhone,
                 contactAddress: localTenant.theme?.contactAddress || localTenant.contactAddress,
                 owner_id: localTenant.owner_id,
                 enableWatchLive: localTenant.theme?.enableWatchLive !== undefined ? localTenant.theme.enableWatchLive : (localTenant.enableWatchLive !== undefined ? localTenant.enableWatchLive : true),
                 enableBooking: localTenant.theme?.enableBooking !== undefined ? localTenant.theme.enableBooking : (localTenant.enableBooking !== undefined ? localTenant.enableBooking : false),
                 heroLayoutMode: localTenant.theme?.heroLayoutMode || localTenant.heroLayoutMode || 'verbiage',
                 heroVideoUrl: localTenant.theme?.heroVideoUrl || localTenant.heroVideoUrl || '',
                 heroVideoTitle: localTenant.theme?.heroVideoTitle || localTenant.heroVideoTitle || '',
                 theme: localTenant.theme || {}
              });
           }
        }
      } else if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== MASTER_DOMAIN) {
        query = query.eq('domain', hostname).limit(1);
        isTenant = true;
        setIsTenantMode(true);
      } else {
        // Master Platform Mode (localhost or MASTER_DOMAIN)
        const localMaster = localNetworks.find((n: any) => n.domain === MASTER_DOMAIN || n.id === 'master');
        
        const { data: masterData } = await supabase!.from('whitelabel_configs').select('*').eq('domain', MASTER_DOMAIN).limit(1);
        if (masterData && masterData.length > 0) {
           const mConf = masterData[0];
           // Merge local Master overrides if they exist (for local dev without DB write access)
           setWlConfig({
              id: mConf.id,
              name: localMaster?.name || mConf.name || DEFAULT_PLATFORM_NAME,
              domain: MASTER_DOMAIN,
              heroImage: localMaster?.theme?.heroImage || localMaster?.heroImage || mConf.theme?.heroImage || null,
              heroCopy: localMaster?.theme?.heroCopy || localMaster?.heroCopy || mConf.theme?.heroCopy || null,
              owner_id: mConf.owner_id,
              enableWatchLive: localMaster?.theme?.enableWatchLive !== undefined ? localMaster.theme.enableWatchLive : (localMaster?.enableWatchLive !== undefined ? localMaster.enableWatchLive : (mConf.theme?.enableWatchLive !== undefined ? mConf.theme.enableWatchLive : true)),
              enableBooking: localMaster?.theme?.enableBooking !== undefined ? localMaster.theme.enableBooking : (localMaster?.enableBooking !== undefined ? localMaster.enableBooking : (mConf.theme?.enableBooking !== undefined ? mConf.theme.enableBooking : false)),
              heroLayoutMode: localMaster?.theme?.heroLayoutMode || localMaster?.heroLayoutMode || mConf.theme?.heroLayoutMode || 'verbiage',
              heroVideoUrl: localMaster?.theme?.heroVideoUrl || localMaster?.heroVideoUrl || mConf.theme?.heroVideoUrl || '',
              heroVideoTitle: localMaster?.theme?.heroVideoTitle || localMaster?.heroVideoTitle || mConf.theme?.heroVideoTitle || '',
              theme: mConf.theme || localMaster?.theme || {}
           });
        } else if (localMaster) {
           // Fallback if DB query completely fails but local exists
           setWlConfig({
              id: localMaster.id,
              name: localMaster.name || DEFAULT_PLATFORM_NAME,
              domain: MASTER_DOMAIN,
              heroImage: localMaster.theme?.heroImage || localMaster.heroImage || null,
              heroCopy: localMaster.theme?.heroCopy || localMaster.heroCopy || null,
              owner_id: localMaster.owner_id,
              enableWatchLive: localMaster.theme?.enableWatchLive !== undefined ? localMaster.theme.enableWatchLive : (localMaster.enableWatchLive !== undefined ? localMaster.enableWatchLive : true),
              enableBooking: localMaster.theme?.enableBooking !== undefined ? localMaster.theme.enableBooking : (localMaster.enableBooking !== undefined ? localMaster.enableBooking : false),
              heroLayoutMode: localMaster.theme?.heroLayoutMode || localMaster.heroLayoutMode || 'verbiage',
              heroVideoUrl: localMaster.theme?.heroVideoUrl || localMaster.heroVideoUrl || '',
              heroVideoTitle: localMaster.theme?.heroVideoTitle || localMaster.heroVideoTitle || '',
              theme: localMaster.theme || {}
           });
        }
      }

      if (isTenant && !loadedTenantId) {
        const { data } = await query;
        if (data && data.length > 0) {
          const dbConf = data[0];
          loadedTenantId = dbConf.id;
          setWlConfig({
             id: dbConf.id,
             name: dbConf.name || 'Vibe B2B Enterprise',
             domain: dbConf.domain || MASTER_DOMAIN,
             accent: dbConf.theme?.accent || '#0055ff',
             bg: dbConf.theme?.bg || 'var(--bg-color)',
             heroCopy: dbConf.theme?.heroCopy || 'The premiere destination for high quality digital content.',
             btnPrimary: dbConf.theme?.btnPrimary || 'Explore Content',
             sliderCount: dbConf.theme?.sliderCount || 4,
             customSections: dbConf.theme?.customSections || '',
             heroImage: dbConf.theme?.heroImage || null,
             logoImage: dbConf.logo || dbConf.theme?.logoImage || null,
             contactEmail: dbConf.theme?.contactEmail,
             contactPhone: dbConf.theme?.contactPhone,
             contactAddress: dbConf.theme?.contactAddress,
             owner_id: dbConf.owner_id,
             enableWatchLive: dbConf.theme?.enableWatchLive !== undefined ? dbConf.theme.enableWatchLive : (dbConf.enableWatchLive !== undefined ? dbConf.enableWatchLive : true),
             enableBooking: dbConf.theme?.enableBooking !== undefined ? dbConf.theme.enableBooking : (dbConf.enableBooking !== undefined ? dbConf.enableBooking : false),
             heroLayoutMode: dbConf.theme?.heroLayoutMode || 'verbiage',
             heroVideoUrl: dbConf.theme?.heroVideoUrl || '',
             heroVideoTitle: dbConf.theme?.heroVideoTitle || '',
             theme: dbConf.theme || {}
          });
        }
      }

      const freshCategories = await getCategoriesWithVideos(loadedTenantId);
      setCategories(freshCategories || []);
    }
    initPlatform();
  }, []);

  useEffect(() => {
    if (wlConfig) {
      if (wlConfig.bg) {
        document.documentElement.style.setProperty('--bg-color', wlConfig.bg);
        
        // Dynamic Light/Dark Mode Toggle
        const bgHex = wlConfig.bg.toLowerCase();
        if (bgHex === '#f4f4f4' || bgHex === '#ffffff' || bgHex === '#fff' || bgHex === 'white' || bgHex === '#f7f7f7') {
           document.documentElement.setAttribute('data-theme', 'light');
           document.documentElement.style.setProperty('--bg-gradient', `linear-gradient(145deg, ${wlConfig.bg} 0%, #e2e8f0 100%)`);
        } else {
           document.documentElement.removeAttribute('data-theme');
           document.documentElement.style.setProperty('--bg-gradient', wlConfig.bg);
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
    if (!wlConfig) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0b0b', color: 'rgba(255,255,255,0.5)' }}>Initializing Network OS...</div>;
    
    return (
      <WhiteLabelContext.Provider value={{ wlConfig, setWlConfig }}>
        <Router>
          <div style={{ background: 'var(--bg-gradient, var(--bg-color))', minHeight: '100vh', color: 'var(--text-primary)', overflowX: 'hidden' }}>
            <Navbar user={user} onLoginClick={() => setShowEndUserAuthModal(true)} onAdminClick={() => setShowAdminPanel(true)} />
          
          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading interface...</div>}>
            <Routes>
              <Route path="/" element={
                 <WhiteLabelHome wlConfig={wlConfig} categories={categories} user={user} activeVideo={activeVideo} setActiveVideo={setActiveVideo} />
              } />
              <Route path="/marketplace" element={<Marketplace />} />
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
            </Routes>
          </Suspense>
          
          {showAdminPanel && user && (
            <Suspense fallback={null}>
              <BusinessAdminDashboard onClose={() => setShowAdminPanel(false)} />
            </Suspense>
          )}

          <AnimatePresence>
             {showEndUserAuthModal && (
               <EndUserAuthModal onClose={() => setShowEndUserAuthModal(false)} />
             )}
             {showBookingModal && (
               <BookingModal onClose={() => setShowBookingModal(false)} />
             )}
          </AnimatePresence>
          
          <Suspense fallback={null}>
             <Footer />
             <CookieConsent />
          </Suspense>
        </div>
      </Router>
      </WhiteLabelContext.Provider>
    );
  }

  return (
    <WhiteLabelContext.Provider value={{ wlConfig, setWlConfig }}>
      <Router>
        <div style={{ background: 'var(--bg-gradient, var(--bg-color))', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
          <AnimatePresence>
            {showAuthModal && (
              <AuthModal 
                onClose={() => setShowAuthModal(false)} 
                onSuccess={(u) => setUser(u)} 
                defaultIsLogin={authDefaults.isLogin}
                defaultRole={authDefaults.role}
                defaultShowWizard={authDefaults.showWizard}
                referredBy={authDefaults.referredBy}
              />
            )}
            {showBookingModal && (
               <BookingModal onClose={() => setShowBookingModal(false)} />
            )}
          </AnimatePresence>

          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading platform...</div>}>
            <Routes>
              <Route path="/master-admin" element={<MasterAdminDashboard />} />
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
      </Router>
    </WhiteLabelContext.Provider>
  );
}

// Separate the massive homepage into a stateless component for router cleanliness
export default App;
