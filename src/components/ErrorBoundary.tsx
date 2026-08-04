import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Auto-recover from stale Vercel deployment chunk errors
    if (error.name === 'ChunkLoadError' || error.message?.includes('dynamically imported module') || error.message?.includes('Loading chunk')) {
      const storageKey = 'vibe_chunk_reload_ts';
      const lastReload = Number(sessionStorage.getItem(storageKey) || 0);
      if (Date.now() - lastReload > 10000) {
        sessionStorage.setItem(storageKey, String(Date.now()));
        window.location.reload();
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{ padding: '40px', background: 'rgba(255, 0, 85, 0.08)', border: '1px solid rgba(255, 0, 85, 0.3)', borderRadius: '24px', color: 'var(--text-primary)', margin: '40px auto', maxWidth: '600px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#ff4d85', margin: '0 0 12px 0', fontSize: '22px' }}>Network Interface Update Notice</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 20px 0' }}>
            The platform has been updated with new media controls. Please click below to refresh and load the latest live version.
          </p>
          <button 
            onClick={() => {
              sessionStorage.clear();
              window.location.reload();
            }}
            style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #00ff88, #00b0ff)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,255,136,0.3)' }}
          >
            🔄 Refresh & Load Latest Version
          </button>
          <details style={{ marginTop: '24px', textAlign: 'left', background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '10px' }}>
            <summary style={{ cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)' }}>Technical Details</summary>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '11px', color: '#ff4d85', marginTop: '8px' }}>{this.state.error?.toString()}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
