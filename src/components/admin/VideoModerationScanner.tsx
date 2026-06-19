import React, { useEffect, useRef } from 'react';
import { ShieldAlert, ShieldCheck, Cpu, Play } from 'lucide-react';

interface VideoModerationScannerProps {
  isOpen: boolean;
  logs: string[];
  frames: string[];
  status: 'scanning' | 'passed' | 'failed';
  reason?: string;
  onClose: () => void;
  accentColor?: string;
}

export const VideoModerationScanner: React.FC<VideoModerationScannerProps> = ({
  isOpen,
  logs,
  frames,
  status,
  reason,
  onClose,
  accentColor = '#ff4d85'
}) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the monospace log console as new scanning events arrive
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'rgba(5, 5, 8, 0.85)',
      backdropFilter: 'blur(16px)',
      fontFamily: "'Outfit', sans-serif"
    }}>
      
      {/* Scanner Card */}
      <div style={{
        background: 'rgba(15, 15, 20, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '28px',
        padding: '30px',
        width: '100%',
        maxWidth: '550px',
        boxSizing: 'border-box',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Animated Scanning Laser Line Over Container */}
        {status === 'scanning' && (
          <div style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            height: '2px',
            background: `linear-gradient(90deg, rgba(255,77,133,0) 0%, ${accentColor} 50%, rgba(255,77,133,0) 100%)`,
            boxShadow: `0 0 15px ${accentColor}`,
            animation: 'laserSweep 2s infinite ease-in-out',
            zIndex: 100
          }} />
        )}

        {/* Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: status === 'failed' ? 'rgba(239, 68, 68, 0.1)' : status === 'passed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              padding: '10px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {status === 'failed' ? (
                <ShieldAlert size={22} color="#ef4444" />
              ) : status === 'passed' ? (
                <ShieldCheck size={22} color="#10b981" />
              ) : (
                <Cpu size={22} color={accentColor} className="spin" />
              )}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#fff', letterSpacing: '-0.3px' }}>Vibes AI Shield - Scanning Video</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Auto-moderation content checker active</p>
            </div>
          </div>
          <span style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '1px',
            background: status === 'failed' ? '#ef444422' : status === 'passed' ? '#10b98122' : 'rgba(255,255,255,0.03)',
            color: status === 'failed' ? '#ef4444' : status === 'passed' ? '#10b981' : accentColor,
            padding: '4px 10px',
            borderRadius: '6px',
            border: `1px solid ${status === 'failed' ? '#ef444433' : status === 'passed' ? '#10b98133' : 'rgba(255,255,255,0.05)'}`
          }}>
            {status}
          </span>
        </div>

        {/* Video Keyframe Thumbnails strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Extracted Keyframes ({frames.length}/5)</span>
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '12px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.03)',
            minHeight: '64px',
            alignItems: 'center',
            justifyContent: frames.length > 0 ? 'flex-start' : 'center',
            overflowX: 'auto'
          }}>
            {frames.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <Play size={12} /> Extracting video stream...
              </div>
            ) : (
              frames.map((frame, idx) => (
                <div key={idx} style={{
                  position: 'relative',
                  width: '76px',
                  height: '43px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                  background: '#000',
                  flexShrink: 0
                }}>
                  <img src={frame} alt={`frame-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '2px', right: '4px', background: 'rgba(0,0,0,0.6)', padding: '1px 3px', borderRadius: '4px', fontSize: '8px', color: '#fff', fontFamily: 'monospace' }}>
                    #{idx + 1}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Console Logger Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scanner logs</span>
          <div style={{
            height: '130px',
            overflowY: 'auto',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxSizing: 'border-box'
          }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                color: log.includes('❌') ? '#ef4444' : log.includes('✔') || log.includes('safety') ? '#10b981' : '#ff4d85',
                lineHeight: 1.4,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Call-to-action details / result footer */}
        {status === 'failed' && (
          <div style={{
            background: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '16px',
            padding: '16px',
            fontSize: '13px',
            lineHeight: 1.5,
            color: '#ef4444'
          }}>
            <strong>❌ Upload Blocked: Explicit content triggers matched.</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#d97d7d' }}>Reason: {reason || 'Explicit content detected.'}</p>
          </div>
        )}

        {status === 'passed' && (
          <div style={{
            background: 'rgba(16,185,129,0.05)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '16px',
            padding: '16px',
            fontSize: '13px',
            lineHeight: 1.5,
            color: '#10b981'
          }}>
            <strong>✔ Verification Passed!</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#88cca7' }}>Content verified clean. File uploaded successfully.</p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
          {(status === 'passed' || status === 'failed') ? (
            <button onClick={onClose} style={{
              background: status === 'failed' ? '#ef4444' : '#10b981',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'opacity 0.2s'
            }}>
              Dismiss
            </button>
          ) : (
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#888',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}>
              Cancel Upload
            </button>
          )}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes laserSweep {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1.5s linear infinite;
        }
      `}} />
    </div>
  );
};
