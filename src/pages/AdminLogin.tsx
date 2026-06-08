import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldAlert, Mail, Lock, Loader, ArrowRight, Home, Globe, Palette, Type, Check, CheckCircle2 } from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { createChildNetwork } from '../lib/n2n';

export default function AdminLogin() {
  const { wlConfig } = useWhiteLabel();
  const toast = useToast();

  const [step, setStep] = useState<'login' | 'spawn' | 'success'>('login');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Spawner Form State
  const [templates, setTemplates] = useState<any[]>([]);
  const [parentNetworks, setParentNetworks] = useState<any[]>([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [selectedParentName, setSelectedParentName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [newNetworkName, setNewNetworkName] = useState('');
  const [newNetworkDomain, setNewNetworkDomain] = useState('');
  const [newNetworkAccent, setNewNetworkAccent] = useState('#FF2A54');
  const [newHeroCopy, setNewHeroCopy] = useState('');
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [createdNetworkId, setCreatedNetworkId] = useState('');

  // Styling
  const accentColor = wlConfig?.accent || '#FF2A54';

  // Parent Creation states
  const [showNewParentForm, setShowNewParentForm] = useState(false);
  const [newParentName, setNewParentName] = useState('');
  const [newParentDomain, setNewParentDomain] = useState('');
  const [newParentAccent, setNewParentAccent] = useState('#FF2A54');
  const [creatingParent, setCreatingParent] = useState(false);

  const handleCreateParent = async () => {
    const parentNameTrimmed = newParentName.trim();
    if (!parentNameTrimmed) {
      toast.error('Parent name is required.');
      return;
    }
    setCreatingParent(true);
    try {
      const payload = {
        owner_id: currentUser.id,
        name: parentNameTrimmed,
        domain: newParentDomain.trim() || `${parentNameTrimmed.toLowerCase().replace(/[^a-z0-9]/g, '')}.vibenetwork.tv`,
        n2n_enabled: true,
        platform_fee_percentage: 15,
        theme: {
          accent: newParentAccent,
          heroCopy: `Welcome to ${parentNameTrimmed}`,
          n2n_enabled: true,
          enableWatchLive: true,
          enableBooking: false,
          heroLayoutMode: 'verbiage',
          sliderCount: 4
        }
      };

      const { data, error } = await supabase!
        .from('whitelabel_configs')
        .insert(payload)
        .select()
        .single();

      let finalData = data;
      if (error) {
        console.warn('Fallback insert parent network');
        delete payload.n2n_enabled;
        const { data: fallbackData, error: fallbackError } = await supabase!
          .from('whitelabel_configs')
          .insert(payload)
          .select()
          .single();
        if (fallbackError) throw fallbackError;
        finalData = fallbackData;
      }

      toast.success(`Parent Network "${parentNameTrimmed}" deployed!`);
      
      if (finalData) {
        setParentNetworks(prev => [...prev, finalData]);
        setSelectedParentId(finalData.id);
      }
      
      setNewParentName('');
      setNewParentDomain('');
      setShowNewParentForm(false);

    } catch (e: any) {
      toast.error('Failed to create parent network: ' + e.message);
    } finally {
      setCreatingParent(false);
    }
  };

  // Fetch templates and parent networks for spawning
  const loadSpawnerData = async (userProfile: any) => {
    try {
      // Get all templates (top-level whitelabels)
      const { data: wlList } = await supabase!
        .from('whitelabel_configs')
        .select('*');

      if (wlList) {
        // Templates are top-level networks
        const templatesList = wlList.filter((wl: any) => !wl.parent_network_id && !wl.theme?.parent_network_id);
        setTemplates(templatesList);
        if (templatesList.length > 0) {
          setSelectedTemplateId(templatesList[0].id);
        }

        // Determine parent network options
        const isMaster = userProfile?.is_admin === true || userProfile?.role === 'admin';
        if (isMaster) {
          // Master admin can choose any parent network with N2N enabled
          const parents = wlList.filter((wl: any) => wl.n2n_enabled === true || wl.theme?.n2n_enabled === true);
          setParentNetworks(parents);
          if (parents.length > 0) {
            setSelectedParentId(parents[0].id);
          }
        } else {
          // Employee: parent is locked to their profile's whitelabel_id
          const employeeParentId = userProfile?.whitelabel_id;
          if (employeeParentId) {
            const parentRecord = wlList.find((wl: any) => wl.id === employeeParentId);
            if (parentRecord) {
              setSelectedParentId(parentRecord.id);
              setSelectedParentName(parentRecord.name);
            } else {
              // Fallback default parent if profile has id but record not found
              setSelectedParentId(employeeParentId);
              setSelectedParentName('Assigned Parent Network');
            }
          } else {
             // Fallback to AVO parent
             setSelectedParentId('3915f1e5-4c79-4b2a-ad41-7029ce8052d7');
             setSelectedParentName('AVO Network');
          }
        }
      }
    } catch (e) {
      console.error('Failed to load spawner templates', e);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Sign in with password
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error('Failed to retrieve user session.');

      // 2. Fetch user profile
      const { data: profile, error: profileError } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Failed to load user profile details.');
      }

      setCurrentUser(user);
      setCurrentUserProfile(profile);
      toast.success('Authentication successful!');

      // Load spawning data and advance step
      await loadSpawnerData(profile);
      setStep('spawn');

    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      toast.error('Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeployNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNetworkName.trim()) {
      toast.error('Network name is required.');
      return;
    }

    setLoading(true);
    try {
      const parentId = selectedParentId;
      if (!parentId) {
        throw new Error('No parent N2N network selected or mapped.');
      }

      const config = {
        name: newNetworkName.trim(),
        domain: newNetworkDomain.trim() || `${newNetworkName.toLowerCase().replace(/[^a-z0-9]/g, '')}.vibenetwork.tv`,
        accent: newNetworkAccent,
        heroCopy: newHeroCopy.trim() || `Welcome to ${newNetworkName.trim()}`,
        templateId: selectedTemplateId || undefined
      };

      const spawned = await createChildNetwork(parentId, config, currentUser.id);

      if (!spawned) {
        throw new Error('Deployment failed. Database constraints or permission error.');
      }

      // Copy auth token to maintain logged-in state on the child network
      let token = localStorage.getItem('sb-vibe-master-auth-token');
      if (!token) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.includes('auth-token')) {
            token = localStorage.getItem(key);
            break;
          }
        }
      }
      if (token) {
        localStorage.setItem(`sb-${spawned.id}-auth-token`, token);
      }

      setCreatedNetworkId(spawned.id);
      setStep('success');
      toast.success(`${config.name} deployed successfully!`);

    } catch (err: any) {
      toast.error(err.message || 'Failed to deploy child network.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    padding: '14px 16px',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: '8px',
    letterSpacing: '1px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #150508 0%, #050102 100%)',
      padding: '20px',
      color: '#fff',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <motion.div
        layout
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: step === 'spawn' ? '560px' : '440px',
          background: 'rgba(10, 5, 6, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: `1px solid ${accentColor}33`,
          boxShadow: `0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${accentColor}11`,
          overflow: 'hidden',
          padding: '40px'
        }}
      >
        <AnimatePresence mode="wait">
          {/* STEP 1: LOGIN */}
          {step === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Warning Header */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{
                  background: `rgba(255, 42, 84, 0.08)`,
                  border: `1px solid ${accentColor}88`,
                  borderRadius: '50%',
                  padding: '16px',
                  boxShadow: `0 0 20px ${accentColor}22`
                }}>
                  <ShieldAlert size={40} color={accentColor} />
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: `rgba(255, 42, 84, 0.1)`,
                  border: `1px solid ${accentColor}44`,
                  fontSize: '11px',
                  fontWeight: 800,
                  color: accentColor,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: '12px'
                }}>
                  Restricted Portal
                </div>
                <h2 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  4 Admins Only
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Log in to configure, alter, and spawn N2N child networks using predefined brand templates.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {errorMsg && (
                  <div style={{ background: 'rgba(255, 42, 84, 0.1)', color: '#FF2A54', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', border: '1px solid rgba(255, 42, 84, 0.25)', fontWeight: 600, textAlign: 'center' }}>
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Admins Credentials</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={20} color="rgba(255, 255, 255, 0.3)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="admin@vibenetwork.tv"
                      style={{ ...inputStyle, paddingLeft: '48px' }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} color="rgba(255, 255, 255, 0.3)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      style={{ ...inputStyle, paddingLeft: '48px' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: accentColor,
                    color: '#fff',
                    padding: '16px',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '16px',
                    fontWeight: 800,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: `0 8px 25px ${accentColor}33`,
                    marginTop: '12px'
                  }}
                >
                  {loading ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Authenticate'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: SPAWN FROM TEMPLATE */}
          {step === 'spawn' && (
            <motion.div
              key="spawn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-1px', margin: '0 0 6px 0', color: '#fff' }}>
                  Deploy Network Spawner
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', margin: 0 }}>
                  Altering template config to deploy a child network for {currentUserProfile?.full_name || currentUserProfile?.username || 'employee'}.
                </p>
              </div>

              <form onSubmit={handleDeployNetwork} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Parent Network Mapping */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Parent N2N Network</label>
                    <button
                      type="button"
                      onClick={() => setShowNewParentForm(prev => !prev)}
                      style={{ background: 'none', border: 'none', color: accentColor, fontSize: '11px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                    >
                      {showNewParentForm ? 'Hide Setup' : '+ Create New Parent'}
                    </button>
                  </div>

                  {showNewParentForm ? (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginBottom: '14px'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Create Parent Network on the Fly
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ ...labelStyle, fontSize: '10px' }}>Parent Name</label>
                          <input
                            type="text"
                            value={newParentName}
                            onChange={e => {
                              setNewParentName(e.target.value);
                              setNewParentDomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') + '.vibenetwork.tv');
                            }}
                            placeholder="e.g. AVO Network"
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={{ ...labelStyle, fontSize: '10px' }}>Domain Routing</label>
                          <input
                            type="text"
                            value={newParentDomain}
                            onChange={e => setNewParentDomain(e.target.value)}
                            placeholder="e.g. avo.vibenetwork.tv"
                            style={inputStyle}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ ...labelStyle, fontSize: '10px', marginBottom: 0 }}>Accent Color:</label>
                        <input
                          type="color"
                          value={newParentAccent}
                          onChange={e => setNewParentAccent(e.target.value)}
                          style={{ width: '36px', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                        />
                        <button
                          type="button"
                          onClick={handleCreateParent}
                          disabled={creatingParent}
                          style={{
                            marginLeft: 'auto',
                            padding: '8px 16px',
                            background: accentColor,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          {creatingParent ? 'Deploying...' : 'Deploy Parent'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    parentNetworks.length > 0 ? (
                      <select
                        value={selectedParentId}
                        onChange={e => setSelectedParentId(e.target.value)}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                      >
                        {parentNetworks.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div style={{ ...inputStyle, background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                        {selectedParentName}
                      </div>
                    )
                  )}
                </div>

                {/* Template Selection */}
                <div>
                  <label style={labelStyle}>Choose N2N Brand Template</label>
                  <select
                    value={selectedTemplateId}
                    onChange={e => setSelectedTemplateId(e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subdomain / Routing */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Network Name</label>
                    <input
                      type="text"
                      value={newNetworkName}
                      onChange={e => {
                        setNewNetworkName(e.target.value);
                        setNewNetworkDomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') + '.vibenetwork.tv');
                      }}
                      required
                      placeholder="e.g. Marcus Vlogs"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Subdomain Routing</label>
                    <input
                      type="text"
                      value={newNetworkDomain}
                      onChange={e => setNewNetworkDomain(e.target.value)}
                      required
                      placeholder="e.g. marcus.vibenetwork.tv"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Accent and Hero Copy styling */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <label style={labelStyle}>Accent Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={newNetworkAccent}
                        onChange={e => setNewNetworkAccent(e.target.value)}
                        style={{ width: '42px', height: '42px', border: 'none', borderRadius: '10px', background: 'transparent', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{newNetworkAccent}</span>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Homepage Billboard Header</label>
                    <input
                      type="text"
                      value={newHeroCopy}
                      onChange={e => setNewHeroCopy(e.target.value)}
                      placeholder="e.g. Marcus Vlogs — Live Broadcasts"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Deploy Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: accentColor,
                    color: '#fff',
                    padding: '16px',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '16px',
                    fontWeight: 800,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: `0 8px 25px ${accentColor}33`,
                    marginTop: '10px'
                  }}
                >
                  {loading ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Deploy Child Network'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: SUCCESS ANIMATION */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '10px 0' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <CheckCircle2 size={72} color="#00ff88" style={{ filter: 'drop-shadow(0 0 12px rgba(0,255,136,0.3))' }} />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '10px', color: '#fff' }}>
                Deployment Completed!
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
                The child network template cloning has finished. Setting up routing, templates, and permissions...
              </p>

              <button
                onClick={() => {
                  window.location.href = `/?tenant=${createdNetworkId}&admin_panel=true`;
                }}
                style={{
                  background: 'linear-gradient(135deg, #00ff88, #00b35f)',
                  color: '#000',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(0,255,136,0.2)'
                }}
              >
                Go to Spawned Network <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Home option */}
        {step !== 'success' && (
          <div style={{
            marginTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '20px',
            textAlign: 'center'
          }}>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'color 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              <Home size={14} /> Back to Homepage
            </button>
          </div>
        )}
      </motion.div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
