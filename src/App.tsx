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
const MoreInfo = lazy(() => import('./components/MoreInfo'));
const Contact = lazy(() => import('./components/Contact'));
const VirtualCallRoom = lazy(() => import('./components/VirtualCallRoom'));
const Marketplace = lazy(() => import('./components/Marketplace'));
const ProductPage = lazy(() => import('./components/ProductPage'));
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WhiteLabelContext } from './context/WhiteLabelContext';
import { supabase, storageKey } from './supabaseClient';
import Home from './pages/Home';
import WhiteLabelHome from './pages/WhiteLabelHome';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function App() {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authDefaults, setAuthDefaults] = useState({ isLogin: true, role: 'viewer' as 'viewer' | 'influencer' | 'business' });
  const [wlConfig, setWlConfig] = useState<any>(null);
  const [isTenantMode, setIsTenantMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showEndUserAuthModal, setShowEndUserAuthModal] = useState(false);

  useEffect(() => {
    const handleOpenAuth = (e: any) => {
      if (e.detail) {
        setAuthDefaults({ isLogin: e.detail.isLogin ?? true, role: e.detail.role ?? 'viewer' });
      } else {
        setAuthDefaults({ isLogin: true, role: 'viewer' });
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
              contactAddress: e.detail.contactAddress
           }
         }).select().single();

         if (wlError) {
            console.warn('DB upsert failed (likely RLS). Falling back to local storage sync.', wlError);
            const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
            localNetworks.push({ ...e.detail, id: newId });
            localStorage.setItem('vibe_local_networks', JSON.stringify(localNetworks));
         } else if (wlData) {
            finalId = wlData.id;
            const { data: { session } } = await supabase!.auth.getSession();
            if (session?.user) {
               await supabase!.from('profiles').update({ whitelabel_id: finalId }).eq('id', session.user.id);
            }
         }
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
        const localTenant = localNetworks.find((n: any) => n.id === forceTenant);
        
        if (localTenant) {
           isTenant = true;
           setIsTenantMode(true);
           loadedTenantId = forceTenant;
           setWlConfig({
              id: localTenant.id,
              name: localTenant.name || 'Vibe B2B Enterprise',
              domain: localTenant.domain || 'vibenetwork.tv',
              accent: localTenant.theme?.accent || localTenant.accent || '#0055ff',
              bg: localTenant.theme?.bg || localTenant.bg || 'var(--bg-color)',
              heroCopy: localTenant.theme?.heroCopy || localTenant.heroCopy,
              btnPrimary: localTenant.theme?.btnPrimary || localTenant.btnPrimary,
              sliderCount: localTenant.theme?.sliderCount || localTenant.sliderCount || 4,
              customSections: localTenant.theme?.customSections || localTenant.customSections || 'Platform Architecture,Success Stories',
              heroImage: localTenant.theme?.heroImage || localTenant.heroImage,
              logoImage: localTenant.logo || localTenant.theme?.logoImage || localTenant.logoImage || null,
              contactEmail: localTenant.theme?.contactEmail || localTenant.contactEmail,
              contactPhone: localTenant.theme?.contactPhone || localTenant.contactPhone,
              contactAddress: localTenant.theme?.contactAddress || localTenant.contactAddress
           });
        } else {
           query = query.eq('id', forceTenant).limit(1);
           isTenant = true;
           setIsTenantMode(true);
        }
      } else if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== 'vibenetwork.tv') {
        query = query.eq('domain', hostname).limit(1);
        isTenant = true;
        setIsTenantMode(true);
      } else {
        // Master Platform Mode (localhost or vibenetwork.tv)
        // We fetch the master config so the Hero component can use it, but we DON'T set isTenantMode=true
        const { data: masterData } = await supabase!.from('whitelabel_configs').select('*').eq('domain', 'vibenetwork.tv').limit(1);
        if (masterData && masterData.length > 0) {
           const mConf = masterData[0];
           setWlConfig({
              id: mConf.id,
              name: mConf.name || 'Vibe Network',
              domain: 'vibenetwork.tv',
              heroImage: mConf.theme?.heroImage || null,
              heroCopy: mConf.theme?.heroCopy || null
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
             domain: dbConf.domain || 'vibenetwork.tv',
             accent: dbConf.theme?.accent || '#0055ff',
             bg: dbConf.theme?.bg || 'var(--bg-color)',
             heroCopy: dbConf.theme?.heroCopy || 'The premiere destination for high quality digital content.',
             btnPrimary: dbConf.theme?.btnPrimary || 'Explore Content',
             sliderCount: dbConf.theme?.sliderCount || 4,
             customSections: dbConf.theme?.customSections || 'Platform Architecture,Success Stories',
             heroImage: dbConf.theme?.heroImage || null,
             logoImage: dbConf.logo || dbConf.theme?.logoImage || null,
             contactEmail: dbConf.theme?.contactEmail,
             contactPhone: dbConf.theme?.contactPhone,
             contactAddress: dbConf.theme?.contactAddress
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
      }
      
      // Dynamic SEO Injection
      const platformName = wlConfig.name || 'Vibe Network';
      document.title = platformName;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', wlConfig.heroCopy || `Welcome to ${platformName}`);
      }

      // Update Favicon
      if (wlConfig.logoImage || wlConfig.logo) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = wlConfig.logoImage || wlConfig.logo;
      }
    }
  }, [wlConfig]);

  if (isTenantMode && wlConfig) {
    return (
      <WhiteLabelContext.Provider value={{ wlConfig, setWlConfig }}>
        <Router>
          <div style={{ background: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-primary)', overflowX: 'hidden' }}>
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
              <Route path="/product/:productId" element={<ProductPage />} />
              <Route path="/profile" element={<ProfileDashboard user={user} />} />
              <Route path="/profile/:creatorId" element={<ProfileDashboard user={user} />} />
              <Route path="/call/:callId" element={<VirtualCallRoom />} />
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
          </AnimatePresence>
        </div>
      </Router>
      </WhiteLabelContext.Provider>
    );
  }

  return (
    <WhiteLabelContext.Provider value={{ wlConfig, setWlConfig }}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
          <AnimatePresence>
            {showAuthModal && (
              <AuthModal 
                onClose={() => setShowAuthModal(false)} 
                onSuccess={(u) => setUser(u)} 
                defaultIsLogin={authDefaults.isLogin}
                defaultRole={authDefaults.role}
              />
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
                      <Route path="/profile" element={<ProfileDashboard user={user} />} />
                      <Route path="/profile/:creatorId" element={<ProfileDashboard user={user} />} />
                      <Route path="/call/:callId" element={<VirtualCallRoom />} />
                    </Routes>
                  </Suspense>
                </>
              } />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </WhiteLabelContext.Provider>
  );
}

// Separate the massive homepage into a stateless component for router cleanliness
export default App;
