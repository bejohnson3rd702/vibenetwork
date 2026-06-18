import { useState } from 'react';
import { Copy, Check, ExternalLink, Brain, Shield, FileText, Database } from 'lucide-react';

export function EnterpriseAiTab({ wlConfig }: { wlConfig: any }) {
  const accent = wlConfig?.accent || '#D35400';
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const WIDGET_EMBED_KEY = 'vbn_k_2026_vibenetwork';
  const KB_PORTAL_KEY = 'cpk_896ef1590b2476ede97dafc63d11d82d41e7a4e8';
  const KB_PORTAL_URL = 'https://nalu-enterprise.pages.dev/client-portal.html';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Brain size={36} color={accent} /> Enterprise AI Agent
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '16px' }}>
          Manage your private AI knowledge base, train your chatbot, and view query history via NaluAsk.
        </p>
      </div>

      {/* Dev Mode Notification Banner */}
      <div style={{ 
        background: `linear-gradient(135deg, rgba(211, 84, 0, 0.1) 0%, rgba(166, 0, 255, 0.05) 100%)`, 
        border: `1px solid rgba(211, 84, 0, 0.25)`, 
        borderRadius: '16px', 
        padding: '20px 24px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px' 
      }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '12px', display: 'flex', color: accent }}>
          <Shield size={24} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>Development Mode Active</h4>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
            The NaluAsk chatbot widget is configured to load on local development instances (`localhost`/`127.0.0.1`) only. Changes to the KB will reflect immediately in your dev environment.
          </p>
        </div>
      </div>

      {/* Credentials Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <CredentialCard 
          title="Widget Embed Key" 
          val={WIDGET_EMBED_KEY} 
          id="widget" 
          copiedKey={copiedKey} 
          onCopy={handleCopy} 
          accent={accent} 
        />
        <CredentialCard 
          title="KB Portal Key" 
          val={KB_PORTAL_KEY} 
          id="portal" 
          copiedKey={copiedKey} 
          onCopy={handleCopy} 
          accent={accent} 
          isSensitive 
        />
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '16px', 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          gap: '16px' 
        }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>KB Portal URL</div>
            <div style={{ fontFamily: 'monospace', fontSize: '14px', wordBreak: 'break-all', color: '#00cc66' }}>{KB_PORTAL_URL}</div>
          </div>
          <a 
            href={KB_PORTAL_URL} 
            target="_blank" 
            rel="noreferrer" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              padding: '10px 16px', 
              background: 'rgba(255,255,255,0.05)', 
              color: '#fff', 
              textDecoration: 'none', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: 'bold', 
              transition: 'background 0.2s' 
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            Open External Portal <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Guide & Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} color={accent} /> Supported Document Formats
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
            <li><strong>Upload File</strong>: Upload standard <code>.pdf</code>, <code>.docx</code>, or <code>.txt</code> files. They are immediately chunked and parsed.</li>
            <li><strong>Paste Text / FAQ</strong>: Ideal for raw product manuals, bios, or custom FAQs directly in text form.</li>
            <li><strong>URL Crawl</strong> (Admin-only): Auto-crawl documentation or sitemaps (contact support to enable).</li>
          </ul>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={18} color={accent} /> What The Portal Shows You
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
            <li><strong>My Documents</strong>: View all uploaded files with details on names and chunk sizes. Persistent data.</li>
            <li><strong>Query History</strong>: Monitor every single question visitors have asked the AI chatbot, complete with chat logs.</li>
            <li><strong>Instant Synced Updates</strong>: Re-uploading a document deletes the old version and indexes the new contents instantly.</li>
          </ul>
        </div>
      </div>

      {/* Embedded Portal iframe */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>Interactive KB Portal Console</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Enter your KB Portal Key inside the console to access your documents.</span>
        </div>
        <div style={{ 
          position: 'relative', 
          background: '#111', 
          borderRadius: '16px', 
          padding: '8px', 
          border: '1px solid rgba(255,255,255,0.08)' 
        }}>
          <iframe 
            src={KB_PORTAL_URL} 
            title="NaluAsk KB Portal"
            style={{ 
              width: '100%', 
              height: '650px', 
              border: 'none', 
              borderRadius: '12px', 
              background: '#fff' 
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CredentialCard({ title, val, id, copiedKey, onCopy, accent, isSensitive = false }: any) {
  const [showSensitive, setShowSensitive] = useState(!isSensitive);
  const isCopied = copiedKey === id;

  return (
    <div style={{ 
      background: 'rgba(255,255,255,0.02)', 
      border: '1px solid rgba(255,255,255,0.05)', 
      borderRadius: '16px', 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      gap: '16px' 
    }}>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{title}</div>
        <div style={{ 
          fontFamily: 'monospace', 
          fontSize: '14px', 
          wordBreak: 'break-all',
          color: isSensitive && !showSensitive ? 'rgba(255,255,255,0.3)' : '#fff',
          letterSpacing: isSensitive && !showSensitive ? '2px' : 'normal'
        }}>
          {isSensitive && !showSensitive ? '••••••••••••••••••••••••••••••••••••••••' : val}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {isSensitive && (
          <button 
            onClick={() => setShowSensitive(!showSensitive)}
            style={{ 
              flex: 1,
              padding: '10px', 
              background: 'rgba(255,255,255,0.05)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '13px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              transition: 'background 0.2s' 
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            {showSensitive ? 'Hide' : 'Show'}
          </button>
        )}
        <button 
          onClick={() => onCopy(val, id)}
          style={{ 
            flex: 2,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            padding: '10px', 
            background: isCopied ? '#00cc66' : accent, 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '13px', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            transition: 'background 0.2s' 
          }}
          onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.15)'}
          onMouseOut={e => e.currentTarget.style.filter = 'none'}
        >
          {isCopied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
        </button>
      </div>
    </div>
  );
}
