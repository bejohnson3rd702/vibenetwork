import React, { useState } from 'react';
import { X, Users, Film, Layout, Mail, Type, Sparkles } from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

import { HeroEditorTab } from './admin/HeroEditorTab';
import { BrandingTab } from './admin/BrandingTab';
import { SlidersTab } from './admin/SlidersTab';
import { PagesTab } from './admin/PagesTab';
import { InboxTab } from './admin/InboxTab';
import { WalletTab } from './admin/WalletTab';
import { AnalyticsTab } from './admin/AnalyticsTab';
import { VideosTab } from './admin/VideosTab';
import { BarChart3 } from 'lucide-react';
import { N2NFleetTab } from './admin/N2NFleetTab';
import { N2NUsersTab } from './admin/N2NUsersTab';
import { N2NLedgerTab } from './admin/N2NLedgerTab';
import { N2NBrandingTab } from './admin/N2NBrandingTab';
import { Network, BookUser, Receipt, Palette, Brain, Languages } from 'lucide-react';
import { EnterpriseAiTab } from './admin/EnterpriseAiTab';
import { TranslationTab } from './admin/TranslationTab';

export default function BusinessAdminDashboard({ onClose }: { onClose: () => void }) {
  const { wlConfig } = useWhiteLabel();
  const [activeTab, setActiveTab] = useState('analytics');

  return (
     <div style={{ position: 'fixed', inset: 0, background: 'var(--content-bg)', color: 'var(--text-primary)', zIndex: 999999, display: 'flex', flexDirection: 'column' }}>
       {/* Header */}
       <div style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: 40, height: 40, borderRadius: 8, background: wlConfig.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
               {wlConfig.name.substring(0, 2).toUpperCase()}
             </div>
             <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '1px' }}>{wlConfig.name} Network OS</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <X size={28} />
          </button>
       </div>
       
       <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ width: '280px', background: 'var(--bg-color)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
             
             <button onClick={() => setActiveTab('analytics')} style={{ padding: '16px 20px', background: activeTab === 'analytics' ? wlConfig.accent : 'transparent', color: activeTab === 'analytics' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <BarChart3 size={22} /> Analytics Engine
             </button>

             <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />

             <button onClick={() => setActiveTab('hero')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: activeTab === 'hero' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: activeTab === 'hero' ? '#fff' : '#888', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>
                <Type size={22} /> Hero Display Module
             </button>

             <button onClick={() => setActiveTab('branding')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: activeTab === 'branding' ? wlConfig.accent : 'transparent', color: activeTab === 'branding' ? '#fff' : '#888', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', transition: '0.2s' }}>
                <Sparkles size={22} /> Global Branding
             </button>

             <button onClick={() => setActiveTab('videos')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: activeTab === 'videos' ? wlConfig.accent : 'transparent', color: activeTab === 'videos' ? '#fff' : '#888', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', transition: '0.2s' }}>
                <Film size={22} /> Videos & Playlists
             </button>
             
             {/* 
             <button onClick={() => setActiveTab('sliders')} style={{ padding: '16px 20px', background: activeTab === 'sliders' ? wlConfig.accent : 'transparent', color: activeTab === 'sliders' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Film size={22} /> Grid & Sliders Data
             </button>
             */}

             <button onClick={() => setActiveTab('pages')} style={{ padding: '16px 20px', background: activeTab === 'pages' ? wlConfig.accent : 'transparent', color: activeTab === 'pages' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Layout size={22} /> About & Custom Hubs
             </button>

             <button onClick={() => setActiveTab('inbox')} style={{ padding: '16px 20px', background: activeTab === 'inbox' ? wlConfig.accent : 'transparent', color: activeTab === 'inbox' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Mail size={22} /> Ingest Leads (Inbox)
             </button>

             <button onClick={() => setActiveTab('enterprise-ai')} style={{ padding: '16px 20px', background: activeTab === 'enterprise-ai' ? wlConfig.accent : 'transparent', color: activeTab === 'enterprise-ai' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Brain size={22} /> Enterprise AI (NaluAsk)
             </button>

             <button onClick={() => setActiveTab('translation')} style={{ padding: '16px 20px', background: activeTab === 'translation' ? wlConfig.accent : 'transparent', color: activeTab === 'translation' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Languages size={22} /> WWTC Translation
             </button>

             <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />

              <button onClick={() => setActiveTab('wallet')} style={{ padding: '16px 20px', background: activeTab === 'wallet' ? wlConfig.accent : 'transparent', color: activeTab === 'wallet' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                 <Users size={22} /> Monetization CRM
              </button>

              {wlConfig.n2n_enabled && (
                <>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />
                  <div style={{ padding: '8px 20px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: wlConfig.accent, opacity: 0.8 }}>N2N Command Center</div>
                  
                  <button onClick={() => setActiveTab('n2n-fleet')} style={{ padding: '16px 20px', background: activeTab === 'n2n-fleet' ? wlConfig.accent : 'transparent', color: activeTab === 'n2n-fleet' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                     <Network size={22} /> Child Network Fleet
                  </button>

                  <button onClick={() => setActiveTab('n2n-users')} style={{ padding: '16px 20px', background: activeTab === 'n2n-users' ? wlConfig.accent : 'transparent', color: activeTab === 'n2n-users' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                     <BookUser size={22} /> Network Users
                  </button>

                  <button onClick={() => setActiveTab('n2n-ledger')} style={{ padding: '16px 20px', background: activeTab === 'n2n-ledger' ? wlConfig.accent : 'transparent', color: activeTab === 'n2n-ledger' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                     <Receipt size={22} /> Network Ledger
                  </button>

                  <button onClick={() => setActiveTab('n2n-branding')} style={{ padding: '16px 20px', background: activeTab === 'n2n-branding' ? wlConfig.accent : 'transparent', color: activeTab === 'n2n-branding' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                     <Palette size={22} /> Child Branding Editor
                  </button>
                </>
              )}
          </div>
          
          {/* Main Workspace */}
          <div style={{ flex: 1, padding: '60px 80px', overflowY: 'auto' }}>
            {activeTab === 'analytics' && <AnalyticsTab wlConfig={wlConfig} />}
            {activeTab === 'hero' && <HeroEditorTab wlConfig={wlConfig} />}
            {activeTab === 'branding' && <BrandingTab wlConfig={wlConfig} />}
            {activeTab === 'videos' && <VideosTab wlConfig={wlConfig} />}
            {/* {activeTab === 'sliders' && <SlidersTab wlConfig={wlConfig} />} */}
            {activeTab === 'pages' && <PagesTab wlConfig={wlConfig} />}
            {activeTab === 'inbox' && <InboxTab wlConfig={wlConfig} />}
            {activeTab === 'enterprise-ai' && <EnterpriseAiTab wlConfig={wlConfig} />}
            {activeTab === 'translation' && <TranslationTab wlConfig={wlConfig} />}
            {activeTab === 'wallet' && <WalletTab wlConfig={wlConfig} />}
            {activeTab === 'n2n-fleet' && <N2NFleetTab wlConfig={wlConfig} />}
            {activeTab === 'n2n-users' && <N2NUsersTab wlConfig={wlConfig} />}
            {activeTab === 'n2n-ledger' && <N2NLedgerTab wlConfig={wlConfig} />}
            {activeTab === 'n2n-branding' && <N2NBrandingTab wlConfig={wlConfig} />}
          </div>
       </div>
       <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
     </div>
  );
}
