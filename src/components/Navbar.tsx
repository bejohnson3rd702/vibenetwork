import React, { useState, useEffect } from 'react';
import { Search, User, Menu, Lightbulb, Wallet, Settings, LogOut } from 'lucide-react';
import { ASSETS } from '../data';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useWhiteLabel } from '../context/WhiteLabelContext';

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
  const appName = wlConfig?.name || '';
  const appAccent = wlConfig?.accent || '';
  const appLogo = wlConfig?.logoImage || '';

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="px-mobile-sm gap-mobile-sm" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '24px 60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100,
      background: scrolled ? '#000000' : 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      transition: 'all 0.4s ease'
    }}>
      <div className="gap-mobile-sm" style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
        <Link to={`/${window.location.search}`} style={{ textDecoration: 'none' }}>
          {appLogo ? (
            <img src={appLogo} alt={appName} style={{ height: '36px', objectFit: 'contain', cursor: 'pointer', borderRadius: '4px' }} />
          ) : appName ? (
            <h1 style={{ margin: 0, fontSize: '24px', color: appAccent || '#fff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>{appName}</h1>
          ) : (
            <img 
              src={ASSETS.logo} 
              alt="The Vibe Network" 
              style={{ height: '36px', objectFit: 'contain', cursor: 'pointer' }} 
            />
          )}
        </Link>
        
        <ul className="hide-on-mobile" style={{ 
          display: 'flex', 
          listStyle: 'none', 
          gap: '32px',
          margin: 0,
          padding: 0,
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {[
            { label: 'Home', path: '/' },
            { label: 'Marketplace', path: '/marketplace' },
            { label: 'About Us', path: '/about' },
            { label: 'Watch Live', path: '/#whats-on-now' },
            { label: 'Contact', path: '/contact' }
          ].map((item, i) => (
            <li key={item.label} style={{ 
              cursor: 'pointer',
              color: i === 0 ? 'white' : 'rgba(255,255,255,0.6)',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'white'}
            onMouseOut={(e) => e.currentTarget.style.color = i === 0 ? 'white' : 'rgba(255,255,255,0.6)'}
            onClick={() => {
               if (item.path.startsWith('/#')) {
                   navigate('/');
                   setTimeout(() => {
                       document.getElementById(item.path.substring(2))?.scrollIntoView({ behavior: 'smooth' });
                   }, 100);
               } else {
                   navigate(item.path);
               }
            }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
          <Search size={20} color={appAccent || "white"} style={{ cursor: 'pointer' }} onClick={() => alert('Global Search & Discovery Engine coming in v2.0!')} />
        </div>
        <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {(user?.email?.includes('admin') || user?.email === 'bennie@level2network.com' || user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'business') && onAdminClick && (
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
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#000', fontWeight: 'bold' }}>{user.email?.[0].toUpperCase()}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '12px', color: 'white', letterSpacing: '1px' }}>
                  Profile
                </span>
              </Link>
            </div>
          ) : (
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onLoginClick}>
              <User size={20} color="white" />
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Log In</span>
            </div>
          )}
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '12px', position: 'relative' }}>
            <Menu size={24} color="white" cursor="pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
            
            {isMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '24px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ padding: '8px 16px', color: '#888', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                   System Options
                </div>
                
                <>
                  <Link to={`/profile${window.location.search}${window.location.search ? '&' : '?'}tab=wallet`} onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#fff', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                    <Wallet size={16} /> Digital Wallet
                  </Link>

                  <Link to={`/profile${window.location.search}`} onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#fff', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                    <Settings size={16} /> Account Settings
                  </Link>
                  
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

                  <div onClick={async () => { await supabase?.auth?.signOut(); window.location.reload(); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#ff4444', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,68,68,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                    <LogOut size={16} /> Disconnect
                  </div>
                </>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
