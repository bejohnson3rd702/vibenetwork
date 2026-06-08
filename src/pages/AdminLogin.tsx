import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldAlert, Mail, Lock, Loader, ArrowRight, Home } from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const { wlConfig } = useWhiteLabel();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Styling based on tenant config, default to B2B warning crimson red
  const accentColor = wlConfig?.accent || '#FF2A54';

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

      // 2. Fetch user profile and verify if they are a Master Admin
      const { data: profile } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const isMasterAdmin = profile?.is_admin === true || 
                            profile?.role === 'admin' || 
                            user.user_metadata?.role === 'admin';

      if (!isMasterAdmin) {
        await supabase!.auth.signOut();
        throw new Error('Access Denied: Global Administrator credentials required.');
      }

      toast.success('Authentication successful! Access granted.');

      // 3. Always redirect Master Admins to the master-admin dashboard
      setTimeout(() => {
        window.location.href = '/master-admin';
      }, 1000);

    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      toast.error('Access Denied');
    } finally {
      setLoading(false);
    }
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(10, 5, 6, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: `1px solid ${accentColor}33`,
          boxShadow: `0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${accentColor}11`,
          overflow: 'hidden',
          padding: '40px'
        }}
      >
        {/* Warning Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{
              background: `rgba(255, 42, 84, 0.08)`,
              border: `1px solid ${accentColor}88`,
              borderRadius: '50%',
              padding: '16px',
              boxShadow: `0 0 20px ${accentColor}22`
            }}
          >
            <ShieldAlert size={40} color={accentColor} />
          </motion.div>
        </div>

        {/* Branding Title */}
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
            Restricted Access
          </div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 900,
            letterSpacing: '-1px',
            margin: '0 0 8px 0',
            color: '#fff',
            textTransform: 'uppercase'
          }}>
            4 Admins Only
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '14px',
            lineHeight: 1.6,
            margin: 0
          }}>
            Access restricted to system administrators, parent network fleet owners, and channel managers. Unauthorized entry is prohibited.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(255, 42, 84, 0.1)',
                color: '#FF2A54',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                border: '1px solid rgba(255, 42, 84, 0.25)',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              {errorMsg}
            </motion.div>
          )}

          <div>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '8px',
              letterSpacing: '1px'
            }}>Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="rgba(255, 255, 255, 0.3)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@vibenetwork.tv"
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  padding: '16px 16px 16px 48px',
                  borderRadius: '14px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = accentColor;
                  e.currentTarget.style.boxShadow = `0 0 12px ${accentColor}22`;
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '8px',
              letterSpacing: '1px'
            }}>Security Key</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="rgba(255, 255, 255, 0.3)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  padding: '16px 16px 16px 48px',
                  borderRadius: '14px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = accentColor;
                  e.currentTarget.style.boxShadow = `0 0 12px ${accentColor}22`;
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
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
              transition: 'all 0.2s',
              marginTop: '12px',
              boxShadow: `0 8px 25px ${accentColor}33`
            }}
            onMouseOver={e => {
              if (!loading) {
                e.currentTarget.style.filter = 'brightness(1.15)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={e => {
              if (!loading) {
                e.currentTarget.style.filter = 'brightness(1)';
                e.currentTarget.style.transform = 'none';
              }
            }}
          >
            {loading ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Authenticate Portal'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Back Link */}
        <div style={{
          marginTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => {
              const urlParams = new URLSearchParams(window.location.search);
              const tenantId = urlParams.get('tenant') || wlConfig?.id;
              window.location.href = tenantId && tenantId !== 'master' ? `/?tenant=${tenantId}` : '/';
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
            <Home size={14} /> Return to Public Network
          </button>
        </div>
      </motion.div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
