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
  profileId?: string;
  targetProfileId?: string;
  onSaveSuccess?: (newPrice: number) => void;
}

export const SubscriptionSettingsModal: React.FC<SubscriptionSettingsModalProps> = ({
  isOpen,
  onClose,
  isSub,
  setIsSub,
  subPrice,
  setSubPrice,
  userId,
  profileId,
  targetProfileId,
  onSaveSuccess,
}) => {
  const toast = useToast();
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '6px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>Monthly Subscription Price (USD):</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#ff4d85', fontSize: '18px', fontWeight: '900' }}>$</span>
                      <input
                        id="modal-sub-price-input"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={subPrice}
                        onChange={e => setSubPrice(e.target.value)}
                        placeholder="9.99"
                        style={{ width: '100%', paddingLeft: '32px', padding: '14px 14px 14px 34px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', fontSize: '18px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={async () => {
                        const price = parseFloat(subPrice) || 0;
                        if (price <= 0) {
                          toast.error('Please enter a price greater than $0 for a paid subscription.');
                          return;
                        }
                        setSaving(true);
                        const targetIds = Array.from(new Set([profileId, userId, targetProfileId].filter((id): id is string => Boolean(id && typeof id === 'string'))));
                        for (const id of targetIds) {
                          try {
                            await supabase!.from('profiles').update({ sub_price: price }).eq('id', id);
                          } catch (err) {
                            console.warn('Profile sub_price update warning for ID', id, err);
                          }
                          localStorage.setItem(`vibe_sub_price_${id}`, String(price));
                        }
                        localStorage.setItem('vibe_channel_sub_price', String(price));
                        setSaving(false);
                        toast.success(`Subscription price updated to $${price.toFixed(2)}/mo!`);
                        if (onSaveSuccess) onSaveSuccess(price);
                        onClose();
                      }}
                      style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap', transition: 'all 0.2s', opacity: saving ? 0.6 : 1, boxShadow: '0 4px 20px rgba(255,77,133,0.4)' }}
                      onMouseOver={e => { if (!saving) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                      onMouseOut={e => { if (!saving) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; } }}
                    >
                      {saving ? 'Saving...' : `Save Price`}
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quick Select Presets:</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['2.99', '4.99', '9.99', '14.99', '19.99', '24.99'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSubPrice(val)}
                        style={{
                          padding: '6px 14px',
                          background: subPrice === val ? 'rgba(255, 77, 133, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${subPrice === val ? '#ff4d85' : 'rgba(255, 255, 255, 0.15)'}`,
                          borderRadius: '20px',
                          color: subPrice === val ? '#ff4d85' : '#fff',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => {
                          if (subPrice !== val) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          }
                        }}
                        onMouseOut={e => {
                          if (subPrice !== val) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          }
                        }}
                      >
                        ${val}/mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Button Preview for Creator */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>How it appears to viewers:</span>
                  <div style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #FF0055, #8A2BE2)', color: '#fff', borderRadius: '100px', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 4px 15px rgba(255,0,85,0.3)' }}>
                    Subscribe ${Number(subPrice || 0).toFixed(2)}/mo
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,255,136,0.06)', padding: '16px 20px', borderRadius: '12px', border: '1px dashed rgba(0,255,136,0.25)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>🎁 Free Channel Tier</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Fans can follow & subscribe to your channel at $0/mo.</span>
                  </div>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={async () => {
                      setSaving(true);
                      const targetIds = Array.from(new Set([profileId, userId, targetProfileId].filter((id): id is string => Boolean(id && typeof id === 'string'))));
                      for (const id of targetIds) {
                        try {
                          await supabase!.from('profiles').update({ sub_price: 0 }).eq('id', id);
                        } catch (err) {
                          console.warn('Profile sub_price free update warning for ID', id, err);
                        }
                        localStorage.setItem(`vibe_sub_price_${id}`, '0');
                      }
                      localStorage.setItem('vibe_channel_sub_price', '0');
                      setSaving(false);
                      setSubPrice('0');
                      toast.success('Channel set to free subscription successfully!');
                      if (onSaveSuccess) onSaveSuccess(0);
                      onClose();
                    }}
                    style={{ padding: '10px 24px', background: '#00ff88', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s', opacity: saving ? 0.6 : 1, boxShadow: '0 4px 15px rgba(0,255,136,0.3)' }}
                    onMouseOver={e => { if (!saving) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                    onMouseOut={e => { if (!saving) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; } }}
                  >
                    {saving ? 'Saving...' : 'Save Free'}
                  </button>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Active Channel Status: <strong style={{ color: Number(subPrice) > 0 ? '#00ff88' : '#ffd166' }}>{Number(subPrice) > 0 ? `Paid ($${Number(subPrice).toFixed(2)}/mo)` : 'Free Tier'}</strong>
              </span>
              <button
                type="button"
                onClick={onClose}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
              >
                Cancel
              </button>
            </div>
            
            <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none', fontSize: '20px' }}>✕</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
