import React from 'react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';

interface FooterProps {
  showContactInfo?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showContactInfo = false }) => {
  const { wlConfig } = useWhiteLabel();
  const platformName = wlConfig?.name || 'Vibe Network';
  const year = new Date().getFullYear();

  return (
    <footer style={{
      width: '100%',
      padding: '40px 20px',
      background: '#000',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      marginTop: 'auto',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to={`/terms${window.location.search}`} style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#888'}>
          Terms of Service
        </Link>
        <Link to={`/privacy${window.location.search}`} style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#888'}>
          Privacy Policy
        </Link>
        <Link to={`/contact${window.location.search}`} style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#888'}>
          Contact Support
        </Link>
        <Link to={`/admin-login${window.location.search}`} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='rgba(255,255,255,0.4)'}>
          Admin Portal
        </Link>
      </div>

      {showContactInfo && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px 24px',
          color: 'rgba(255,255,255,0.55)',
          fontSize: '13px',
          textAlign: 'center',
          padding: '4px 16px'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} style={{ color: 'var(--accent-primary, #D35400)', flexShrink: 0 }} />
            <span>10161 W Park Run Dr, Suite 150, Las Vegas, NV 89145</span>
          </div>
          <a
            href="tel:7025752633"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.55)',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.color = '#fff'}
            onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
          >
            <Phone size={14} style={{ color: 'var(--accent-primary, #D35400)', flexShrink: 0 }} />
            <span>Phone: 702-575-2633</span>
          </a>
        </div>
      )}

      <div 
        className="px-mobile-sm" 
        style={{ 
          width: '100%', 
          maxWidth: '1400px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          color: 'rgba(255,255,255,0.3)', 
          fontSize: '12px',
          padding: '0 40px',
          flexWrap: 'wrap',
          gap: '12px',
          textAlign: 'center'
        }}
      >
        <div style={{ flex: '1 1 auto', textAlign: 'inherit' }}>
          &copy; {year} {platformName}. All rights reserved.
        </div>
        <div style={{ flex: '1 1 auto', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, textAlign: 'inherit' }}>
          Powered By: <span style={{ color: 'rgba(255,255,255,0.5)' }}>VIBE NETWORK</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
