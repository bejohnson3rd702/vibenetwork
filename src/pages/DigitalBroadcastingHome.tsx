import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Tv, 
  Network, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Sliders, 
  Users, 
  Share2, 
  BarChart3,
  ExternalLink
} from 'lucide-react';
import type { WlConfig } from '../lib/whitelabel';

interface DigitalBroadcastingHomeProps {
  wlConfig: WlConfig;
}

export default function DigitalBroadcastingHome({ wlConfig }: DigitalBroadcastingHomeProps) {
  const accent = wlConfig?.accent || '#0066FF';
  const [activeTab, setActiveTab] = useState<'both' | 'channel' | 'network'>('both');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div style={{ background: '#07090E', color: '#F1F5F9', minHeight: '100vh', paddingBottom: '120px' }}>
      {/* ── Background Ambient Glow ── */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '600px',
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${accent}25, transparent 75%)`,
          pointerEvents: 'none',
          zIndex: 0
        }} 
      />

      {/* ── Sticky Top Bar / Action Nav ── */}
      <nav 
        style={{
          position: 'sticky',
          top: 60,
          zIndex: 40,
          background: 'rgba(7, 9, 14, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 24px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: 'rgba(0, 102, 255, 0.12)', 
              color: accent, 
              border: `1px solid ${accent}40`,
              fontSize: '11px', 
              fontWeight: 700, 
              letterSpacing: '1px', 
              textTransform: 'uppercase', 
              padding: '4px 10px', 
              borderRadius: '20px' 
            }}>
              <FileText size={12} /> Strategic Business Whitepaper
            </span>
            <span style={{ fontSize: '13px', color: '#94A3B8', display: 'none' }} className="sm:inline">
              Vibe Network Architecture
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleShare}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#CBD5E1',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
            >
              <Share2 size={13} />
              {copiedLink ? 'Link Copied!' : 'Share'}
            </button>

            <a
              href="/benefits_of_owning_a_channel_and_network.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Vibe_Strategic_Whitepaper_The_Power_of_Digital_Broadcasting.pdf"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: accent,
                color: '#FFFFFF',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textDecoration: 'none',
                boxShadow: `0 4px 14px ${accent}40`,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1.0)')}
            >
              <Download size={13} />
              Download PDF
            </a>
          </div>
        </div>
      </nav>

      {/* ── Main Document Container ── */}
      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 10 }}>
        
        {/* ── Document Header ── */}
        <header style={{ marginBottom: '56px', textAlign: 'center', paddingTop: '20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ 
              display: 'inline-block', 
              color: '#38BDF8', 
              fontSize: '12px', 
              fontWeight: 800, 
              letterSpacing: '2.5px', 
              textTransform: 'uppercase',
              marginBottom: '16px' 
            }}>
              STRATEGIC BUSINESS WHITEPAPER
            </div>
            
            <h1 style={{ 
              fontSize: 'clamp(32px, 5vw, 54px)', 
              fontWeight: 900, 
              lineHeight: 1.15, 
              letterSpacing: '-1.5px', 
              margin: '0 0 16px 0',
              color: '#FFFFFF'
            }}>
              The Power of Digital Broadcasting
            </h1>

            <p style={{ 
              fontSize: 'clamp(17px, 2.5vw, 22px)', 
              color: '#94A3B8', 
              fontWeight: 500, 
              maxWidth: '780px', 
              margin: '0 auto 28px auto',
              lineHeight: 1.45
            }}>
              Owning a Channel vs. Owning a Network on the Vibe Platform
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '12px',
              color: '#64748B'
            }}>
              <span>Confidential Executive Brief</span>
              <span>•</span>
              <span style={{ color: '#38BDF8' }}>N2N Architecture</span>
              <span>•</span>
              <span>Vibe Platform Core</span>
            </div>
          </motion.div>
        </header>

        {/* ── Document Section 1: Introduction ── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ 
            marginBottom: '48px', 
            background: 'rgba(15, 23, 42, 0.65)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '16px',
            padding: '36px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '4px', 
            background: `linear-gradient(90deg, ${accent}, #38BDF8)` 
          }} />

          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 800, 
            color: '#FFFFFF', 
            letterSpacing: '-0.5px', 
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ color: accent }}>1.</span> Introduction: Digital Media Sovereignty
          </h2>

          <p style={{ 
            fontSize: '16px', 
            lineHeight: 1.8, 
            color: '#CBD5E1', 
            margin: '0 0 24px 0' 
          }}>
            In the modern digital economy, audience attention and content distribution represent the most valuable
            real estate. Traditional centralized media platforms hold absolute control over visibility, monetization, and
            policy guidelines, leaving creators and brands vulnerable. Building on the <strong style={{ color: '#FFFFFF' }}>Vibe Platform</strong> provides
            creators and businesses with <em>digital media sovereignty</em>. Understanding whether to operate as a
            standalone <strong>Channel</strong> or scale into a multi-tenant <strong>Network</strong> is a core business decision.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.06)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              borderRadius: '12px', 
              padding: '20px' 
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#F87171', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Centralized Platform Vulnerability
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#94A3B8', fontSize: '13px', lineHeight: 1.6 }}>
                <li>Hostage to opaque algorithmic changes</li>
                <li>Heavy revenue splits & platform take rates</li>
                <li>Zero direct audience ownership or customer data</li>
              </ul>
            </div>

            <div style={{ 
              background: 'rgba(0, 102, 255, 0.08)', 
              border: `1px solid ${accent}40`, 
              borderRadius: '12px', 
              padding: '20px' 
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Vibe Media Sovereignty
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#94A3B8', fontSize: '13px', lineHeight: 1.6 }}>
                <li>Direct relationship & 100% customer attention capture</li>
                <li>Direct-to-consumer monetization (tips, subs, store, calls)</li>
                <li>Whitelabel freedom with custom domain & branding</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* ── View Filter Controls for Section 2 & 3 ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex', 
            background: 'rgba(15, 23, 42, 0.8)', 
            padding: '4px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.08)' 
          }}>
            <button
              onClick={() => setActiveTab('both')}
              style={{
                background: activeTab === 'both' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: activeTab === 'both' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              All Sections
            </button>
            <button
              onClick={() => setActiveTab('channel')}
              style={{
                background: activeTab === 'channel' ? accent : 'transparent',
                color: activeTab === 'channel' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Channel Model
            </button>
            <button
              onClick={() => setActiveTab('network')}
              style={{
                background: activeTab === 'network' ? '#0284C7' : 'transparent',
                color: activeTab === 'network' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Network Model (N2N)
            </button>
          </div>
        </div>

        {/* ── Document Section 2: Benefits of Owning a Channel ── */}
        {(activeTab === 'both' || activeTab === 'channel') && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ 
              marginBottom: '56px', 
              background: 'rgba(15, 23, 42, 0.5)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '16px',
              padding: '36px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ 
                background: 'rgba(0, 102, 255, 0.15)', 
                color: accent, 
                padding: '6px', 
                borderRadius: '10px', 
                display: 'inline-flex' 
              }}>
                <Tv size={22} />
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px', margin: 0 }}>
                2. Benefits of Owning a Channel
              </h2>
            </div>

            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#94A3B8', margin: '0 0 28px 0', maxWidth: '900px' }}>
              A Channel is a targeted, single-stream broadcasting hub focused on a specific brand, niche, or creator. It
              is optimized for content delivery, viewer intimacy, and immediate monetization.
            </p>

            {/* 4 Channel Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60A5FA', fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>
                  <ShieldCheck size={18} />
                  Direct Relationship & Attention Capture
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#94A3B8', margin: 0 }}>
                  Your audience connects with your brand in a dedicated, high-fidelity environment. Without competing algorithms or recommendation sidebars, engagement remains focused entirely on your content.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60A5FA', fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>
                  <DollarSign size={18} />
                  Monetization Flexibility
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#94A3B8', margin: 0 }}>
                  Channel owners directly integrate direct-to-consumer monetization features, including customizable live tipping, premium video-on-demand subscriptions, booking calendars for consulting/live training calls, and direct e-commerce shopping.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60A5FA', fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>
                  <Sliders size={18} />
                  Frictionless Customization
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#94A3B8', margin: 0 }}>
                  Express your brand identity by selecting custom color accents, logo assets, layout styling, and scheduling without constraints.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60A5FA', fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>
                  <TrendingUp size={18} />
                  Low Operational Overhead
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#94A3B8', margin: 0 }}>
                  Setup is instantaneous. Creators can focus 100% of their energy on producing high-quality live streams, engaging their community, and selling products.
                </p>
              </div>
            </div>

            {/* Optimal Use Case Box */}
            <div style={{ 
              background: 'rgba(0, 102, 255, 0.05)', 
              borderLeft: `4px solid ${accent}`, 
              borderRadius: '0 12px 12px 0', 
              padding: '16px 20px',
              fontSize: '14px',
              color: '#CBD5E1',
              lineHeight: 1.6
            }}>
              <strong style={{ color: '#FFFFFF' }}>Optimal Use Case:</strong> Individual content creators, fitness trainers (e.g., Mr. Olympia champions), R&B artists (e.g., B2K), coaches, and boutique e-commerce brands.
            </div>
          </motion.section>
        )}

        {/* ── Document Section 3: Benefits of Owning a Network (N2N) ── */}
        {(activeTab === 'both' || activeTab === 'network') && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ 
              marginBottom: '56px', 
              background: 'rgba(15, 23, 42, 0.5)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '16px',
              padding: '36px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ 
                background: 'rgba(2, 132, 199, 0.15)', 
                color: '#38BDF8', 
                padding: '6px', 
                borderRadius: '10px', 
                display: 'inline-flex' 
              }}>
                <Network size={22} />
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px', margin: 0 }}>
                3. Benefits of Owning a Network (N2N Architecture)
              </h2>
            </div>

            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#94A3B8', margin: '0 0 28px 0', maxWidth: '900px' }}>
              A Network is a comprehensive digital media conglomerate. Utilizing Vibe's <strong style={{ color: '#FFFFFF' }}>Network-to-Network (N2N)</strong> architecture,
              a network owner acts as the platform landlord, hosting and syndicating multiple child channels under a unified brand.
            </p>

            {/* 4 Network Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38BDF8', fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>
                  <Users size={18} />
                  Scale via Aggregation (The Platform Effect)
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#94A3B8', margin: 0 }}>
                  Instead of being restricted by your own content output, your platform scales as child channels create content. You leverage the combined audiences of every hosted creator.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38BDF8', fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>
                  <Layers size={18} />
                  Enterprise Revenue Models
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#94A3B8', margin: 0 }}>
                  Network owners build highly scalable revenue streams, taking custom rev-shares from child channel transactions, charging subscription fees for advanced channel builder tools, and controlling premium ad insertion.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38BDF8', fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>
                  <Sparkles size={18} />
                  Instant Multi-Tenant Brand Syndication
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#94A3B8', margin: 0 }}>
                  Launch customized child networks with a single click. For example, a collegiate network (like AVO) can syndicate individual child networks for distinct university sports programs, each with custom logos, stores, and tickers, while maintaining central control.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38BDF8', fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>
                  <BarChart3 size={18} />
                  Enhanced Asset Valuation
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#94A3B8', margin: 0 }}>
                  Media networks command significantly higher exit multiples (often 8x - 15x EBITDA) than individual channels, as their revenue is diversified across dozens of independent creators and sub-brands.
                </p>
              </div>
            </div>

            {/* Optimal Use Case Box */}
            <div style={{ 
              background: 'rgba(2, 132, 199, 0.06)', 
              borderLeft: '4px solid #38BDF8', 
              borderRadius: '0 12px 12px 0', 
              padding: '16px 20px',
              fontSize: '14px',
              color: '#CBD5E1',
              lineHeight: 1.6
            }}>
              <strong style={{ color: '#FFFFFF' }}>Optimal Use Case:</strong> Sports leagues, corporate parent companies, franchise operations, and ambitious digital media entrepreneurs.
            </div>
          </motion.section>
        )}

        {/* ── Document Section 4: Feature & Metric Comparison Matrix ── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ 
            marginBottom: '56px', 
            background: 'rgba(15, 23, 42, 0.6)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '16px',
            padding: '36px',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ 
              background: 'rgba(99, 102, 241, 0.15)', 
              color: '#818CF8', 
              padding: '6px', 
              borderRadius: '10px', 
              display: 'inline-flex' 
            }}>
              <BarChart3 size={22} />
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px', margin: 0 }}>
              4. Feature & Metric Comparison
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'separate', 
              borderSpacing: 0, 
              textAlign: 'left',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', width: '28%' }}>
                    Strategic Dimension
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#60A5FA', textTransform: 'uppercase', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', width: '36%' }}>
                    Channel Model
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#38BDF8', textTransform: 'uppercase', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', width: '36%' }}>
                    Network Model (N2N)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
                  <td style={{ padding: '18px 20px', fontWeight: 700, color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px' }}>
                    Value Proposition
                  </td>
                  <td style={{ padding: '18px 20px', color: '#CBD5E1', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px' }}>
                    Content expertise & direct viewer engagement
                  </td>
                  <td style={{ padding: '18px 20px', color: '#CBD5E1', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px', background: 'rgba(2, 132, 199, 0.04)' }}>
                    Distribution infrastructure & brand ecosystem
                  </td>
                </tr>

                <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                  <td style={{ padding: '18px 20px', fontWeight: 700, color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px' }}>
                    Primary Revenue
                  </td>
                  <td style={{ padding: '18px 20px', color: '#CBD5E1', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px' }}>
                    Tips, merchandise, bookings, premium subs
                  </td>
                  <td style={{ padding: '18px 20px', color: '#CBD5E1', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px', background: 'rgba(2, 132, 199, 0.04)' }}>
                    Platform rev-share, network ads, SaaS fees
                  </td>
                </tr>

                <tr style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
                  <td style={{ padding: '18px 20px', fontWeight: 700, color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px' }}>
                    Content Dependency
                  </td>
                  <td style={{ padding: '18px 20px', color: '#CBD5E1', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px' }}>
                    <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', fontWeight: 600, fontSize: '12px' }}>
                      High
                    </span> (Requires constant content creation)
                  </td>
                  <td style={{ padding: '18px 20px', color: '#CBD5E1', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px', background: 'rgba(2, 132, 199, 0.04)' }}>
                    <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', fontWeight: 600, fontSize: '12px' }}>
                      Low
                    </span> (Leverages child channel content creators)
                  </td>
                </tr>

                <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                  <td style={{ padding: '18px 20px', fontWeight: 700, color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px' }}>
                    Audience Scaling
                  </td>
                  <td style={{ padding: '18px 20px', color: '#CBD5E1', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px' }}>
                    Linear (Grows through direct acquisition)
                  </td>
                  <td style={{ padding: '18px 20px', color: '#CBD5E1', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '14px', background: 'rgba(2, 132, 199, 0.04)' }}>
                    <strong style={{ color: '#38BDF8' }}>Exponential</strong> (Compound growth of all child channels)
                  </td>
                </tr>

                <tr style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
                  <td style={{ padding: '18px 20px', fontWeight: 700, color: '#FFFFFF', fontSize: '14px' }}>
                    Valuation Multiple
                  </td>
                  <td style={{ padding: '18px 20px', color: '#CBD5E1', fontSize: '14px' }}>
                    1x - 3x annual net earnings
                  </td>
                  <td style={{ padding: '18px 20px', color: '#38BDF8', fontWeight: 800, fontSize: '15px', background: 'rgba(2, 132, 199, 0.08)' }}>
                    8x - 15x+ annual platform EBITDA
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* ── Document Section 5: Strategic Recommendation ── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ 
            marginBottom: '60px', 
            background: `radial-gradient(ellipse at bottom, ${accent}15, rgba(15, 23, 42, 0.7) 70%)`,
            border: `1px solid ${accent}40`, 
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center'
          }}
        >
          <div style={{ 
            display: 'inline-block', 
            color: '#38BDF8', 
            fontSize: '12px', 
            fontWeight: 800, 
            letterSpacing: '2px', 
            textTransform: 'uppercase',
            marginBottom: '12px' 
          }}>
            STRATEGIC ADVISORY
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px', margin: '0 0 20px 0' }}>
            5. Strategic Recommendation
          </h2>

          <p style={{ 
            fontSize: '17px', 
            lineHeight: 1.8, 
            color: '#E2E8F0', 
            maxWidth: '840px', 
            margin: '0 auto 32px auto',
            fontWeight: 400
          }}>
            For entities establishing their initial audience footprint, starting with a <strong style={{ color: '#FFFFFF' }}>Channel</strong> is the most capital-efficient path to product-market fit. However, the ultimate goal of long-term scaling is transition into a <strong style={{ color: '#38BDF8' }}>Network</strong>. By owning the platform, you insulate your business from individual channel churn, capture rich network-wide data, and construct an investable, institutional-grade media asset.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href="/benefits_of_owning_a_channel_and_network.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Vibe_Strategic_Whitepaper_The_Power_of_Digital_Broadcasting.pdf"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: accent,
                color: '#FFFFFF',
                padding: '12px 28px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textDecoration: 'none',
                boxShadow: `0 8px 24px ${accent}50`,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1.0)')}
            >
              <Download size={16} />
              Download Complete Whitepaper (PDF)
            </a>
          </div>
        </motion.section>

        {/* ── Document Footer ── */}
        <footer style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
          paddingTop: '28px', 
          textAlign: 'center',
          color: '#64748B',
          fontSize: '12px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          fontWeight: 700
        }}>
          POWERED BY VIBE NETWORK ARCHITECTURE • CONFIDENTIAL STRATEGIC WHITEPAPER
        </footer>

      </main>
    </div>
  );
}
