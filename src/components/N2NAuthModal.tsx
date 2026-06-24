import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { useToast } from '../context/ToastContext';
import { X, ShieldCheck, Mail, Lock, AtSign, Loader, ArrowRight, Network, Palette, Type, Check } from 'lucide-react';

interface N2NAuthModalProps {
  onClose: () => void;
  initialRole?: 'viewer' | 'influencer' | 'business';
}

export default function N2NAuthModal({ onClose, initialRole }: N2NAuthModalProps) {
  const { wlConfig } = useWhiteLabel();
  const toast = useToast();

  const accentColor = wlConfig?.accent || '#D35400';

  // ─── Auth State ─────────────────────────────────────────────────
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'viewer' | 'influencer' | 'business'>(initialRole || 'viewer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ─── Business Wizard State ──────────────────────────────────────
  const [wizardStep, setWizardStep] = useState(0); // 0 = auth form, 1-3 = wizard steps
  const [networkName, setNetworkName] = useState('');
  const [networkAccent, setNetworkAccent] = useState(accentColor);
  const [heroCopy, setHeroCopy] = useState('');

  const showWizard = !isLogin && role === 'business' && wizardStep > 0;

  // ─── Shared input style ─────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-color)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-primary)',
    padding: '16px 16px 16px 48px',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const plainInputStyle: React.CSSProperties = {
    ...inputStyle,
    paddingLeft: '16px',
  };

  // ─── Handlers ───────────────────────────────────────────────────
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Isolation check
        const isMaster = !wlConfig?.id || wlConfig?.id === 'master' || wlConfig?.domain === 'vibenetwork.tv' || wlConfig?.domain === 'vibenetwork.vercel.app';
        const userWlId = data.user?.user_metadata?.whitelabel_id;

        let allowed = false;
        if (data.user?.user_metadata?.role === 'admin') allowed = true;
        else if (data.user?.id === wlConfig?.owner_id) allowed = true;
        else if (isMaster && !userWlId) allowed = true;
        else if (!isMaster && userWlId === wlConfig?.id) allowed = true;

        if (!allowed) {
          await supabase!.auth.signOut();
          throw new Error('Invalid credentials for this network.');
        }

        toast.success('Welcome back!');
        onClose();
      } else {
        // Signup
        const { error } = await supabase!.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              role,
              whitelabel_id: (!wlConfig?.id || wlConfig?.id === 'master' || wlConfig?.domain === 'vibenetwork.vercel.app' || wlConfig?.domain === 'vibenetwork.tv') ? null : wlConfig?.id,
            },
          },
        });
        if (error) throw error;

        // If business role, go to wizard instead of closing
        if (role === 'business') {
          setWizardStep(1);
          setLoading(false);
          return;
        }

        toast.success('Check your email to verify your account!');
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleWizardConfirm = () => {
    if (!networkName.trim()) {
      setErrorMsg('Network name is required.');
      return;
    }

    // Dispatch whitelabel_commit event with parent_network_id
    window.dispatchEvent(
      new CustomEvent('whitelabel_commit', {
        detail: {
          parent_network_id: wlConfig?.id,
          name: networkName.trim(),
          accent: networkAccent,
          heroCopy: heroCopy.trim() || `Welcome to ${networkName.trim()}`,
        },
      })
    );

    toast.success(`Network "${networkName}" creation initiated!`);
    onClose();
  };

  // ─── Wizard Steps ───────────────────────────────────────────────
  const renderWizardStep = () => {
    switch (wizardStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: '#000' }}>1</div>
              <span style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Network Name</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Network size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={networkName}
                onChange={e => setNetworkName(e.target.value)}
                placeholder="e.g. My Awesome Network"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = accentColor}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={() => { if (!networkName.trim()) { setErrorMsg('Please enter a network name.'); return; } setErrorMsg(''); setWizardStep(2); }}
              style={{ background: accentColor, color: '#000', padding: '16px', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s' }}
              onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              Next <ArrowRight size={18} />
            </button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: '#000' }}>2</div>
              <span style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Brand Color</span>
            </div>

            {/* Color preview + picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                <input
                  type="color"
                  value={networkAccent}
                  onChange={e => setNetworkAccent(e.target.value)}
                  style={{ position: 'absolute', inset: '-8px', width: 'calc(100% + 16px)', height: 'calc(100% + 16px)', border: 'none', cursor: 'pointer', background: 'none' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ position: 'relative' }}>
                  <Palette size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={networkAccent}
                    onChange={e => setNetworkAccent(e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = networkAccent}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>
            </div>

            {/* Preview swatch */}
            <div style={{ borderRadius: '12px', padding: '20px', background: `linear-gradient(135deg, ${networkAccent}22, ${networkAccent}08)`, border: `1px solid ${networkAccent}44`, display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: networkAccent, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>{networkName || 'Your Network'}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Brand accent preview</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setWizardStep(3)}
                style={{ flex: 2, background: accentColor, color: '#000', padding: '14px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: '#000' }}>3</div>
              <span style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Hero Copy</span>
            </div>

            <div style={{ position: 'relative' }}>
              <Type size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '18px' }} />
              <textarea
                value={heroCopy}
                onChange={e => setHeroCopy(e.target.value)}
                placeholder={`Welcome to ${networkName || 'your network'}. The future of media starts here.`}
                rows={4}
                style={{
                  ...plainInputStyle,
                  paddingLeft: '48px',
                  resize: 'vertical',
                  minHeight: '120px',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                }}
                onFocus={e => e.currentTarget.style.borderColor = accentColor}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Summary card */}
            <div style={{ borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '12px' }}>Launch Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Network</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{networkName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Accent</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: networkAccent }} />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'monospace', fontSize: '12px' }}>{networkAccent}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Parent</span>
                  <span style={{ color: accentColor, fontWeight: 700 }}>{wlConfig?.name || 'Vibe Network'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleWizardConfirm}
                style={{ flex: 2, background: accentColor, color: '#000', padding: '14px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: `0 8px 30px ${accentColor}44` }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
              >
                <Check size={18} /> Launch Network
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // ─── Progress dots ──────────────────────────────────────────────
  const renderProgressDots = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '0 30px 20px' }}>
      {[1, 2, 3].map(step => (
        <div
          key={step}
          style={{
            width: wizardStep === step ? '24px' : '8px',
            height: '8px',
            borderRadius: '4px',
            background: wizardStep >= step ? accentColor : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: '#0d0d0d',
            width: '100%',
            maxWidth: '450px',
            borderRadius: '24px',
            border: `1px solid ${accentColor}44`,
            boxShadow: `0 20px 60px ${accentColor}22`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* ── Header Block ──────────────────────────────────── */}
          <div
            style={{
              background: `linear-gradient(135deg, ${accentColor}22 0%, #000 100%)`,
              padding: '40px 30px 20px 30px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              position: 'relative',
            }}
          >
            <button
              onClick={onClose}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.4)', border: 'none', color: 'var(--text-muted)', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = '#888'}
            >
              <X size={20} />
            </button>

            {/* Logo + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              {wlConfig?.logoImage ? (
                <img
                  src={wlConfig.logoImage}
                  onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(wlConfig.name || 'N2N')}&background=random`}
                  style={{ height: '40px', objectFit: 'contain' }}
                  alt="Logo"
                />
              ) : (
                <div style={{ background: accentColor, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={28} color="#fff" />
                </div>
              )}
              {wlConfig?.name && (
                <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '1px' }}>
                  {wlConfig.name}
                </span>
              )}
            </div>

            <h2 style={{ margin: 0, fontSize: '28px', color: 'var(--text-primary)', fontWeight: 900 }}>
              {showWizard ? 'Launch Your Network' : isLogin ? 'Access Portal' : 'Create Account'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '15px' }}>
              {showWizard
                ? `Configure your new network under ${wlConfig?.name || 'the parent network'}.`
                : isLogin
                ? `Secure entry to the ${wlConfig?.name || 'Enterprise'} environment.`
                : `Join the ${wlConfig?.name || 'Enterprise'} network.`}
            </p>
          </div>

          {/* ── Body ──────────────────────────────────────────── */}
          {showWizard ? (
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {errorMsg && (
                <div style={{ background: 'rgba(255, 50, 50, 0.1)', color: '#ff4444', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(255, 50, 50, 0.2)' }}>
                  {errorMsg}
                </div>
              )}
              <AnimatePresence mode="wait">
                {renderWizardStep()}
              </AnimatePresence>
            </div>
          ) : (
            <form onSubmit={handleAuth} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {errorMsg && (
                <div style={{ background: 'rgba(255, 50, 50, 0.1)', color: '#ff4444', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(255, 50, 50, 0.2)' }}>
                  {errorMsg}
                </div>
              )}

              {/* Username (signup only) */}
              {!isLogin && (
                <div>
                  <div style={{ position: 'relative' }}>
                    <AtSign size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      placeholder="Choose a Username"
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = accentColor}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Credentials</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="name@company.com"
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = accentColor}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = accentColor}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Role Picker (signup only) */}
              {!isLogin && (
                <div style={{ marginTop: '5px' }}>
                  <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '10px' }}>Account Type</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['viewer', 'influencer'] as const).map(r => {
                      const isActive = role === r;
                      const label = r === 'viewer' ? 'Viewer' : 'Creator';
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}

                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            background: isActive
                              ? r === 'viewer' ? '#fff' : accentColor
                              : 'rgba(255,255,255,0.05)',
                            color: isActive
                              ? r === 'viewer' ? '#000' : '#fff'
                              : '#888',
                            border: '1px solid',
                            borderColor: isActive
                              ? r === 'viewer' ? '#fff' : accentColor
                              : 'rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {role === 'business' && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '10px', lineHeight: 1.5 }}>
                      After signing up you'll configure your new child network in a quick 3-step wizard.
                    </p>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{ background: accentColor, color: 'var(--text-primary)', padding: '16px', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', marginTop: '10px' }}
                onMouseOver={e => !loading && (e.currentTarget.style.filter = 'brightness(1.1)')}
                onMouseOut={e => !loading && (e.currentTarget.style.filter = 'brightness(1)')}
              >
                {loading ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : isLogin ? 'Authenticate' : role === 'business' ? 'Sign Up & Configure' : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          {/* ── Wizard Progress ──────────────────────────────── */}
          {showWizard && renderProgressDots()}

          {/* ── Footer Toggle ────────────────────────────────── */}
          {!showWizard && (
            <div style={{ padding: '0 30px 30px 30px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                {isLogin ? 'Need an account?' : 'Already registered?'}
                <button
                  onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: accentColor, fontWeight: 'bold', marginLeft: '6px', cursor: 'pointer' }}
                >
                  {isLogin ? 'Sign Up' : 'Login Here'}
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </AnimatePresence>
  );
}
