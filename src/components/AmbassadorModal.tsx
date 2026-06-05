import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWhiteLabel } from '../context/WhiteLabelContext';

interface AmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  accent?: string;
}

export default function AmbassadorModal({ isOpen, onClose, accent = 'var(--accent-primary)' }: AmbassadorModalProps) {
  const { wlConfig } = useWhiteLabel();
  const isOlympian = wlConfig?.name?.toLowerCase().includes('olympia') || 
                     wlConfig?.domain?.includes('mrolympia.com') ||
                     wlConfig?.name?.toLowerCase().includes('muscle') ||
                     wlConfig?.name?.toLowerCase().includes('fitness');
  const appName = wlConfig?.name || 'AVO';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    socialLinks: '',
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      socialLinks: '',
      comments: ''
    });
    setIsSubmitted(false);
  };

  const handleClose = () => {
    onClose();
    // Reset state after transition completes
    setTimeout(handleReset, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(5, 5, 5, 0.85)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 15, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              background: 'rgba(15, 15, 15, 0.85)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: '40px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
              overflow: 'hidden'
            }}
          >
            {/* Top accent glow */}
            <div style={{
              position: 'absolute',
              top: '-150px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '300px',
              height: '200px',
              borderRadius: '50%',
              background: accent,
              filter: 'blur(100px)',
              opacity: 0.15,
              pointerEvents: 'none'
            }} />

            {/* Close Button */}
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }}
            >
              <X size={18} />
            </button>

            {!isSubmitted ? (
              <>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
                  Become an Ambassador
                </h3>
                <p style={{ margin: '0 0 28px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {isOlympian 
                    ? "Rep the Mr. Olympia brand, share your fitness journey, and earn exclusive perks. Tell us about yourself to get started."
                    : wlConfig?.name 
                      ? `Rep ${wlConfig.name}, share exclusive drops, and earn perks. Tell us a bit about yourself to get started.`
                      : "Rep your school, share exclusive drops, and earn perks. Tell us a bit about yourself to get started."
                  }
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* First Name & Last Name */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>First Name</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Alex"
                        style={{
                          padding: '12px 16px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'all 0.2s'
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = accent;
                          e.target.style.boxShadow = `0 0 10px ${accent}22`;
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Last Name</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Smith"
                        style={{
                          padding: '12px 16px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'all 0.2s'
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = accent;
                          e.target.style.boxShadow = `0 0 10px ${accent}22`;
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder={isOlympian ? "alex.smith@fitness.com" : "alex.smith@university.edu"}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = accent;
                        e.target.style.boxShadow = `0 0 10px ${accent}22`;
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Social Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Social Handles / Links</label>
                    <input
                      type="text"
                      required
                      value={formData.socialLinks}
                      onChange={e => setFormData(prev => ({ ...prev, socialLinks: e.target.value }))}
                      placeholder="Instagram @username, TikTok @username, etc."
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = accent;
                        e.target.style.boxShadow = `0 0 10px ${accent}22`;
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Comments Box */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>
                      {isOlympian 
                        ? "Why do you want to represent Mr. Olympia?" 
                        : `Why do you want to represent ${appName}?`
                      }
                    </label>
                    <textarea
                      value={formData.comments}
                      onChange={e => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                      placeholder={isOlympian 
                        ? "Tell us about your fitness journey, training style, social presence, or why you love bodybuilding and Mr. Olympia..." 
                        : "Tell us a bit about your campus activities, student organizations, or why you love college apparel..."
                      }
                      rows={4}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'inherit',
                        lineHeight: 1.5,
                        transition: 'all 0.2s'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = accent;
                        e.target.style.boxShadow = `0 0 10px ${accent}22`;
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      marginTop: '8px',
                      padding: '14px',
                      background: accent,
                      border: 'none',
                      borderRadius: '12px',
                      color: '#000',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: `0 10px 20px ${accent}22`,
                      transition: 'all 0.25s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={e => {
                      if (!isSubmitting) {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '30px 0 10px'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: `${accent}20`,
                  border: `2px solid ${accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  boxShadow: `0 0 20px ${accent}33`
                }}>
                  <Check size={32} color={accent} strokeWidth={3} />
                </div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
                  Application Received!
                </h3>
                <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '320px' }}>
                  Thank you, <strong>{formData.firstName}</strong>. We've received your ambassador application and our {isOlympian ? "athlete coordination" : "campus"} team will reach out to you shortly.
                </p>
                <button
                  onClick={handleClose}
                  style={{
                    padding: '12px 36px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                >
                  Close Window
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
