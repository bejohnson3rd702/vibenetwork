import React, { useState, useEffect } from 'react';
import { Search, User, Menu, Moon, Sun } from 'lucide-react';
import { ASSETS } from '../data';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: any;
  onLoginClick: () => void;
  wlConfig?: any;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, wlConfig }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [appName, setAppName] = useState('');
  const [appAccent, setAppAccent] = useState('');
  const [appLogo, setAppLogo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleWhiteLabel = (e: any) => {
      if (e.detail.name) setAppName(e.detail.name);
      if (e.detail.accent) setAppAccent(e.detail.accent);
      if (e.detail.logo) setAppLogo(e.detail.logo);
    };
    window.addEventListener('whitelabel_update', handleWhiteLabel);
    return () => window.removeEventListener('whitelabel_update', handleWhiteLabel);
  }, []);

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
    <nav style={{
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          {(wlConfig?.logoImage || appLogo) ? (
            <img src={wlConfig?.logoImage || appLogo} alt={wlConfig?.name || appName} style={{ height: '36px', objectFit: 'contain', cursor: 'pointer', borderRadius: '4px' }} />
          ) : (wlConfig?.name || appName) ? (
            <h1 style={{ margin: 0, fontSize: '24px', color: wlConfig?.accent || appAccent || '#fff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>{wlConfig?.name || appName}</h1>
          ) : (
            <img 
              src={ASSETS.logo} 
              alt="The Vibe Network" 
              style={{ height: '36px', objectFit: 'contain', cursor: 'pointer' }} 
            />
          )}
        </Link>
        
        <ul style={{ 
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
          {['Home', 'About Us', 'Video On Demand', 'Watch Live', 'Contact'].map((item, i) => (
            <li key={item} style={{ 
              cursor: 'pointer',
              color: i === 0 ? 'white' : 'rgba(255,255,255,0.6)',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'white'}
            onMouseOut={(e) => e.currentTarget.style.color = i === 0 ? 'white' : 'rgba(255,255,255,0.6)'}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Search size={20} color={appAccent || "white"} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px' }}>
          {user ? (
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#000', fontWeight: 'bold' }}>{user.email?.[0].toUpperCase()}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '12px', color: 'white', letterSpacing: '1px' }}>
                Profile
              </span>
            </Link>
          ) : (
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onLoginClick}>
              <User size={20} color="white" />
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Log In</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '12px', position: 'relative' }}>
          <Menu size={24} color="white" cursor="pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
          
          {isMenuOpen && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '24px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              
              <button 
                onClick={toggleTheme}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', padding: '14px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: 'bold', fontSize: '14px', width: '100%', transition: '0.2s', justifyContent: 'flex-start' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                {theme === 'dark' ? <Sun size={18} color="#FFD700" /> : <Moon size={18} color="#a3a3a3" />}
                Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </button>
              
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
