import { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Brain, Shield, FileText, Database, Save, Power, Globe, Key } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useToast } from '../../context/ToastContext';
import { useWhiteLabel } from '../../context/WhiteLabelContext';

const DEFAULT_MASTER_WIDGET_KEY = 'vbn_k_2026_vibenetwork';
const DEFAULT_MASTER_PORTAL_KEY = 'cpk_896ef1590b2476ede97dafc63d11d82d41e7a4e8';
const KB_PORTAL_URL = 'https://nalu-enterprise.pages.dev/client-portal';

function isMasterTenant(cfg: any, isMasterAdmin?: boolean): boolean {
  if (isMasterAdmin) return true;
  if (!cfg) return false;
  const id = String(cfg.id || '').toLowerCase();
  const domain = String(cfg.domain || '').toLowerCase();
  const name = String(cfg.name || '').toLowerCase();
  return (
    id === 'master' ||
    id === 'vibe' ||
    id === 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' ||
    domain === 'vibenetwork.tv' ||
    name === 'vibe master'
  );
}

export function EnterpriseAiTab({ wlConfig, isMasterAdmin = false }: { wlConfig: any; isMasterAdmin?: boolean }) {
  const toast = useToast();
  const { wlConfig: ctxWlConfig, setWlConfig: setCtxWlConfig } = useWhiteLabel();
  const accent = wlConfig?.accent || '#D35400';

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [tenantList, setTenantList] = useState<any[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>(wlConfig?.id || 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30');
  const [activeTarget, setActiveTarget] = useState<any>(wlConfig);

  const targetIsMaster = isMasterTenant(activeTarget, isMasterAdmin && selectedTenantId === (wlConfig?.id || 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30'));

  const [enableNaluAsk, setEnableNaluAsk] = useState<boolean>(
    activeTarget?.enableNaluAsk !== false && activeTarget?.theme?.enableNaluAsk !== false
  );
  const [customWidgetKey, setCustomWidgetKey] = useState<string>(
    activeTarget?.theme?.naluWidgetKey || (activeTarget?.naluWidgetKey !== DEFAULT_MASTER_WIDGET_KEY ? activeTarget?.naluWidgetKey || '' : '')
  );
  const [customPortalKey, setCustomPortalKey] = useState<string>(
    activeTarget?.theme?.naluPortalKey || activeTarget?.naluPortalKey || ''
  );
  const [showPortalInput, setShowPortalInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load tenant list when viewed from Master Admin
  useEffect(() => {
    if (!isMasterAdmin || !supabase) return;
    let cancelled = false;
    supabase
      .from('whitelabel_configs')
      .select('id, name, domain, accent, is_active, theme')
      .order('name', { ascending: true })
      .then(({ data }) => {
        if (cancelled || !data) return;
        const active = data.filter((w: any) => {
          if (w.is_active === false || w.theme?.is_active === false) return false;
          const n = String(w.name || '').toLowerCase();
          return !['test', 'deleted', 'finfire', 'noelani', 'leilani', 'leiloe'].some(b => n.includes(b));
        });
        setTenantList(active);
      });
    return () => {
      cancelled = true;
    };
  }, [isMasterAdmin]);

  // Sync form state whenever target network changes
  useEffect(() => {
    const t = activeTarget || wlConfig;
    setEnableNaluAsk(t?.enableNaluAsk !== false && t?.theme?.enableNaluAsk !== false);
    const savedWidget = t?.theme?.naluWidgetKey || '';
    setCustomWidgetKey(savedWidget);
    setCustomPortalKey(t?.theme?.naluPortalKey || t?.naluPortalKey || '');
  }, [activeTarget, wlConfig]);

  const handleSelectTenant = (id: string) => {
    setSelectedTenantId(id);
    if (id === 'master' || id === 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30') {
      const masterMatch = tenantList.find(t => t.id === 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' || t.domain === 'vibenetwork.tv');
      setActiveTarget(masterMatch || wlConfig);
    } else {
      const found = tenantList.find(t => t.id === id);
      if (found) setActiveTarget(found);
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const effectiveWidgetKey = customWidgetKey.trim() || DEFAULT_MASTER_WIDGET_KEY;
  const effectivePortalKey = customPortalKey.trim() || (targetIsMaster ? DEFAULT_MASTER_PORTAL_KEY : '');
  const isUsingDedicatedTenantKb = Boolean(customWidgetKey.trim() && customWidgetKey.trim() !== DEFAULT_MASTER_WIDGET_KEY);

  const handleSaveSettings = async () => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      const targetId = activeTarget?.id === 'master' ? 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' : activeTarget?.id;
      const cleanWidgetKey = customWidgetKey.trim();
      const cleanPortalKey = customPortalKey.trim();

      const { data: currentRow } = await supabase
        .from('whitelabel_configs')
        .select('id, theme')
        .eq('id', targetId)
        .maybeSingle();

      const baseTheme = currentRow?.theme || activeTarget?.theme || {};
      const mergedTheme: any = {
        ...baseTheme,
        enableNaluAsk,
        naluWidgetKey: cleanWidgetKey || undefined,
        naluPortalKey: cleanPortalKey || undefined
      };
      if (!cleanWidgetKey) delete mergedTheme.naluWidgetKey;
      if (!cleanPortalKey) delete mergedTheme.naluPortalKey;

      let savedToDb = false;
      if (currentRow?.id) {
        const { error: updateErr } = await supabase
          .from('whitelabel_configs')
          .update({ theme: mergedTheme })
          .eq('id', currentRow.id);

        if (!updateErr) {
          savedToDb = true;
        } else {
          const sql = `
            UPDATE public.whitelabel_configs
            SET theme = '${JSON.stringify(mergedTheme).replace(/'/g, "''")}'::jsonb
            WHERE id = '${currentRow.id}';
          `;
          const { error: rpcErr } = await supabase.rpc('execute_sql', { sql });
          if (!rpcErr) savedToDb = true;
        }
      }

      // Persist in local overrides as well so virtual/child networks reflect immediately
      try {
        const overrides = JSON.parse(localStorage.getItem('vibe_child_branding_overrides') || '{}');
        overrides[targetId] = {
          ...(overrides[targetId] || {}),
          enableNaluAsk,
          naluWidgetKey: cleanWidgetKey || DEFAULT_MASTER_WIDGET_KEY,
          naluPortalKey: cleanPortalKey,
          updated_at: Date.now()
        };
        localStorage.setItem('vibe_child_branding_overrides', JSON.stringify(overrides));
      } catch {}

      // Update live WhiteLabelContext if editing the currently active tenant
      if (ctxWlConfig && (ctxWlConfig.id === targetId || (ctxWlConfig.id === 'master' && targetIsMaster))) {
        setCtxWlConfig({
          ...ctxWlConfig,
          enableNaluAsk,
          naluWidgetKey: cleanWidgetKey || DEFAULT_MASTER_WIDGET_KEY,
          naluPortalKey: cleanPortalKey,
          theme: mergedTheme
        });
      }

      // Update local tenantList cache if in Master Admin
      setTenantList(prev => prev.map(t => (t.id === targetId ? { ...t, theme: mergedTheme } : t)));
      setActiveTarget((prev: any) => ({
        ...prev,
        enableNaluAsk,
        naluWidgetKey: cleanWidgetKey || DEFAULT_MASTER_WIDGET_KEY,
        naluPortalKey: cleanPortalKey,
        theme: mergedTheme
      }));

      toast.success(
        savedToDb
          ? `Ask Nalu settings saved for ${activeTarget?.name || 'Network'}!`
          : `Ask Nalu settings saved locally for ${activeTarget?.name || 'Network'}!`
      );
    } catch (err: any) {
      toast.error('Failed to save Ask Nalu settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Brain size={36} color={accent} /> Enterprise AI Agent (Ask Nalu)
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '16px' }}>
            Configure your Ask Nalu chat widget, manage per-network AI isolation, and train your knowledge base.
          </p>
        </div>

        {/* Master Admin Tenant Switcher */}
        {isMasterAdmin && tenantList.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '280px' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={13} color={accent} /> Configure Network Target
            </label>
            <select
              value={selectedTenantId}
              onChange={e => handleSelectTenant(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="adb92e36-5ebc-4dc3-ae96-429f3dc1bb30" style={{ background: '#111' }}>
                Vibe Network (Global Master Default)
              </option>
              {tenantList
                .filter(t => t.id !== 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' && t.domain !== 'vibenetwork.tv')
                .map(t => (
                  <option key={t.id} value={t.id} style={{ background: '#111' }}>
                    {t.name} ({t.domain || 'tenant'})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Per-Tenant Configuration Panel */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '18px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: enableNaluAsk ? 'rgba(0, 204, 102, 0.12)' : 'rgba(255, 255, 255, 0.05)',
              color: enableNaluAsk ? '#00cc66' : '#888',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Power size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Ask Nalu Chat Bubble — {activeTarget?.name || 'Vibe Network'}</span>
                <span style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  background: !enableNaluAsk
                    ? 'rgba(255, 59, 48, 0.15)'
                    : isUsingDedicatedTenantKb
                      ? 'rgba(0, 204, 102, 0.15)'
                      : 'rgba(0, 136, 255, 0.15)',
                  color: !enableNaluAsk
                    ? '#ff5b52'
                    : isUsingDedicatedTenantKb
                      ? '#00cc66'
                      : '#4da6ff'
                }}>
                  {!enableNaluAsk
                    ? 'Disabled'
                    : isUsingDedicatedTenantKb
                      ? 'Dedicated Tenant KB'
                      : targetIsMaster
                        ? 'Global Master KB'
                        : 'Inheriting Vibe Global KB'}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>
                {enableNaluAsk
                  ? (isUsingDedicatedTenantKb
                      ? 'Visitors on this network chat with this network’s dedicated Ask Nalu knowledge base.'
                      : 'Visitors on this network chat with the Vibe Network ecosystem AI assistant unless a dedicated Widget Key is set below.')
                  : 'The floating Ask Nalu assistant bubble is currently hidden on this network.'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEnableNaluAsk(prev => !prev)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: `1px solid ${enableNaluAsk ? 'rgba(0, 204, 102, 0.35)' : 'rgba(255,255,255,0.15)'}`,
              background: enableNaluAsk ? 'rgba(0, 204, 102, 0.14)' : 'rgba(255,255,255,0.05)',
              color: enableNaluAsk ? '#00ff88' : '#ccc',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {enableNaluAsk ? 'Widget Enabled (Click to Hide)' : 'Widget Hidden (Click to Enable)'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={13} color={accent} /> Custom Widget Embed Key (Optional)
            </label>
            <input
              type="text"
              value={customWidgetKey}
              onChange={e => setCustomWidgetKey(e.target.value)}
              placeholder={`Default: ${DEFAULT_MASTER_WIDGET_KEY}`}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.45)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Leave blank to use Vibe Network’s shared assistant (`{DEFAULT_MASTER_WIDGET_KEY}`), or paste a dedicated NaluAsk widget key.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={13} color={accent} /> Dedicated KB Portal Key (Optional)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type={showPortalInput ? 'text' : 'password'}
                value={customPortalKey}
                onChange={e => setCustomPortalKey(e.target.value)}
                placeholder={targetIsMaster ? 'Using Vibe Master KB Portal Key' : 'cpk_... (enter your network portal key)'}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.45)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPortalInput(s => !s)}
                style={{
                  padding: '0 14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {showPortalInput ? 'Hide' : 'Show'}
              </button>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Stored securely in this network’s configuration for quick sign-in to the Interactive KB Console below.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveSettings}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '10px',
              background: accent,
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '14px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              transition: 'filter 0.2s'
            }}
            onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.12)')}
            onMouseOut={e => (e.currentTarget.style.filter = 'none')}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Ask Nalu Settings'}
          </button>
        </div>
      </div>

      {/* Active Credentials Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <CredentialCard
          title="Active Widget Embed Key"
          val={effectiveWidgetKey}
          id="widget"
          copiedKey={copiedKey}
          onCopy={handleCopy}
          accent={accent}
        />
        <CredentialCard
          title="KB Portal Key"
          val={effectivePortalKey || 'Not configured for this tenant'}
          id="portal"
          copiedKey={copiedKey}
          onCopy={handleCopy}
          accent={accent}
          isSensitive={Boolean(effectivePortalKey)}
          disabled={!effectivePortalKey}
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
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
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
            <li><strong>Add FAQ / Text</strong>: Ideal for bot role instructions, product manuals, bios, or custom FAQs directly in text form.</li>
            <li><strong>URL Crawl</strong> (Admin-only): Auto-crawl documentation or sitemaps (contact support to enable).</li>
          </ul>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={18} color={accent} /> What The Portal Shows You
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
            <li><strong>My Documents</strong>: View all uploaded files with indexed passage counts and status.</li>
            <li><strong>Query History & Test Your KB</strong>: Test live answers and monitor visitor questions asked to Ask Nalu.</li>
            <li><strong>Instant Synced Updates</strong>: Re-uploading a document replaces the old version and re-indexes new contents automatically.</li>
          </ul>
        </div>
      </div>

      {/* Embedded Portal iframe */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>Interactive KB Portal Console</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {effectivePortalKey
              ? 'Copy your KB Portal Key above and sign in below to manage documents.'
              : 'Request a dedicated tenant KB Portal Key from Vibe Enterprise Support to manage an isolated knowledge base.'}
          </span>
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
              background: '#0b0e14'
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CredentialCard({ title, val, id, copiedKey, onCopy, accent, isSensitive = false, disabled = false }: any) {
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
          color: disabled ? 'rgba(255,255,255,0.35)' : (isSensitive && !showSensitive ? 'rgba(255,255,255,0.3)' : '#fff'),
          letterSpacing: isSensitive && !showSensitive ? '2px' : 'normal'
        }}>
          {isSensitive && !showSensitive ? '••••••••••••••••••••••••••••••••••••••••' : val}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {isSensitive && !disabled && (
          <button
            type="button"
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
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          >
            {showSensitive ? 'Hide' : 'Show'}
          </button>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onCopy(val, id)}
          style={{
            flex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            background: disabled ? 'rgba(255,255,255,0.06)' : (isCopied ? '#00cc66' : accent),
            color: disabled ? '#777' : '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.15)'; }}
          onMouseOut={e => { e.currentTarget.style.filter = 'none'; }}
        >
          {isCopied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
        </button>
      </div>
    </div>
  );
}
