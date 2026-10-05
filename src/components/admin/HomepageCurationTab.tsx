import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Globe, User, Check, ArrowUp, ArrowDown, Save, Eye, Sparkles, RefreshCw } from 'lucide-react';
import { MASTER_DOMAIN } from '../../constants';

interface HomepageCurationTabProps {
  isMobile: boolean;
  whitelabelsList: any[];
  usersList: any[];
  supabase: any;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  logSystemEvent: (level: string, message: string, meta?: any) => void;
}

export const HomepageCurationTab: React.FC<HomepageCurationTabProps> = ({
  isMobile,
  whitelabelsList,
  usersList,
  supabase,
  showToast,
  logSystemEvent,
}) => {
  const masterWl = whitelabelsList.find(wl => 
    wl.id === 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' || 
    wl.id === 'master' || 
    wl.domain === MASTER_DOMAIN || 
    wl.domain === 'vibenetwork.tv' || 
    wl.domain === 'vibenetwork.com'
  );

  const [featuredNetworks, setFeaturedNetworks] = useState<string[]>([]);
  const [featuredChannels, setFeaturedChannels] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'networks' | 'channels'>('networks');

  // Load existing curation on mount
  useEffect(() => {
    let savedNets: string[] = [];
    let savedChannels: string[] = [];

    // Try master config first
    if (masterWl?.theme?.homepage_featured_networks) {
      savedNets = masterWl.theme.homepage_featured_networks;
    }
    if (masterWl?.theme?.homepage_featured_channels) {
      savedChannels = masterWl.theme.homepage_featured_channels;
    }

    // Try localStorage fallback
    if (savedNets.length === 0) {
      try {
        const local = JSON.parse(localStorage.getItem('vibe_homepage_featured_networks') || '[]');
        if (Array.isArray(local) && local.length > 0) savedNets = local;
      } catch {}
    }
    if (savedChannels.length === 0) {
      try {
        const local = JSON.parse(localStorage.getItem('vibe_homepage_featured_channels') || '[]');
        if (Array.isArray(local) && local.length > 0) savedChannels = local;
      } catch {}
    }

    // Default defaults if nothing set yet
    if (savedNets.length === 0) {
      savedNets = [
        'b0ea0000-c08f-4260-8540-a0cc8bed4e11', // Bonaire
        'e5c100aa-c08f-4260-8540-a0cc8bed4e11', // VIBE 100
        'cb000000-c08f-4260-8540-a0cc8bed4e11', // Courtney Bee Network
        '7a017c4d-c08f-4260-8540-a0cc8bed4e11', // Mr. Olympia
        '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'  // AVO Network
      ];
    }

    if (savedChannels.length === 0) {
      savedChannels = [
        'courtney-bee-tenant-id',
        'db7af833-2f7a-40b0-ad46-57ff8fbd4744', // Joe VIBE
        '8c409557-a48c-41d4-8133-9d9788aebe0d'  // Rev Bennie
      ];
    }

    setFeaturedNetworks(savedNets);
    setFeaturedChannels(savedChannels);
  }, [masterWl]);

  // Toggle Network on/off
  const toggleNetwork = (id: string) => {
    setFeaturedNetworks(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      return [...prev, id];
    });
  };

  // Move Network position
  const moveNetwork = (id: string, direction: 'up' | 'down') => {
    setFeaturedNetworks(prev => {
      const idx = prev.indexOf(id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  // Toggle Channel on/off
  const toggleChannel = (id: string) => {
    setFeaturedChannels(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      return [...prev, id];
    });
  };

  // Move Channel position
  const moveChannel = (id: string, direction: 'up' | 'down') => {
    setFeaturedChannels(prev => {
      const idx = prev.indexOf(id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  // Save to DB and LocalStorage
  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('vibe_homepage_featured_networks', JSON.stringify(featuredNetworks));
      localStorage.setItem('vibe_homepage_featured_channels', JSON.stringify(featuredChannels));

      if (masterWl?.id) {
        const currentTheme = masterWl.theme || {};
        const updatedTheme = {
          ...currentTheme,
          homepage_featured_networks: featuredNetworks,
          homepage_featured_channels: featuredChannels
        };

        const { error } = await supabase
          .from('whitelabel_configs')
          .update({ theme: updatedTheme })
          .eq('id', masterWl.id);

        if (error) {
          console.warn('DB update failed, using localStorage cache:', error);
        }
      }

      logSystemEvent('INFO', `Homepage sliders updated: ${featuredNetworks.length} networks, ${featuredChannels.length} channels.`);
      showToast('Homepage showcase sliders saved successfully!', 'success');
    } catch (err: any) {
      console.error('Failed to save homepage curation:', err);
      showToast('Failed to save: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filter available networks (exclude inactive/test)
  const availableNetworks = (whitelabelsList || []).filter(wl => {
    const name = (wl.name || '').toLowerCase();
    return !name.includes('test') && !name.includes('preview') && !name.includes('leiloe');
  });

  // Filter available creators
  const availableCreators = (usersList || []).filter(u => {
    return u.is_active !== false && (u.role === 'influencer' || u.role === 'business' || u.username);
  });

  // Inject Courtney Bee into available creators if not present
  const allAvailableCreators = [...availableCreators];
  if (!allAvailableCreators.some(c => c.id === 'courtney-bee-tenant-id')) {
    allAvailableCreators.unshift({
      id: 'courtney-bee-tenant-id',
      username: 'courtneybee',
      full_name: 'The Real Courtney Bee',
      avatar_url: 'https://static.wixstatic.com/media/066ffc_bb9bdff854db4b56bb3f6b58ee1ce532~mv2.png/v1/crop/x_0,y_261,w_1242,h_763/fill/w_860,h_528,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/image%20(1).png',
      role: 'influencer'
    });
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={24} color="#0055ff" />
            <h3 style={{ margin: 0, fontSize: '24px' }}>Homepage Showcase Curation</h3>
          </div>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Decide exactly which networks and creator channels appear in the featured sliders on the Vibe homepage, and set their exact order.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: saving ? '#555' : 'linear-gradient(135deg, #0055ff 0%, #0088ff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '14px',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(0, 85, 255, 0.4)',
            transition: 'all 0.2s'
          }}
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Homepage Showcase'}</span>
        </button>
      </div>

      {/* Switcher Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveSection('networks')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            border: activeSection === 'networks' ? '1px solid #0055ff' : '1px solid rgba(255,255,255,0.1)',
            background: activeSection === 'networks' ? 'rgba(0, 85, 255, 0.15)' : 'rgba(255,255,255,0.03)',
            color: activeSection === 'networks' ? '#0088ff' : 'var(--text-muted)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Globe size={16} />
          <span>Networks Slider ({featuredNetworks.length} Selected)</span>
        </button>

        <button
          onClick={() => setActiveSection('channels')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            border: activeSection === 'channels' ? '1px solid #0055ff' : '1px solid rgba(255,255,255,0.1)',
            background: activeSection === 'channels' ? 'rgba(0, 85, 255, 0.15)' : 'rgba(255,255,255,0.03)',
            color: activeSection === 'channels' ? '#0088ff' : 'var(--text-muted)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <User size={16} />
          <span>Creator Channels Slider ({featuredChannels.length} Selected)</span>
        </button>
      </div>

      {/* ── NETWORKS CURATION LIST ── */}
      {activeSection === 'networks' && (
        <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Toggle networks to show or hide them on the homepage "Networks" carousel. Use the arrows to change display order.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Show Featured Networks in Order First */}
            {featuredNetworks.map((netId, orderIdx) => {
              const wl = availableNetworks.find(w => w.id === netId);
              if (!wl) return null;
              return (
                <div
                  key={netId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: 'rgba(0, 85, 255, 0.08)',
                    border: '1px solid rgba(0, 85, 255, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#0055ff',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800
                    }}>
                      #{orderIdx + 1}
                    </div>

                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#111'
                    }}>
                      <img 
                        src={wl.logo || wl.theme?.logoImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(wl.name || 'W')}`} 
                        alt={wl.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                      />
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>{wl.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{wl.domain || 'Tenant Network'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Reorder Arrows */}
                    <button
                      onClick={() => moveNetwork(netId, 'up')}
                      disabled={orderIdx === 0}
                      style={{
                        padding: '6px 10px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: orderIdx === 0 ? '#444' : '#fff',
                        cursor: orderIdx === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      onClick={() => moveNetwork(netId, 'down')}
                      disabled={orderIdx === featuredNetworks.length - 1}
                      style={{
                        padding: '6px 10px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: orderIdx === featuredNetworks.length - 1 ? '#444' : '#fff',
                        cursor: orderIdx === featuredNetworks.length - 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <ArrowDown size={14} />
                    </button>

                    {/* Remove Toggle */}
                    <button
                      onClick={() => toggleNetwork(netId)}
                      style={{
                        padding: '6px 14px',
                        background: 'rgba(255, 68, 68, 0.15)',
                        border: '1px solid rgba(255, 68, 68, 0.4)',
                        borderRadius: '8px',
                        color: '#ff4444',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Other Available Networks (Not Featured Yet) */}
            <div style={{ marginTop: '24px', marginBottom: '12px', fontSize: '14px', fontWeight: 800, color: 'var(--text-muted)' }}>
              Available Networks to Feature:
            </div>

            {availableNetworks.filter(wl => !featuredNetworks.includes(wl.id)).map(wl => (
              <div
                key={wl.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#111'
                  }}>
                    <img 
                      src={wl.logo || wl.theme?.logoImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(wl.name || 'W')}`} 
                      alt={wl.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{wl.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{wl.domain || 'Tenant Network'}</div>
                  </div>
                </div>

                <button
                  onClick={() => toggleNetwork(wl.id)}
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(0, 85, 255, 0.1)',
                    border: '1px solid rgba(0, 85, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#0088ff',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  + Add to Showcase
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHANNELS CURATION LIST ── */}
      {activeSection === 'channels' && (
        <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Toggle creator channels to feature on the homepage "Creator Channels" carousel. Use the arrows to set their order.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Show Featured Channels in Order First */}
            {featuredChannels.map((channelId, orderIdx) => {
              const creator = allAvailableCreators.find(c => c.id === channelId);
              if (!creator) return null;
              const name = creator.full_name || creator.username || 'Creator';
              return (
                <div
                  key={channelId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: 'rgba(0, 85, 255, 0.08)',
                    border: '1px solid rgba(0, 85, 255, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#0055ff',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800
                    }}>
                      #{orderIdx + 1}
                    </div>

                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: '#111'
                    }}>
                      <img 
                        src={creator.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`} 
                        alt={name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>{name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{creator.username ? `@${creator.username}` : 'Creator Channel'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Reorder Arrows */}
                    <button
                      onClick={() => moveChannel(channelId, 'up')}
                      disabled={orderIdx === 0}
                      style={{
                        padding: '6px 10px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: orderIdx === 0 ? '#444' : '#fff',
                        cursor: orderIdx === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      onClick={() => moveChannel(channelId, 'down')}
                      disabled={orderIdx === featuredChannels.length - 1}
                      style={{
                        padding: '6px 10px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: orderIdx === featuredChannels.length - 1 ? '#444' : '#fff',
                        cursor: orderIdx === featuredChannels.length - 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <ArrowDown size={14} />
                    </button>

                    {/* Remove Toggle */}
                    <button
                      onClick={() => toggleChannel(channelId)}
                      style={{
                        padding: '6px 14px',
                        background: 'rgba(255, 68, 68, 0.15)',
                        border: '1px solid rgba(255, 68, 68, 0.4)',
                        borderRadius: '8px',
                        color: '#ff4444',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Other Available Channels */}
            <div style={{ marginTop: '24px', marginBottom: '12px', fontSize: '14px', fontWeight: 800, color: 'var(--text-muted)' }}>
              Available Channels to Feature:
            </div>

            {allAvailableCreators.filter(c => !featuredChannels.includes(c.id)).map(c => {
              const name = c.full_name || c.username || 'Creator';
              return (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: '#111'
                    }}>
                      <img 
                        src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`} 
                        alt={name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.username ? `@${c.username}` : 'Creator Channel'}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleChannel(c.id)}
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(0, 85, 255, 0.1)',
                      border: '1px solid rgba(0, 85, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#0088ff',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add to Showcase
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};
