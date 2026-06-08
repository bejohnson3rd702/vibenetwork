import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { useToast } from '../context/ToastContext';
import { Paintbrush, Save, X, Type, Video, Layout, Image, Palette, RotateCcw, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveCustomizer() {
  const { wlConfig, setWlConfig } = useWhiteLabel();
  const toast = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Read accent color from config
  const accentColor = wlConfig?.accent || '#FF2A54';

  const updateConfigField = (key: string, value: any) => {
    if (!wlConfig) return;
    
    // Create new theme object and merge changes
    const newTheme = {
      ...(wlConfig.theme || {}),
      [key]: value
    };

    // Update wlConfig state, both top-level normalized fields and nested theme object
    const updated = {
      ...wlConfig,
      [key]: value,
      theme: newTheme
    };

    // Special mappings
    if (key === 'logoImage') {
      updated.logo = value;
    }

    setWlConfig(updated);
  };

  const handleSaveConfig = async () => {
    if (!wlConfig?.id) return;
    setSaving(true);
    try {
      const payload = {
        name: wlConfig.name,
        logo: wlConfig.theme?.logoImage || wlConfig.logo || wlConfig.logoImage,
        theme: wlConfig.theme
      };

      const { error } = await supabase!
        .from('whitelabel_configs')
        .update(payload)
        .eq('id', wlConfig.id);

      if (error) throw error;
      toast.success("Design configuration saved successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save configuration: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '6px',
    letterSpacing: '1px'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          right: isOpen ? '340px' : '24px',
          bottom: '24px',
          background: accentColor,
          color: '#fff',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 'bold',
          fontSize: '14px',
          cursor: 'pointer',
          zIndex: 99999,
          boxShadow: `0 8px 30px ${accentColor}44`,
          transition: 'right 0.3s ease'
        }}
      >
        <Paintbrush size={18} />
        {isOpen ? 'Close Editor' : 'Live Customize'}
      </motion.button>

      {/* Slide Out Customizer Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              width: '320px',
              height: '100vh',
              background: 'rgba(10, 5, 8, 0.85)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              zIndex: 99998,
              padding: '30px 24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#fff',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.8)'
            }}
          >
            {/* Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: accentColor }}>
                  Live Customizer
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: 'calc(100vh - 180px)', paddingRight: '4px' }}>
                
                {/* Accent Color */}
                <div>
                  <label style={labelStyle}><Palette size={12} style={{ marginRight: '6px' }} /> Accent Theme Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={wlConfig?.accent || '#FF2A54'}
                      onChange={e => updateConfigField('accent', e.target.value)}
                      style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={wlConfig?.accent || '#FF2A54'}
                      onChange={e => updateConfigField('accent', e.target.value)}
                      style={{ ...inputStyle, fontFamily: 'monospace' }}
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label style={labelStyle}><Palette size={12} style={{ marginRight: '6px' }} /> Background Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={wlConfig?.bg || '#000000'}
                      onChange={e => updateConfigField('bg', e.target.value)}
                      style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={wlConfig?.bg || '#000000'}
                      onChange={e => updateConfigField('bg', e.target.value)}
                      style={{ ...inputStyle, fontFamily: 'monospace' }}
                    />
                  </div>
                </div>

                {/* Logo Image URL */}
                <div>
                  <label style={labelStyle}><Image size={12} style={{ marginRight: '6px' }} /> Logo Image URL</label>
                  <input
                    type="text"
                    value={wlConfig?.logoImage || ''}
                    onChange={e => updateConfigField('logoImage', e.target.value)}
                    placeholder="https://... Logo URL"
                    style={inputStyle}
                  />
                </div>

                {/* Hero Title */}
                <div>
                  <label style={labelStyle}><Type size={12} style={{ marginRight: '6px' }} /> Hero Brand Title</label>
                  <input
                    type="text"
                    value={wlConfig?.name || ''}
                    onChange={e => {
                      if (!wlConfig) return;
                      // Update name both top-level and theme heroTitle
                      setWlConfig({
                        ...wlConfig,
                        name: e.target.value,
                        theme: {
                          ...(wlConfig.theme || {}),
                          heroTitle: e.target.value
                        }
                      });
                    }}
                    placeholder="e.g. My Network Title"
                    style={inputStyle}
                  />
                </div>

                {/* Hero Billboard Text */}
                <div>
                  <label style={labelStyle}><Type size={12} style={{ marginRight: '6px' }} /> Hero Billboard Copy</label>
                  <textarea
                    value={wlConfig?.heroCopy || ''}
                    onChange={e => updateConfigField('heroCopy', e.target.value)}
                    placeholder="e.g. Welcome to our network..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                {/* Hero Layout Mode */}
                <div>
                  <label style={labelStyle}><Layout size={12} style={{ marginRight: '6px' }} /> Hero Layout Mode</label>
                  <select
                    value={wlConfig?.heroLayoutMode || 'verbiage'}
                    onChange={e => updateConfigField('heroLayoutMode', e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="verbiage">Text Copy (Standard)</option>
                    <option value="video">Featured Video (Live Stream / MP4)</option>
                  </select>
                </div>

                {/* Hero Video URL */}
                {wlConfig?.heroLayoutMode === 'video' && (
                  <>
                    <div>
                      <label style={labelStyle}><Video size={12} style={{ marginRight: '6px' }} /> Hero Video Stream URL</label>
                      <input
                        type="text"
                        value={wlConfig?.heroVideoUrl || ''}
                        onChange={e => updateConfigField('heroVideoUrl', e.target.value)}
                        placeholder="YouTube watch URL or direct .mp4"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}><Type size={12} style={{ marginRight: '6px' }} /> Video Overlay Title</label>
                      <input
                        type="text"
                        value={wlConfig?.heroVideoTitle || ''}
                        onChange={e => updateConfigField('heroVideoTitle', e.target.value)}
                        placeholder="e.g. LIVE BROADCAST"
                        style={inputStyle}
                      />
                    </div>
                  </>
                )}

                {/* Hero Background Image URL */}
                <div>
                  <label style={labelStyle}><Image size={12} style={{ marginRight: '6px' }} /> Hero Billboard Background Image</label>
                  <input
                    type="text"
                    value={wlConfig?.heroImage || ''}
                    onChange={e => updateConfigField('heroImage', e.target.value)}
                    placeholder="https://... Hero Image URL"
                    style={inputStyle}
                  />
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                style={{
                  width: '100%',
                  background: accentColor,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: `0 4px 15px ${accentColor}33`
                }}
              >
                {saving ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Layout'}
              </button>

              <button
                onClick={() => window.location.reload()}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '10px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  color: '#ccc',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <RotateCcw size={14} />
                Reset Layout
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
