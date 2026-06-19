import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useToast } from '../../context/ToastContext';

interface SecuritySettingsFormProps {
  accentColor: string;
}

export const SecuritySettingsForm: React.FC<SecuritySettingsFormProps> = ({ accentColor }) => {
  const toast = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setUpdatingPassword(true);
    const { error } = await supabase!.auth.updateUser({ password: newPassword });
    setUpdatingPassword(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password successfully updated!');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div style={{ background: 'rgba(15, 15, 15, 0.4)', backdropFilter: 'blur(24px)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', maxWidth: '500px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#ff4d85', display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={20} /> Update Password</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>Ensure your account stays secure. Enter a new strong password below to update it.</p>
      
      <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="password" placeholder="New Password" required minLength={6}
            value={newPassword} onChange={e => setNewPassword(e.target.value)}
            style={{
              width: '100%', padding: '16px 16px 16px 44px', boxSizing: 'border-box',
              background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none'
            }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="password" placeholder="Confirm New Password" required minLength={6}
            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            style={{
              width: '100%', padding: '16px 16px 16px 44px', boxSizing: 'border-box',
              background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none'
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={updatingPassword}
          style={{
            width: '100%', padding: '18px', marginTop: '10px',
            background: accentColor, color: '#fff', fontWeight: 'bold', fontSize: '16px',
            border: 'none', borderRadius: '12px', cursor: updatingPassword ? 'not-allowed' : 'pointer',
            opacity: updatingPassword ? 0.7 : 1, transition: 'all 0.2s'
          }}
        >
          {updatingPassword ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};
