import React, { useState, useEffect } from 'react';
import { User, Menu, Wallet, Settings, LogOut, Home as HomeIcon, ShoppingBag, Info, Tv, Mail, ArrowLeft, X } from 'lucide-react';
import { ASSETS } from '../data';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../supabaseClient';
import { mergeQueryParams } from '../lib/n2n';
import { isBonaireConfig } from '../lib/whitelabel';
import { isStripeEnabled } from '../lib/stripeConfig';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  user: any;
  onLoginClick: () => void;
  onAdminClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onAdminClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { wlConfig } = useWhiteLabel();
  const toast = useToast();
  const appName = wlConfig?.name || '';
  const appAccent = wlConfig?.accent || '#D35400';
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
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon size={18} /> },
    { 
      label: 'Marketplace', 
      path: '/marketplace', 
      icon: <ShoppingBag size={18} />,
      hidden: Boolean(
        wlConfig?.domain && 
        wlConfig.id !== 'master' && 
        wlConfig.domain !== 'vibenetwork.tv' && 
        wlConfig.domain !== 'vibenetwork.com' && 
        wlConfig.domain !== 'vibenetwork.vercel.app' && 
        !wlConfig.domain?.includes('vercel.app')
      ) 
    },
    { label: 'About Us', path: '/about', icon: <Info size={18} /> },
    { label: 'Watch Live', path: '/#whats-on-now', icon: <Tv size={18} />, hidden: wlConfig?.enableWatchLive === false },
    { label: 'Contact', path: '/contact', icon: <Mail size={18} /> }
  ].filter(item => !item.hidden);

  const handleNavClick = (path: string) => {
    setIsMenuOpen(false);
    if (path === 'parent') {
      window.location.href = getParentNetworkUrl();
    } else if (path === 'back-to-vibe') {
      const params = new URLSearchParams(window.location.search);
      params.delete('tenant');
      const searchStr = params.toString();
      window.location.href = searchStr ? `/?${searchStr}` : '/';
    } else if (path.startsWith('/#')) {
      navigate(`/${window.location.search}`);
      setTimeout(() => {
        document.getElementById(path.substring(2))?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(`${path}${window.location.search}`);
    }
  };

  const isUserAdmin = Boolean(
    (wlConfig?.owner_id && user?.id === wlConfig?.owner_id) || 
    (!wlConfig?.owner_id && user?.user_metadata?.role === 'business') || 
    user?.email?.toLowerCase().includes('bennie') || 
    user?.email?.toLowerCase().includes('joe') || 
    user?.email?.toLowerCase().includes('admin') || 
    user?.user_metadata?.role === 'admin'
  );

  return (
    <>
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          padding: isMobile ? (scrolled ? '12px 16px' : '16px 16px') : (scrolled ? '16px 60px' : '24px 60px'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 100,
          background: scrolled ? '#000000' : 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Left: Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to={`/${window.location.search}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            {appLogo && wlConfig?.id !== 'courtney-bee-tenant-id' && wlConfig?.id !== 'cb000000-c08f-4260-8540-a0cc8bed4e11' && wlConfig?.id !== 'c0071234-c08f-4260-8540-a0cc8bed4e11' && wlConfig?.id !== 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' && wlConfig?.id !== 'b0ea0000-c08f-4260-8540-a0cc8bed4e11' ? (
              <img 
                referrerPolicy="no-referrer" 
                src={appLogo} 
                alt={appName} 
                onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(appName || 'Vibe')}&background=random`} 
                style={{ 
                  height: isMobile ? '34px' : (appName.toLowerCase().includes('olympia') ? '80px' : appName.toLowerCase().includes('vibe 100') ? '55px' : appName.toLowerCase().includes('bonaire') ? '60px' : '36px'), 
                  maxWidth: isMobile ? '160px' : '240px',
                  objectFit: 'contain', 
                  cursor: 'pointer', 
                  borderRadius: '4px' 
                }} 
              />
            ) : (
              <h1 style={{ 
                margin: 0, 
                fontSize: isMobile ? '18px' : (wlConfig?.id === 'courtney-bee-tenant-id' || wlConfig?.id === 'cb000000-c08f-4260-8540-a0cc8bed4e11' || wlConfig?.id === 'c0071234-c08f-4260-8540-a0cc8bed4e11' ? '22px' : '24px'), 
                color: '#fff', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                letterSpacing: '1.2px', 
                fontFamily: "'Outfit', 'Anton', sans-serif", 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                {(wlConfig?.id === 'courtney-bee-tenant-id' || wlConfig?.id === 'cb000000-c08f-4260-8540-a0cc8bed4e11' || wlConfig?.id === 'c0071234-c08f-4260-8540-a0cc8bed4e11') ? (
                  <>
                    <span style={{ color: '#ff4d85', fontWeight: 900 }}>COURTNEY BEE</span>
                    <span style={{ fontSize: isMobile ? '10px' : '12px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,77,133,0.15)', border: '1px solid rgba(255,77,133,0.4)', color: '#fff', letterSpacing: '1px' }}>NETWORK</span>
                  </>
                ) : 'VIBE NETWORK'}
              </h1>
            )}
          </Link>

          {isStripeEnabled() && !isMobile && (
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: '6px',
              background: 'rgba(99, 91, 255, 0.18)',
              border: '1px solid rgba(99, 91, 255, 0.55)',
              color: '#c4b5fd',
              letterSpacing: '0.8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 10px rgba(99,91,255,0.2)'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#635bff', boxShadow: '0 0 6px #635bff' }} />
              STAGING • STRIPE ACTIVE
            </span>
          )}
        </div>
        
        {/* Center: Desktop Navigation */}
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
          {showBackToVibe && (
            <li 
              style={{ 
                cursor: 'pointer',
                color: appAccent,
                transition: 'color 0.2s',
                fontWeight: 700
              }}
              onClick={() => handleNavClick('parent')}
            >
              {parentName && parentName !== 'VIBE NETWORK' ? `Return to ${parentName}` : '🛸 Back to Vibe'}
            </li>
          )}
          {navLinks.map((item) => (
            <li 
              key={item.label} 
              style={{ 
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.7)',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'white'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              onClick={() => handleNavClick(item.path)}
            >
              {item.label}
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '20px' }}>
          {/* Desktop User Section */}
          <div className="hide-on-mobile hide-on-tablet" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {isUserAdmin && onAdminClick && (
                  <button 
                    onClick={onAdminClick}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: appAccent, padding: '7px 16px', borderRadius: '8px', border: 'none' }}
                  >
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '12px', color: 'white', letterSpacing: '1px' }}>
                      Dashboard
                    </span>
                  </button>
                )}
                <Link to={`/profile${window.location.search}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textDecoration: 'none' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                    {userAvatar ? (
                      <img src={userAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setUserAvatar(null)} />
                    ) : (
                      <span style={{ color: '#000', fontWeight: 'bold', fontSize: '13px' }}>{user.email?.[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: 'white', letterSpacing: '1px' }}>
                    Channel
                  </span>
                </Link>
              </div>
            ) : (
              <button 
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '8px 18px',
                  borderRadius: '24px',
                  transition: 'all 0.2s ease'
                }} 
                onClick={onLoginClick}
              >
                <User size={16} color="white" />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '12px', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Log In</span>
              </button>
            )}
          </div>

          {/* Quick Profile Avatar for Mobile */}
          {user && (
            <Link 
              to={`/profile${window.location.search}`} 
              className="show-on-mobile"
              style={{ display: 'none', alignItems: 'center', textDecoration: 'none' }}
              title="View Channel"
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setUserAvatar(null)} />
                ) : (
                  <span style={{ color: '#000', fontWeight: 'bold', fontSize: '12px' }}>{user.email?.[0].toUpperCase()}</span>
                )}
              </div>
            </Link>
          )}

          {/* Hamburger Menu Toggle Button */}
          <button 
            type="button"
            aria-label="Toggle Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              transition: 'background 0.2s ease',
              touchAction: 'manipulation'
            }}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ═══ Full-Screen Glassmorphic Mobile Navigation Drawer ═══ */}
      <AnimatePresence>
        {isMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '85%',
                maxWidth: '360px',
                background: '#0e0e0e',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {/* Drawer Header */}
              <div style={{
                padding: '24px 20px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: appAccent }} />
                  <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff' }}>
                    {appName || 'Vibe Network'}
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* User Profile Card in Drawer */}
              {user ? (
                <div style={{
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.03)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                    {userAvatar ? (
                      <img src={userAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setUserAvatar(null)} />
                    ) : (
                      <span style={{ color: '#000', fontWeight: 'bold', fontSize: '15px' }}>{user.email?.[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLoginClick();
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      background: appAccent,
                      color: '#fff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '14px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: `0 4px 16px ${appAccent}44`
                    }}
                  >
                    <User size={18} /> Sign In / Create Channel
                  </button>
                </div>
              )}

              {/* Navigation Links */}
              <div style={{ flex: 1, padding: '16px 12px' }}>
                {showBackToVibe && (
                  <div
                    onClick={() => handleNavClick('parent')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      background: 'rgba(211, 84, 0, 0.12)',
                      border: '1px solid rgba(211, 84, 0, 0.3)',
                      color: appAccent,
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      marginBottom: '12px'
                    }}
                  >
                    <ArrowLeft size={18} /> {parentName && parentName !== 'VIBE NETWORK' ? `Return to ${parentName}` : 'Return to Vibe'}
                  </div>
                )}

                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', padding: '8px 12px' }}>
                  Explore Platform
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {navLinks.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleNavClick(item.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '13px 16px',
                        borderRadius: '10px',
                        background: location.pathname === item.path ? 'rgba(255,255,255,0.08)' : 'transparent',
                        border: 'none',
                        color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.75)',
                        fontSize: '15px',
                        fontWeight: 600,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        width: '100%'
                      }}
                    >
                      <span style={{ color: location.pathname === item.path ? appAccent : 'rgba(255,255,255,0.5)' }}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* User Channels & Settings */}
                {user && (
                  <>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', padding: '8px 12px' }}>
                      Channel & Studio
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {isUserAdmin && onAdminClick && (
                        <button
                          type="button"
                          onClick={() => { setIsMenuOpen(false); onAdminClick(); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '13px 16px',
                            borderRadius: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'left'
                          }}
                        >
                          <Settings size={18} color={appAccent} /> Business Dashboard
                        </button>
                      )}

                      <Link
                        to={`/profile${window.location.search}`}
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '13px 16px',
                          borderRadius: '10px',
                          color: 'rgba(255,255,255,0.85)',
                          textDecoration: 'none',
                          fontSize: '15px',
                          fontWeight: 600
                        }}
                      >
                        <User size={18} color="rgba(255,255,255,0.6)" /> My Channel
                      </Link>

                      <Link
                        to={`/profile${window.location.search}${window.location.search ? '&' : '?'}tab=wallet`}
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '13px 16px',
                          borderRadius: '10px',
                          color: 'rgba(255,255,255,0.85)',
                          textDecoration: 'none',
                          fontSize: '15px',
                          fontWeight: 600
                        }}
                      >
                        <Wallet size={18} color="rgba(255,255,255,0.6)" /> Vibe Wallet
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer with Disconnect */}
              {user && (
                <div style={{
                  padding: '16px 20px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(0,0,0,0.3)'
                }}>
                  <button
                    type="button"
                    onClick={async () => {
                      await supabase?.auth?.signOut();
                      window.location.reload();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'rgba(255,68,68,0.1)',
                      border: '1px solid rgba(255,68,68,0.25)',
                      color: '#ff6b6b',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={16} /> Disconnect
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
