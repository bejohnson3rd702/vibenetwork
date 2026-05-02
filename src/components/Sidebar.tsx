import React from 'react';
import { Home, Compass, Radio, Users, Settings, LogIn, MonitorPlay } from 'lucide-react';
import { ASSETS } from '../data';

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Home', icon: <Home size={24} /> },
    { name: 'Discover', icon: <Compass size={24} /> },
    { name: 'Live TV', icon: <MonitorPlay size={24} /> },
    { name: 'Podcasts', icon: <Radio size={24} /> },
    { name: 'Artists', icon: <Users size={24} /> },
  ];

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'var(--bg-color)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      padding: '30px 20px',
      zIndex: 1000
    }}>
      <div style={{ marginBottom: '60px', paddingLeft: '12px' }}>
        <img src={ASSETS.logo} alt="Vibe Network" style={{ width: '140px' }} />
      </div>

      <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', marginBottom: '16px', paddingLeft: '12px', textTransform: 'uppercase' }}>
        Menu
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item, index) => (
          <div key={item.name} className="sidebar-link" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px',
            borderRadius: '12px',
            cursor: 'pointer',
            color: index === 0 ? 'white' : 'var(--text-secondary)',
            background: index === 0 ? 'rgba(255,255,255,0.1)' : 'transparent',
            fontWeight: index === 0 ? 600 : 500,
            transition: 'all 0.2s ease'
          }}>
            <div style={{ color: index === 0 ? 'var(--accent-primary)' : 'inherit' }}>
              {item.icon}
            </div>
            <span style={{ fontSize: '15px' }}>{item.name}</span>
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s ease' }}>
          <Settings size={22} />
          <span style={{ fontSize: '15px' }}>Settings</span>
        </div>
        <div className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s ease' }}>
          <LogIn size={22} />
          <span style={{ fontSize: '15px' }}>Sign In</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
