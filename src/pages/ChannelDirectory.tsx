import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, User, ShieldCheck, Filter, ArrowRight, ExternalLink, X, Radio } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { AVO_COLLEGE_NETWORKS } from '../lib/n2n';
import { isWlDeactivated } from '../api';

export interface DirectoryItem {
  id: string;
  name: string;
  username?: string;
  type: 'network' | 'creator';
  category: 'all' | 'network' | 'creator' | 'college' | 'fitness' | 'comedy' | 'faith' | 'general';
  avatar: string;
  banner?: string;
  bio: string;
  parentNetworkName?: string;
  linkUrl: string;
  accent?: string;
  role?: string;
  verified?: boolean;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Channels & Networks' },
  { id: 'network', label: '🌐 Networks' },
  { id: 'creator', label: '🎙️ Channels' },
  { id: 'college', label: '🎓 College NIL' },
  { id: 'fitness', label: '💪 Fitness & Olympia' },
  { id: 'comedy', label: '🎤 Comedy' },
  { id: 'faith', label: '✝️ Faith & Inspiration' }
];

export default function ChannelDirectory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { wlConfig } = useWhiteLabel();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) setSearchQuery(q);
    const cat = searchParams.get('category');
    if (cat && cat !== selectedCategory) setSelectedCategory(cat);
  }, [searchParams]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('q', val);
    else newParams.delete('q');
    setSearchParams(newParams, { replace: true });
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId !== 'all') newParams.set('category', catId);
    else newParams.delete('category');
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    let isCancelled = false;

    const loadDirectory = async () => {
      setLoading(true);
      try {
        const [wlRes, profilesRes] = await Promise.all([
          supabase.from('whitelabel_configs').select('*'),
          supabase.from('profiles').select('id, username, full_name, avatar_url, bio, role, whitelabel_id, is_active')
        ]);

        if (isCancelled) return;

        const allItems: DirectoryItem[] = [];

        // 1. Process Networks
        const rawWls = wlRes.data || [];
        const wlMap = new Map<string, string>();
        rawWls.forEach((w: any) => wlMap.set(w.id, w.name));

        // Add verified AVO college networks if not already present
        const combinedWls = [...rawWls];
        AVO_COLLEGE_NETWORKS.forEach(col => {
          if (!combinedWls.some(w => w.id === col.id)) {
            combinedWls.push(col);
          }
        });

        combinedWls.forEach((wl: any) => {
          if (isWlDeactivated(wl)) return;
          const nameLower = (wl.name || '').toLowerCase();
          const domainLower = (wl.domain || '').toLowerCase();

          // Exclude test networks
          if (nameLower.includes('test') || nameLower.includes('bennie johnson preview') || nameLower.includes('leiloe')) {
            return;
          }

          let category: DirectoryItem['category'] = 'network';
          if (nameLower.includes('olympia') || nameLower.includes('muscle') || nameLower.includes('fitness') || nameLower.includes('wings')) {
            category = 'fitness';
          } else if (nameLower.includes('courtney') || domainLower.includes('courtney')) {
            category = 'comedy';
          } else if (nameLower.includes('kple') || nameLower.includes('revival') || nameLower.includes('christian')) {
            category = 'faith';
          } else if (wl.parent_network_id === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7' || domainLower.includes('shopavo.la') || nameLower.includes('avo')) {
            category = 'college';
          }

          const parentName = wl.parent_network_id ? (wlMap.get(wl.parent_network_id) || (wl.parent_network_id === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7' ? 'AVO Network' : 'Network')) : undefined;

          allItems.push({
            id: wl.id,
            name: wl.name || 'Unnamed Network',
            username: wl.domain || undefined,
            type: 'network',
            category,
            avatar: wl.logo || wl.theme?.logoImage || wl.theme?.heroImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(wl.name || 'N')}&background=111&color=fff`,
            banner: wl.heroImage || wl.theme?.heroImage || '/n2n/comedy_club_bg.jpg',
            bio: wl.theme?.heroCopy || wl.heroCopy || wl.theme?.defaultBio || 'Official Media & Culture Network.',
            parentNetworkName: parentName,
            linkUrl: `/?tenant=${wl.id}`,
            accent: wl.accent || wl.theme?.accent || '#D35400',
            verified: true
          });
        });

        // 2. Process Profiles / Creators
        const rawProfiles = profilesRes.data || [];
        rawProfiles.forEach((prof: any) => {
          if (prof.is_active === false) return;
          const uNameLower = (prof.username || '').toLowerCase();
          const fullNameLower = (prof.full_name || '').toLowerCase();

          // Exclude dummy test users
          if (uNameLower.includes('test') || fullNameLower.includes('test')) return;

          let category: DirectoryItem['category'] = 'creator';
          const parentWlName = prof.whitelabel_id ? (wlMap.get(prof.whitelabel_id) || 'Affiliate') : undefined;

          if (prof.whitelabel_id === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7' || parentWlName?.toLowerCase().includes('alabama') || parentWlName?.toLowerCase().includes('university') || parentWlName?.toLowerCase().includes('avo')) {
            category = 'college';
          } else if (uNameLower.includes('courtney') || uNameLower.includes('comedy') || uNameLower.includes('young fly') || uNameLower.includes('conceited')) {
            category = 'comedy';
          } else if (uNameLower.includes('pastor') || uNameLower.includes('rev') || uNameLower.includes('kple') || uNameLower.includes('faith') || uNameLower.includes('gospel')) {
            category = 'faith';
          } else if (uNameLower.includes('olympia') || uNameLower.includes('fit') || uNameLower.includes('muscle')) {
            category = 'fitness';
          }

          const displayName = prof.full_name || (prof.username ? prof.username.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Creator');

          allItems.push({
            id: prof.id,
            name: displayName,
            username: prof.username ? `@${prof.username}` : undefined,
            type: 'creator',
            category,
            avatar: prof.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=222&color=fff`,
            banner: '/n2n/comedy_club_bg.jpg',
            bio: prof.bio || 'Official Creator Channel on Vibe Network.',
            parentNetworkName: parentWlName,
            linkUrl: `/profile/${prof.id}`,
            role: prof.role || 'influencer',
            verified: prof.role === 'influencer' || prof.role === 'business'
          });
        });

        // 3. Inject The Real Courtney Bee spotlight creator profile if not matched
        if (!allItems.some(item => item.id === 'courtney-bee-tenant-id' || item.name.toLowerCase().includes('the real courtney bee'))) {
          allItems.unshift({
            id: 'courtney-bee-tenant-id',
            name: 'The Real Courtney Bee',
            username: '@courtneybee',
            type: 'creator',
            category: 'comedy',
            avatar: 'https://static.wixstatic.com/media/066ffc_bb9bdff854db4b56bb3f6b58ee1ce532~mv2.png/v1/crop/x_0,y_261,w_1242,h_763/fill/w_860,h_528,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/image%20(1).png',
            banner: '/n2n/comedy_club_bg.jpg',
            bio: 'Wild \'N Out star, HBO Max comedian, and host of We Playin\' Spades.',
            parentNetworkName: 'Vibe Originals',
            linkUrl: '/profile/courtney-bee-tenant-id',
            accent: '#ff4d85',
            verified: true
          });
        }

        // 4. Inject Joe VIBE creator profile if not matched
        if (!allItems.some(item => item.id === 'db7af833-2f7a-40b0-ad46-57ff8fbd4744' || item.name.toLowerCase().includes('joe vibe'))) {
          allItems.push({
            id: 'db7af833-2f7a-40b0-ad46-57ff8fbd4744',
            name: 'Joe VIBE',
            username: '@joevibe',
            type: 'creator',
            category: 'creator',
            avatar: 'https://fimzetmvrmbmdggvqzpr.supabase.co/storage/v1/object/public/images/db7af833-2f7a-40b0-ad46-57ff8fbd4744/0.11923008118112288.jpeg',
            banner: '/n2n/comedy_club_bg.jpg',
            bio: 'Welcome to the official Joe VIBE channel.',
            parentNetworkName: 'Vibe Originals',
            linkUrl: '/profile/db7af833-2f7a-40b0-ad46-57ff8fbd4744',
            accent: '#0055ff',
            verified: true
          });
        }

        // 5. Inject Rev Bennie Johnson creator profile if not matched
        if (!allItems.some(item => item.id === '8c409557-a48c-41d4-8133-9d9788aebe0d' || item.name.toLowerCase().includes('bennie'))) {
          allItems.push({
            id: '8c409557-a48c-41d4-8133-9d9788aebe0d',
            name: 'Rev Bennie Johnson',
            username: '@revbennie',
            type: 'creator',
            category: 'faith',
            avatar: 'https://fimzetmvrmbmdggvqzpr.supabase.co/storage/v1/object/public/images/whitelabel/kple_logo_1782369339776.png',
            banner: '/n2n/comedy_club_bg.jpg',
            bio: 'Welcome to the official Christian Revival Network stream.',
            parentNetworkName: 'Christian Revival Network',
            linkUrl: '/profile/8c409557-a48c-41d4-8133-9d9788aebe0d',
            accent: '#00cc88',
            verified: true
          });
        }

        setItems(allItems);
      } catch (err) {
        console.error('Failed to load channel directory:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    loadDirectory();
    return () => { isCancelled = true; };
  }, []);

  // Filtered and searched items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Category Filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'network' && item.type !== 'network') return false;
        if (selectedCategory === 'creator' && item.type !== 'creator') return false;
        if (['college', 'fitness', 'comedy', 'faith'].includes(selectedCategory) && item.category !== selectedCategory) {
          return false;
        }
      }

      // 2. Keyword Search Filter (channel = creator: if it's a channel and not a network it is a creator)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const tokens = q.split(/\s+/).filter(Boolean);

        const matchesAllTokens = tokens.every(token => {
          // If search term is "channel" or "channels", a channel = a creator (non-network)
          if (token === 'channel' || token === 'channels') {
            return item.type === 'creator' || item.name.toLowerCase().includes(token) || item.bio.toLowerCase().includes(token);
          }
          // If search term is "creator" or "creators", it matches creators
          if (token === 'creator' || token === 'creators') {
            return item.type === 'creator' || item.name.toLowerCase().includes(token) || item.bio.toLowerCase().includes(token);
          }
          // If search term is "network" or "networks", it matches networks
          if (token === 'network' || token === 'networks') {
            return item.type === 'network' || item.name.toLowerCase().includes(token) || (item.parentNetworkName || '').toLowerCase().includes(token);
          }

          const inName = item.name.toLowerCase().includes(token);
          const inUsername = (item.username || '').toLowerCase().includes(token);
          const inBio = item.bio.toLowerCase().includes(token);
          const inParent = (item.parentNetworkName || '').toLowerCase().includes(token);
          const inCategory = item.category.toLowerCase().includes(token);
          
          return inName || inUsername || inBio || inParent || inCategory;
        });

        if (!matchesAllTokens) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', color: '#fff', paddingTop: '100px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header Hero */}
        <div style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ 
            fontSize: 'clamp(32px, 5vw, 56px)', 
            fontWeight: 900, 
            letterSpacing: '-1.5px', 
            margin: '0 0 16px 0', 
            background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Channels & Networks Directory
          </h1>

          <p style={{ 
            fontSize: 'clamp(16px, 2vw, 18px)', 
            color: 'rgba(255,255,255,0.65)', 
            maxWidth: '680px', 
            lineHeight: 1.6, 
            margin: 0 
          }}>
            Explore and search all verified networks, student-athlete portals, and creator channels powered by Vibe Network.
          </p>

          {/* Search Input Bar */}
          <div style={{ 
            width: '100%', 
            maxWidth: '720px', 
            marginTop: '36px', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search 
              size={20} 
              style={{ position: 'absolute', left: '20px', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} 
            />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by channel name, creator, genre, school, or keyword..."
              style={{
                width: '100%',
                padding: '18px 52px 18px 54px',
                borderRadius: '18px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                transition: 'border-color 0.2s, background 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary, #D35400)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => handleSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '18px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px', 
            justifyContent: 'center', 
            marginTop: '24px',
            maxWidth: '900px'
          }}>
            {CATEGORY_TABS.map(tab => {
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleCategorySelect(tab.id)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '30px',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    border: active ? '1px solid var(--accent-primary, #D35400)' : '1px solid rgba(255,255,255,0.1)',
                    background: active ? 'var(--accent-primary, #D35400)' : 'rgba(255,255,255,0.04)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: active ? '0 4px 15px rgba(211, 84, 0, 0.4)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = '#fff';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                    }
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Stats / Count Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '14px 20px', 
          background: 'rgba(255,255,255,0.02)', 
          borderRadius: '12px', 
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: '32px',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.6)'
        }}>
          <div>
            Showing <strong style={{ color: '#fff' }}>{filteredItems.length}</strong> {selectedCategory === 'network' ? 'network' : selectedCategory === 'creator' ? 'channel' : 'channel and network'}{filteredItems.length === 1 ? '' : 's'}
          </div>
          {searchQuery && (
            <div>
              Search filter: <span style={{ color: 'var(--accent-primary, #D35400)', fontWeight: 600 }}>"{searchQuery}"</span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary, #D35400)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            Loading channel directory...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '80px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>
              <Search size={32} />
            </div>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>No channels found</h3>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', maxWidth: '440px', lineHeight: 1.6 }}>
              We couldn't find any channels or networks matching "{searchQuery}". Try searching by another keyword or resetting the category filter.
            </p>
            <button
              onClick={() => { handleSearchChange(''); handleCategorySelect('all'); }}
              style={{
                marginTop: '12px',
                padding: '10px 24px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Directory Card Grid */}
        {!loading && filteredItems.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '24px'
          }}>
            {filteredItems.map(item => {
              const isNetwork = item.type === 'network';
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = `${item.accent || 'var(--accent-primary, #D35400)'}66`;
                    e.currentTarget.style.boxShadow = `0 12px 35px ${item.accent || 'rgba(211,84,0,0.2)'}33`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                  }}
                  onClick={() => {
                    if (item.linkUrl.startsWith('http')) {
                      window.open(item.linkUrl, '_blank');
                    } else {
                      navigate(item.linkUrl);
                    }
                  }}
                >
                  {/* Card Banner */}
                  <div style={{
                    height: '110px',
                    width: '100%',
                    position: 'relative',
                    background: item.banner ? `url(${item.banner})` : '#18181c',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.65)'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(180deg, transparent 0%, rgba(10,10,12,0.95) 100%)`
                    }} />
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
                    
                    {/* Floating Avatar & Badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-36px', marginBottom: '14px', zIndex: 2 }}>
                      <div style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: isNetwork ? '16px' : '50%',
                        border: '3px solid #0a0a0c',
                        overflow: 'hidden',
                        background: '#151518',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        flexShrink: 0
                      }}>
                        <img 
                          src={item.avatar} 
                          alt={item.name}
                          onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=111&color=fff`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: isNetwork ? 'rgba(59, 130, 246, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                          border: isNetwork ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(236, 72, 153, 0.4)',
                          color: isNetwork ? '#60a5fa' : '#f472b6',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {isNetwork ? <Globe size={11} /> : <User size={11} />}
                          {isNetwork ? 'Network' : 'Channel'}
                        </span>

                        {item.parentNetworkName && (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.7)'
                          }}>
                            {item.parentNetworkName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name & Handle */}
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                          {item.name}
                        </h4>
                        {item.verified && (
                          <ShieldCheck size={16} color="var(--accent-primary, #D35400)" />
                        )}
                      </div>
                      {item.username && (
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '2px', fontWeight: 500 }}>
                          {item.username}
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    <p style={{
                      margin: '0 0 16px 0',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.65)',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1
                    }}>
                      {item.bio}
                    </p>

                    {/* Footer Button */}
                    <div style={{
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: item.accent || 'var(--accent-primary, #D35400)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isNetwork ? 'Visit Network' : 'Enter Channel'}
                        <ArrowRight size={14} />
                      </span>
                      <ExternalLink size={14} color="rgba(255,255,255,0.3)" />
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
