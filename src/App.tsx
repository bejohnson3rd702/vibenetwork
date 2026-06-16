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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { WhiteLabelContext } from './context/WhiteLabelContext';
import { supabase, storageKey } from './supabaseClient';
import { MASTER_DOMAIN, DEFAULT_PLATFORM_NAME } from './constants';
const Home = lazy(() => import('./pages/Home'));
import { normalizeWlConfig } from './lib/whitelabel';
const WhiteLabelHome = lazy(() => import('./pages/WhiteLabelHome'));
const N2NHome = lazy(() => import('./pages/N2NHome'));
const AvoMarketplace = lazy(() => import('./components/AvoMarketplace'));
const ShopifyStore = lazy(() => import('./components/ShopifyStore'));
const BibleDrawer = lazy(() => import('./components/BibleDrawer'));
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
      let localNetworks = [];
      try {
        const stored = localStorage.getItem('vibe_local_networks');
        if (stored && stored !== 'undefined') {
          localNetworks = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Could not parse local networks', e);
      }
      
      if (forceTenant) {
        
        // Always try to fetch from DB first as the absolute source of truth
        const { data: dbTenantData } = await supabase!.from('whitelabel_configs').select('*').eq('id', forceTenant).limit(1);
        
        if (dbTenantData && dbTenantData.length > 0) {
           isTenant = true;
           setIsTenantMode(true);
           loadedTenantId = forceTenant;
           const dbConf = dbTenantData[0];
           setWlConfig(normalizeWlConfig(dbConf, { name: dbConf.name || 'Vibe B2B Enterprise' }));
        } else {
           // Fallback to local storage for completely un-published preview networks
           const localTenant = localNetworks.find((n: any) => n.id === forceTenant);
           if (localTenant) {
              isTenant = true;
              setIsTenantMode(true);
              loadedTenantId = forceTenant;
              setWlConfig(normalizeWlConfig(localTenant, { name: localTenant.name || 'Vibe B2B Enterprise' }));
           }
        }
      } else if (!(hostname === 'localhost' || hostname === '127.0.0.1' || hostname === MASTER_DOMAIN || hostname === 'vibenetwork.com' || hostname === 'vibenetwork.tv' || hostname.includes('vercel.app'))) {
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
           setWlConfig(normalizeWlConfig({ ...mConf, ...localMaster }, { accent: localMaster?.accent || localMaster?.theme?.accent || mConf.accent || mConf.theme?.accent || '#D35400', enableWatchLive: true }));
        } else if (localMaster) {
           // Fallback if DB query completely fails but local exists
           setWlConfig(normalizeWlConfig(localMaster, { accent: localMaster.accent || localMaster.theme?.accent || '#D35400', enableWatchLive: true }));
        }
      }

      if (isTenant && !loadedTenantId) {
        const { data } = await query;
        if (data && data.length > 0) {
          const dbConf = data[0];
          loadedTenantId = dbConf.id;
          setWlConfig(normalizeWlConfig(dbConf, { name: dbConf.name || 'Vibe B2B Enterprise' }));
        }
      }

      setWlConfig(prev => {
        if (prev) return prev;
        // Ultimate Fallback: if we still haven't found a config from DB or local storage, load defaults
        return normalizeWlConfig({});
      });

      const freshCategories = await getCategoriesWithVideos(loadedTenantId);
      setCategories(freshCategories || []);
      } catch (err) {
        console.error("Critical error during Network OS initialization", err);
        // Guarantee the site loads in fallback mode even if DB/network throws an exception
        setWlConfig(normalizeWlConfig({}));
      }
    }
    initPlatform();
  }, []);

  useEffect(() => {
    if (wlConfig) {
      if (wlConfig.accent) {
         document.documentElement.style.setProperty('--accent-primary', wlConfig.accent);
      }
      
      // Dynamic High-Impact Typography for Mr. Olympia
      const isOlympian = wlConfig.name?.toLowerCase().includes('olympia') || 
                         wlConfig.domain?.includes('mrolympia.com') ||
                         wlConfig.name?.toLowerCase().includes('muscle') ||
                         wlConfig.name?.toLowerCase().includes('fitness');
      if (isOlympian) {
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
    
    return (
      <WhiteLabelContext.Provider value={{ wlConfig, setWlConfig }}>
        <Router>
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
                 wlConfig?.n2n_enabled
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

          {wlConfig && (wlConfig.id === '33742e2f-430b-4c2d-9cba-42507891ef02' || wlConfig.parent_network_id === '33742e2f-430b-4c2d-9cba-42507891ef02') && (
            <Suspense fallback={null}>
              <BibleDrawer accent={wlConfig.theme?.accent || wlConfig.accent || '#004e98'} />
            </Suspense>
          )}
        </div>
      </Router>
      </WhiteLabelContext.Provider>
    );
  }

  return (
    <WhiteLabelContext.Provider value={{ wlConfig: wlConfig || normalizeWlConfig({}), setWlConfig }}>
      <Router>
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
      </Router>
    </WhiteLabelContext.Provider>
  );
}

// Separate the massive homepage into a stateless component for router cleanliness
export default App;
