import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Lock, ArrowRight, Loader } from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { wlConfig } = useWhiteLabel();

  const accentColor = wlConfig?.accent || '#00ff88';

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase!.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Password successfully updated. You can now log in.');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', background: 'rgba(0,0,0,0.5)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold' }}>Reset Password</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', textAlign: 'center', marginBottom: '30px' }}>Enter your new password below.</p>
        
        {message ? (
          <div style={{ background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
            {message}
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{ background: 'rgba(255, 50, 50, 0.1)', color: '#ff4444', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(255, 50, 50, 0.2)' }}>
                {error}
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                value={password}
                onChange={e=>setPassword(e.target.value)}
                required
                placeholder="New Password (min 6 chars)" 
                style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', padding: '16px 16px 16px 48px', borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} 
                onFocus={e=>e.currentTarget.style.borderColor = accentColor}
                onBlur={e=>e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || password.length < 6}
              style={{ background: accentColor, color: 'var(--bg-color)', padding: '16px', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: (loading || password.length < 6) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s' }}
            >
              {loading ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Update Password'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        )}
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
