import React, { useState, useEffect } from 'react';
import { User, Menu, Lightbulb, Wallet, Settings, LogOut } from 'lucide-react';
import { ASSETS } from '../data';
import { Link, useNavigate } from 'react-router-dom';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../supabaseClient';
import { mergeQueryParams } from '../lib/n2n';
import { isBonaireConfig } from '../lib/whitelabel';

interface NavbarProps {
  user: any;
  onLoginClick: () => void;
  onAdminClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onAdminClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();
  const { wlConfig } = useWhiteLabel();
  const toast = useToast();
  const appName = wlConfig?.name || '';
  const appAccent = wlConfig?.accent || '';
  const appLogo = wlConfig?.logoImage || '';
  const [parentName, setParentName] = useState<string>('VIBE NETWORK');

  const tenantParam = new URLSearchParams(window.location.search).get('tenant');
  const isMainVibeTenant = 
    tenantParam === 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' || 
    tenantParam === 'b0ea0000-c08f-4260-8540-a0cc8bed4e11' || 
    tenantParam === 'master' || 
    tenantParam === 'vibe' || 
    wlConfig?.id === 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' || 
    wlConfig?.id === 'b0ea0000-c08f-4260-8540-a0cc8bed4e11' || 
    wlConfig?.id === 'master' || 
    wlConfig?.id === 'vibe';

  const isSubTenantChannel = Boolean(
    (wlConfig?.parent_network_id && !isMainVibeTenant) ||
    (wlConfig?.id && !isMainVibeTenant)
  );

  const isProfilePage = location.pathname.startsWith('/profile') || location.pathname.startsWith('/channel');

  const hasSubTenantParam = Boolean(
    tenantParam && !isMainVibeTenant
  );

  const showBackToVibe = 
    !isMainVibeTenant && (
      isSubTenantChannel ||
      isProfilePage ||
      hasSubTenantParam ||
      new URLSearchParams(window.location.search).has('channel') ||
      new URLSearchParams(window.location.search).has('creator') ||
      new URLSearchParams(window.location.search).get('fromVibe') === 'true'
    );

  useEffect(() => {
    if (wlConfig?.parent_network_id) {
      if (wlConfig.parent_network_id === 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' || wlConfig.parent_network_id === 'b0ea0000-c08f-4260-8540-a0cc8bed4e11') {
        setParentName('VIBE NETWORK');
      } else {
        supabase
          .from('whitelabel_configs')
          .select('name')
          .eq('id', wlConfig.parent_network_id)
          .single()
          .then(({ data }) => {
            if (data?.name) {
              setParentName(data.name);
            }
          });
      }
    }
  }, [wlConfig?.parent_network_id]);

  const getParentNetworkUrl = () => {
    const parentId = wlConfig?.parent_network_id;
    if (!parentId || parentId === 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' || parentId === 'b0ea0000-c08f-4260-8540-a0cc8bed4e11') {
      return '/';
    }
    return `/?tenant=${parentId}`;
  };

  const toggleTheme = () => {
    // Light mode disabled sitewide
    /*
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    */
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isBonaire = isBonaireConfig(wlConfig);

  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      const metaAvatar = user.user_metadata?.avatar_url || user.avatar_url;
      if (metaAvatar) {
        setUserAvatar(metaAvatar);
      } else {
        supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data?.avatar_url) setUserAvatar(data.avatar_url);
          });
      }
    } else {
      setUserAvatar(null);
    }
  }, [user]);

  return (
    <nav className="px-mobile-sm gap-mobile-sm" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: scrolled ? '16px 60px' : '24px 60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100,
      background: scrolled ? '#000000' : 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      transition: 'all 0.4s ease'
    }}>
      <Link to={`/${window.location.search}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        {appLogo && wlConfig?.id !== 'courtney-bee-tenant-id' && wlConfig?.id !== 'cb000000-c08f-4260-8540-a0cc8bed4e11' && wlConfig?.id !== 'c0071234-c08f-4260-8540-a0cc8bed4e11' && wlConfig?.id !== 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' && wlConfig?.id !== 'b0ea0000-c08f-4260-8540-a0cc8bed4e11' ? (
          <img referrerPolicy="no-referrer" src={appLogo} alt={appName} onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(appName || 'Vibe')}&background=random`} style={{ height: appName.toLowerCase().includes('olympia') ? '80px' : appName.toLowerCase().includes('vibe 100') ? '55px' : appName.toLowerCase().includes('bonaire') ? '60px' : '36px', objectFit: 'contain', cursor: 'pointer', borderRadius: '4px' }} />
        ) : (
          <h1 style={{ margin: 0, fontSize: (wlConfig?.id === 'courtney-bee-tenant-id' || wlConfig?.id === 'cb000000-c08f-4260-8540-a0cc8bed4e11' || wlConfig?.id === 'c0071234-c08f-4260-8540-a0cc8bed4e11') ? '22px' : '24px', color: '#fff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: "'Outfit', 'Anton', sans-serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
            {(wlConfig?.id === 'courtney-bee-tenant-id' || wlConfig?.id === 'cb000000-c08f-4260-8540-a0cc8bed4e11' || wlConfig?.id === 'c0071234-c08f-4260-8540-a0cc8bed4e11') ? (
              <>
                <span style={{ color: '#ff4d85', fontWeight: 900 }}>COURTNEY BEE</span>
                <span style={{ fontSize: '12px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,77,133,0.15)', border: '1px solid rgba(255,77,133,0.4)', color: '#fff', letterSpacing: '1px' }}>NETWORK</span>
              </>
            ) : 'VIBE NETWORK'}
          </h1>
        )}
      </Link>
      
      <ul className="hide-on-mobile hide-on-tablet" style={{ 
        display: 'flex', 
        listStyle: 'none', 
        gap: '28px',
        margin: 0,
        padding: 0,
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: '13px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        {[
          { label: 'Home', path: '/' },
          ...(showBackToVibe ? [{ label: parentName && parentName !== 'VIBE NETWORK' ? `Return to ${parentName}` : '🛸 Back to Vibe', path: 'parent' }] : []),
          { label: 'Marketplace', path: '/marketplace', hidden: Boolean(
            wlConfig?.domain && 
            wlConfig.id !== 'master' && 
            wlConfig.domain !== 'vibenetwork.tv' && 
            wlConfig.domain !== 'vibenetwork.com' && 
            wlConfig.domain !== 'vibenetwork.vercel.app' && 
            !wlConfig.domain?.includes('vercel.app')
          ) },
          { label: 'About Us', path: '/about' },
          { label: 'Watch Live', path: '/#whats-on-now', hidden: wlConfig?.enableWatchLive === false },
          { label: 'Contact', path: '/contact' }
        ].filter(item => !item.hidden).map((item, i) => (
          <li key={item.label} style={{ 
            cursor: 'pointer',
            color: item.path === 'back-to-vibe' ? 'var(--accent-primary)' : (i === 0 ? 'white' : 'rgba(255,255,255,0.6)'),
            transition: 'color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.color = item.path === 'back-to-vibe' ? 'var(--accent-primary)' : 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = item.path === 'back-to-vibe' ? 'var(--accent-primary)' : (i === 0 ? 'white' : 'rgba(255,255,255,0.6)')}
          onClick={() => {
             if (item.path === 'parent') {
                  window.location.href = getParentNetworkUrl();
             } else if (item.path === 'back-to-vibe') {
                  const params = new URLSearchParams(window.location.search);
                  params.delete('tenant');
                  const searchStr = params.toString();
                  window.location.href = searchStr ? `/?${searchStr}` : '/';
             } else if (item.path.startsWith('/#')) {
                  navigate(`/${window.location.search}`);
                  setTimeout(() => {
                      document.getElementById(item.path.substring(2))?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
             } else {
                  navigate(`${item.path}${window.location.search}`);
             }
          }}
          >
            {item.label}
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

          {/*
          <Lightbulb 
            size={22} 
            color={theme === 'dark' ? '#D35400' : '#ffffff'} 
            style={{ 
               cursor: 'pointer',
               filter: theme === 'light' ? 'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))' : 'drop-shadow(0px 0px 8px rgba(211, 84, 0, 0.4))',
               transition: 'all 0.3s'
            }}
            onClick={toggleTheme} 
          />
          */}

        </div>
        <div className="hide-on-mobile hide-on-tablet" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {((wlConfig?.owner_id && user?.id === wlConfig?.owner_id) || (!wlConfig?.owner_id && user?.user_metadata?.role === 'business') || user?.email?.toLowerCase().includes('bennie') || user?.email?.toLowerCase().includes('joe') || user?.email?.toLowerCase().includes('admin') || user?.user_metadata?.role === 'admin') && onAdminClick && (
                <button 
                  onClick={onAdminClick}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: appAccent || '#D35400', padding: '6px 14px', borderRadius: '8px', border: 'none' }}
                >
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '12px', color: 'white', letterSpacing: '1px' }}>
                    Dashboard
                  </span>
                </button>
              )}
              <Link to={`/profile${window.location.search}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                  {userAvatar ? (
                    <img src={userAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setUserAvatar(null)} />
                  ) : (
                    <span style={{ color: '#000', fontWeight: 'bold', fontSize: '13px' }}>{user.email?.[0].toUpperCase()}</span>
                  )}
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '12px', color: 'white', letterSpacing: '1px' }}>
                  Profile
                </span>
              </Link>
            </div>
          ) : (
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s' }} onMouseOver={e=>e.currentTarget.style.opacity='0.8'} onMouseOut={e=>e.currentTarget.style.opacity='1'} onClick={onLoginClick}>
              <User size={20} color={appAccent || "white"} />
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: appAccent || 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Log In</span>
            </div>
          )}
        </div>
        <div className={user ? "" : "show-on-mobile-tablet"} style={{ display: 'flex', alignItems: 'center', marginLeft: '12px', position: 'relative', gap: '12px' }}>
          {user && (
            <Link 
              to={`/profile${window.location.search}`} 
              className="show-on-mobile-tablet"
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              title="View Profile"
            >
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setUserAvatar(null)} />
                ) : (
                  <span style={{ color: '#000', fontWeight: 'bold', fontSize: '11px' }}>{user.email?.[0].toUpperCase()}</span>
                )}
              </div>
            </Link>
          )}
          <Menu size={24} color="white" cursor="pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
          
          {isMenuOpen && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '24px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              {showBackToVibe && (
                <>
                  <div onClick={() => {
                    setIsMenuOpen(false);
                    window.location.href = getParentNetworkUrl();
                  }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s', fontWeight: 'bold' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                    🌐 Return to {parentName}
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                </>
              )}
              {user ? (
                <>
                  <div style={{ padding: '8px 16px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                     System Options
                  </div>
                  
                  {((wlConfig?.owner_id && user?.id === wlConfig?.owner_id) || (!wlConfig?.owner_id && user?.user_metadata?.role === 'business') || user?.email?.toLowerCase().includes('bennie') || user?.email?.toLowerCase().includes('joe') || user?.email?.toLowerCase().includes('admin') || user?.user_metadata?.role === 'admin') && onAdminClick && (
                    <div onClick={() => { setIsMenuOpen(false); onAdminClick(); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      <Settings size={16} /> Business Dashboard
                    </div>
                  )}
                  
                   <Link to={`/profile${window.location.search}`} onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                     <User size={16} /> My Profile
                   </Link>

                   <Link to={`/profile${window.location.search}${window.location.search ? '&' : '?'}tab=wallet`} onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                     <Wallet size={16} /> Digital Wallet
                   </Link>

                  <Link to={`/profile${window.location.search}`} onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                    <Settings size={16} /> Account Settings
                  </Link>
                  
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

                  <div onClick={async () => { await supabase?.auth?.signOut(); window.location.reload(); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#ff4444', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,68,68,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                    <LogOut size={16} /> Disconnect
                  </div>
                </>
              ) : (
                <>
                  <div style={{ padding: '8px 16px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                     Welcome Visitor
                  </div>
                  
                  <div onClick={() => { setIsMenuOpen(false); onLoginClick(); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                    <User size={16} /> Log In / Sign Up
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
