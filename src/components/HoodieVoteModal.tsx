import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HoodieVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  accent?: string;
}

const SCHOOL_DESIGNS = [
  { id: 'baylor', name: 'Baylor', color: '#154734', hoodieColor: '#154734', stringColor: '#FFC72C' },
  { id: 'colorado', name: 'Colorado', color: '#CFB87C', hoodieColor: '#000000', stringColor: '#CFB87C' },
  { id: 'georgia', name: 'Georgia', color: '#BA0C2F', hoodieColor: '#BA0C2F', stringColor: '#000000' },
  { id: 'msu', name: 'Mississippi State', color: '#660000', hoodieColor: '#660000', stringColor: '#ffffff' },
  { id: 'alabama', name: 'Alabama', color: '#9E1B32', hoodieColor: '#9E1B32', stringColor: '#ffffff' },
  { id: 'olemiss', name: 'Ole Miss', color: '#CE1126', hoodieColor: '#00205B', stringColor: '#CE1126' },
  { id: 'vanderbilt', name: 'Vanderbilt', color: '#866D4B', hoodieColor: '#000000', stringColor: '#866D4B' },
  { id: 'pennstate', name: 'Penn State', color: '#041E42', hoodieColor: '#041E42', stringColor: '#ffffff' },
];

export default function HoodieVoteModal({ isOpen, onClose, accent = 'var(--accent-primary)' }: { isOpen: boolean; onClose: () => void; accent?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock results percentage
  const [results, setResults] = useState<{ [key: string]: number }>({
    baylor: 12,
    colorado: 18,
    georgia: 15,
    msu: 10,
    alabama: 16,
    olemiss: 11,
    vanderbilt: 8,
    pennstate: 10,
  });

  const handleVoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Increment the voted school
      setResults(prev => {
        const next = { ...prev };
        next[selectedId] = (next[selectedId] || 0) + 1;
        // Re-calculate to keep total sum near 100% is fine for mock
        return next;
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleClose = () => {
    onClose();
    // Reset state after transition completes
    setTimeout(() => {
      setSelectedId(null);
      setIsSubmitted(false);
    }, 400);
  };

  // Calculate percentages dynamically
  const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);

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
              maxWidth: '640px',
              background: 'rgba(15, 15, 15, 0.85)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: '40px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Top Accent Glow */}
            <div style={{
              position: 'absolute',
              top: '-150px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '350px',
              height: '200px',
              borderRadius: '50%',
              background: selectedId ? SCHOOL_DESIGNS.find(s => s.id === selectedId)?.color : accent,
              filter: 'blur(100px)',
              opacity: 0.15,
              pointerEvents: 'none',
              transition: 'background 0.3s'
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
                  Best Hoodie Design
                </h3>
                <p style={{ margin: '0 0 28px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Support your school! Choose the college hoodie design that represents your campus with the most style.
                </p>

                <form onSubmit={handleVoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Grid of School Hoodie Previews */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '16px',
                  }}>
                    {SCHOOL_DESIGNS.map(school => {
                      const isSelected = selectedId === school.id;
                      return (
                        <div
                          key={school.id}
                          onClick={() => setSelectedId(school.id)}
                          style={{
                            background: isSelected ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                            border: `1.5px solid ${isSelected ? school.color : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: '16px',
                            padding: '16px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            transition: 'all 0.25s',
                            boxShadow: isSelected ? `0 0 15px ${school.color}22` : 'none',
                          }}
                          onMouseOver={e => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            }
                          }}
                          onMouseOut={e => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                              e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                            }
                          }}
                        >
                          {/* Mock Hoodie SVG Icon */}
                          <svg
                            viewBox="0 0 100 100"
                            style={{
                              width: '48px',
                              height: '48px',
                              marginBottom: '10px',
                              filter: isSelected ? `drop-shadow(0 4px 10px ${school.color}55)` : 'none',
                              transition: 'filter 0.25s'
                            }}
                          >
                            {/* Hoodie Body */}
                            <path d="M25,80 L25,45 Q25,35 35,35 L65,35 Q75,35 75,45 L75,80 Z" fill={school.hoodieColor} />
                            {/* Hoodie Pocket */}
                            <path d="M38,80 L62,80 L58,65 L42,65 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                            {/* Hoodie Sleeves */}
                            <path d="M25,45 L10,65 L16,68 L25,52 Z" fill={school.hoodieColor} />
                            <path d="M75,45 L90,65 L84,68 L75,52 Z" fill={school.hoodieColor} />
                            {/* Hoodie Strings */}
                            <line x1="46" y1="42" x2="46" y2="58" stroke={school.stringColor} strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="54" y1="42" x2="54" y2="54" stroke={school.stringColor} strokeWidth="1.5" strokeLinecap="round" />
                            {/* Hoodie Hood */}
                            <path d="M32,38 Q32,20 50,20 Q68,20 68,38 Z" fill={school.hoodieColor} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                            {/* Inner Hood Darkening */}
                            <path d="M38,36 Q38,26 50,26 Q62,26 62,36 Z" fill="rgba(0,0,0,0.2)" />
                          </svg>

                          <span style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            color: isSelected ? '#fff' : 'var(--text-secondary)',
                            textAlign: 'center',
                            letterSpacing: '0.2px'
                          }}>
                            {school.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedId}
                    style={{
                      padding: '14px',
                      background: selectedId ? SCHOOL_DESIGNS.find(s => s.id === selectedId)?.color : 'rgba(255,255,255,0.04)',
                      border: 'none',
                      borderRadius: '12px',
                      color: selectedId ? '#fff' : 'rgba(255,255,255,0.3)',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      fontSize: '13px',
                      cursor: selectedId ? 'pointer' : 'not-allowed',
                      boxShadow: selectedId ? `0 10px 20px ${SCHOOL_DESIGNS.find(s => s.id === selectedId)?.color}33` : 'none',
                      transition: 'all 0.25s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={e => {
                      if (selectedId && !isSubmitting) {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {isSubmitting ? 'Casting Your Vote...' : 'Cast Vote'}
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
                  padding: '10px 0'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  border: '1.5px solid rgba(255,255,255,0.1)'
                }}>
                  <Check size={26} color="#fff" strokeWidth={3} />
                </div>
                
                <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>
                  Vote Successfully Cast!
                </h3>
                <p style={{ margin: '0 0 32px 0', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '360px', lineHeight: 1.5 }}>
                  Thank you for supporting <strong>{SCHOOL_DESIGNS.find(s => s.id === selectedId)?.name}</strong>. Here are the live results:
                </p>

                {/* Live Leaderboard Results */}
                <div style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  marginBottom: '32px'
                }}>
                  {SCHOOL_DESIGNS.map(school => {
                    const voteCount = results[school.id] || 0;
                    const percentage = Math.round((voteCount / totalVotes) * 100);
                    const isSelected = selectedId === school.id;

                    return (
                      <div key={school.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
                          <span style={{ color: isSelected ? '#fff' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {school.name} {isSelected && <span style={{ fontSize: '9px', background: school.color, color: '#fff', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Your Vote</span>}
                          </span>
                          <span style={{ color: isSelected ? school.color : 'var(--text-secondary)' }}>{percentage}%</span>
                        </div>
                        {/* Progress Bar Container */}
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            style={{ height: '100%', background: school.color, borderRadius: '4px' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

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
