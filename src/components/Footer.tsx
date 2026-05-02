import React from 'react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { wlConfig } = useWhiteLabel();
  const platformName = wlConfig?.name || 'Vibe Network';
  const year = new Date().getFullYear();

  return (
    <footer style={{
      width: '100%',
      padding: '40px 20px',
      background: 'rgba(0,0,0,0.5)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      marginTop: 'auto',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to={`/terms${window.location.search}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
          Terms of Service
        </Link>
        <Link to={`/privacy${window.location.search}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
          Privacy Policy
        </Link>
        <Link to={`/contact${window.location.search}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
          Contact Support
        </Link>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textAlign: 'center' }}>
        &copy; {year} {platformName}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
