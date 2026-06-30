import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useToast } from '../context/ToastContext';

interface SubscriptionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSub: boolean;
  setIsSub: (value: boolean) => void;
  subPrice: string;
  setSubPrice: (price: string) => void;
  userId?: string;
}

export const SubscriptionSettingsModal: React.FC<SubscriptionSettingsModalProps> = ({
  isOpen,
  onClose,
  isSub,
  setIsSub,
  subPrice,
  setSubPrice,
  userId,
}) => {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} onClick={onClose} />
          
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', color: '#fff' }}>
            <h2 style={{ margin: 0, fontSize: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Subscription / Free Tier Settings
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>Choose if your channel is free or requires a monthly paid subscription to access premium content.</p>
            
            {/* Free vs Subscription Toggle */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '12px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.1)', margin: '10px 0' }}>
              <button 
                type="button"
                onClick={() => {
                  setIsSub(false);
                  setSubPrice('0');
                }}
                style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: !isSub ? 'linear-gradient(135deg, #ff4d85, #8A2BE2)' : 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px' }}
              >
                Free
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsSub(true);
                  if (parseFloat(subPrice) === 0 || !subPrice) {
                    setSubPrice('4.99');
                  }
                }}
                style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: isSub ? 'linear-gradient(135deg, #ff4d85, #8A2BE2)' : 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px' }}
              >
                Subscription
              </button>
            </div>

            {isSub ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '16px', fontWeight: 'bold' }}>$</span>
                  <input
                    id="modal-sub-price-input"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={subPrice}
                    onChange={e => setSubPrice(e.target.value)}
                    placeholder="4.99"
                    style={{ width: '100%', paddingLeft: '32px', padding: '14px 14px 14px 32px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={async () => {
                    const price = parseFloat(subPrice) || 0;
                    if (price <= 0) {
                      showToast('Please enter a price greater than $0 for a paid subscription.', 'error');
                      return;
                    }
                    setSaving(true);
                    const { error } = await supabase!.from('profiles').update({ sub_price: price }).eq('id', userId);
                    setSaving(false);
                    if (!error) {
                      showToast('Subscription price saved!', 'success');
                      onClose();
                    } else {
                      showToast('Failed to save price.', 'error');
                    }
                  }}
                  style={{ padding: '14px 24px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap', transition: 'opacity 0.2s', opacity: saving ? 0.6 : 1 }}
                  onMouseOver={e => { if (!saving) e.currentTarget.style.opacity = '0.85'; }}
                  onMouseOut={e => { if (!saving) e.currentTarget.style.opacity = '1'; }}
                >
                  {saving ? 'Saving...' : 'Save Price'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,255,136,0.05)', padding: '16px', borderRadius: '12px', border: '1px dashed rgba(0,255,136,0.2)', marginTop: '10px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>🎁 Fans can subscribe to your channel for free.</span>
                <button
                  type="button"
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true);
                    const { error } = await supabase!.from('profiles').update({ sub_price: 0 }).eq('id', userId);
                    setSaving(false);
                    if (!error) {
                      setSubPrice('0');
                      showToast('Channel set to free successfully!', 'success');
                      onClose();
                    } else {
                      showToast('Failed to save settings.', 'error');
                    }
                  }}
                  style={{ padding: '10px 20px', background: '#00ff88', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'opacity 0.2s', opacity: saving ? 0.6 : 1 }}
                  onMouseOver={e => { if (!saving) e.currentTarget.style.opacity = '0.85'; }}
                  onMouseOut={e => { if (!saving) e.currentTarget.style.opacity = '1'; }}
                >
                  {saving ? 'Saving...' : 'Save Free'}
                </button>
              </div>
            )}
            
            <p style={{ margin: '10px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>
              Current Status: <strong style={{ color: Number(subPrice) > 0 ? '#00ff88' : 'var(--text-muted)' }}>{Number(subPrice) > 0 ? `Paid ($${Number(subPrice).toFixed(2)}/mo)` : 'Free Channel'}</strong>
            </p>
            
            <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none', fontSize: '20px' }}>✕</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
