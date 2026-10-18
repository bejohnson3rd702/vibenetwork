import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Share2, 
  ArrowLeft,
  Check
} from 'lucide-react';
import type { WlConfig } from '../lib/whitelabel';

interface DigitalBroadcastingHomeProps {
  wlConfig: WlConfig;
}

export default function DigitalBroadcastingHome({ wlConfig }: DigitalBroadcastingHomeProps) {
  const [viewMode, setViewMode] = useState<'document' | 'pdf'>('document');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh', color: '#0F172A', paddingBottom: '80px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      {/* ── Document Control Toolbar ── */}
      <div 
        style={{
          position: 'sticky',
          top: 60,
          zIndex: 40,
          background: 'rgba(11, 15, 25, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 24px'
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: 'rgba(37, 99, 235, 0.15)', 
              color: '#3B82F6', 
              fontSize: '11px', 
              fontWeight: 700, 
              letterSpacing: '1px', 
              textTransform: 'uppercase', 
              padding: '4px 10px', 
              borderRadius: '6px' 
            }}>
              <FileText size={13} /> Official Strategic Whitepaper
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* View Mode Toggle: Interactive Document vs Original PDF */}
            <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.08)', padding: '3px', borderRadius: '8px' }}>
              <button
                onClick={() => setViewMode('document')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: viewMode === 'document' ? '#2563EB' : 'transparent',
                  color: viewMode === 'document' ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FileText size={12} /> Document UI
              </button>
              <button
                onClick={() => setViewMode('pdf')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: viewMode === 'pdf' ? '#2563EB' : 'transparent',
                  color: viewMode === 'pdf' ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Eye size={12} /> Original PDF
              </button>
            </div>

            <button
              onClick={handleShare}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#E2E8F0',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {copiedLink ? <Check size={12} color="#10B981" /> : <Share2 size={12} />}
              {copiedLink ? 'Copied' : 'Share'}
            </button>

            <a
              href="/benefits_of_owning_a_channel_and_network.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="benefits_of_owning_a_channel_and_network.pdf"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#2563EB',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <Download size={13} />
              Download PDF
            </a>
          </div>

        </div>
      </div>

      {/* ── Content Area ── */}
      <div style={{ maxWidth: '960px', margin: '32px auto 0 auto', padding: '0 16px' }}>

        {viewMode === 'pdf' ? (
          /* ── PDF Embed View ── */
          <div style={{ 
            background: '#FFFFFF', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            height: '85vh'
          }}>
            <iframe 
              src="/benefits_of_owning_a_channel_and_network.pdf#toolbar=1" 
              title="Benefits of Owning a Channel and Network PDF"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        ) : (
          /* ── Whitepaper Document View (matching the PDF exactly) ── */
          <motion.article 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: 'clamp(32px, 5vw, 64px) clamp(24px, 6vw, 72px)',
              color: '#1E293B',
              lineHeight: 1.7,
              fontSize: '15px'
            }}
          >
            {/* ── Page 1: Header & Title ── */}
            <header style={{ marginBottom: '32px' }}>
              <div style={{ 
                color: '#64748B', 
                fontSize: '11px', 
                fontWeight: 700, 
                letterSpacing: '2px', 
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}>
                STRATEGIC BUSINESS WHITEPAPER
              </div>

              <h1 style={{ 
                fontSize: 'clamp(28px, 4vw, 38px)', 
                fontWeight: 900, 
                color: '#0F172A', 
                lineHeight: 1.2, 
                letterSpacing: '-0.5px',
                margin: '0 0 12px 0'
              }}>
                The Power of Digital Broadcasting
              </h1>

              <p style={{ 
                fontSize: '17px', 
                color: '#475569', 
                fontWeight: 500, 
                margin: '0 0 24px 0' 
              }}>
                Owning a Channel vs. Owning a Network on the Vibe Platform
              </p>

              <div style={{ height: '3px', background: '#2563EB', width: '100%', borderRadius: '2px' }} />
            </header>

            {/* ── Section 1: Introduction ── */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 800, 
                color: '#1D4ED8', 
                margin: '0 0 16px 0',
                letterSpacing: '-0.3px'
              }}>
                1. Introduction: Digital Media Sovereignty
              </h2>

              <p style={{ color: '#334155', fontSize: '15px', lineHeight: 1.75, margin: 0 }}>
                In the modern digital economy, audience attention and content distribution represent the most valuable
                real estate. Traditional centralized media platforms hold absolute control over visibility, monetization, and
                policy guidelines, leaving creators and brands vulnerable. Building on the <strong>Vibe Platform</strong> provides
                creators and businesses with <strong>digital media sovereignty</strong>. Understanding whether to operate as a
                standalone <strong>Channel</strong> or scale into a multi-tenant <strong>Network</strong> is a core business decision.
              </p>
            </section>

            {/* ── Section 2: Benefits of Owning a Channel ── */}
            <section style={{ marginBottom: '48px', borderTop: '1px solid #E2E8F0', paddingTop: '32px' }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 800, 
                color: '#1D4ED8', 
                margin: '0 0 16px 0',
                letterSpacing: '-0.3px'
              }}>
                2. Benefits of Owning a Channel
              </h2>

              <p style={{ color: '#334155', fontSize: '15px', lineHeight: 1.75, margin: '0 0 20px 0' }}>
                A Channel is a targeted, single-stream broadcasting hub focused on a specific brand, niche, or creator. It
                is optimized for content delivery, viewer intimacy, and immediate monetization.
              </p>

              <ul style={{ listStyleType: 'disc', paddingLeft: '24px', margin: '0 0 24px 0', color: '#334155' }}>
                <li style={{ marginBottom: '14px', lineHeight: 1.65 }}>
                  <strong style={{ color: '#0F172A' }}>Direct Relationship & Attention Capture:</strong> Your audience connects with your brand in a dedicated,
                  high-fidelity environment. Without competing algorithms or recommendation sidebars, engagement
                  remains focused entirely on your content.
                </li>
                <li style={{ marginBottom: '14px', lineHeight: 1.65 }}>
                  <strong style={{ color: '#0F172A' }}>Monetization Flexibility:</strong> Channel owners directly integrate direct-to-consumer monetization
                  features, including customizable live tipping, premium video-on-demand subscriptions, booking
                  calendars for consulting/live training calls, and direct e-commerce shopping.
                </li>
                <li style={{ marginBottom: '14px', lineHeight: 1.65 }}>
                  <strong style={{ color: '#0F172A' }}>Frictionless Customization:</strong> Express your brand identity by selecting custom color accents, logo
                  assets, layout styling, and scheduling without constraints.
                </li>
                <li style={{ marginBottom: '14px', lineHeight: 1.65 }}>
                  <strong style={{ color: '#0F172A' }}>Low Operational Overhead:</strong> Setup is instantaneous. Creators can focus 100% of their energy on
                  producing high-quality live streams, engaging their community, and selling products.
                </li>
              </ul>

              {/* Optimal Use Case Box */}
              <div style={{
                background: '#F8FAFC',
                borderLeft: '4px solid #2563EB',
                padding: '16px 20px',
                borderRadius: '0 6px 6px 0',
                color: '#334155',
                fontSize: '14.5px',
                lineHeight: 1.6
              }}>
                <strong style={{ color: '#0F172A' }}>Optimal Use Case:</strong> Individual content creators, fitness trainers (e.g., Mr. Olympia champions),
                R&B artists (e.g., B2K), coaches, and boutique e-commerce brands.
              </div>
            </section>

            {/* ── Section 3: Benefits of Owning a Network (N2N Architecture) ── */}
            <section style={{ marginBottom: '48px', borderTop: '1px solid #E2E8F0', paddingTop: '32px' }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 800, 
                color: '#1D4ED8', 
                margin: '0 0 16px 0',
                letterSpacing: '-0.3px'
              }}>
                3. Benefits of Owning a Network (N2N Architecture)
              </h2>

              <p style={{ color: '#334155', fontSize: '15px', lineHeight: 1.75, margin: '0 0 20px 0' }}>
                A Network is a comprehensive digital media conglomerate. Utilizing Vibe's <strong>Network-to-Network
                (N2N)</strong> architecture, a network owner acts as the platform landlord, hosting and syndicating multiple
                child channels under a unified brand.
              </p>

              <ul style={{ listStyleType: 'disc', paddingLeft: '24px', margin: '0 0 24px 0', color: '#334155' }}>
                <li style={{ marginBottom: '14px', lineHeight: 1.65 }}>
                  <strong style={{ color: '#0F172A' }}>Scale via Aggregation (The Platform Effect):</strong> Instead of being restricted by your own content
                  output, your platform scales as child channels create content. You leverage the combined audiences
                  of every hosted creator.
                </li>
                <li style={{ marginBottom: '14px', lineHeight: 1.65 }}>
                  <strong style={{ color: '#0F172A' }}>Enterprise Revenue Models:</strong> Network owners build highly scalable revenue streams, taking custom
                  rev-shares from child channel transactions, charging subscription fees for advanced channel builder
                  tools, and controlling premium ad insertion.
                </li>
                <li style={{ marginBottom: '14px', lineHeight: 1.65 }}>
                  <strong style={{ color: '#0F172A' }}>Instant Multi-Tenant Brand Syndication:</strong> Launch customized child networks with a single click. For
                  example, a collegiate network (like AVO) can syndicate individual child networks for distinct university
                  sports programs, each with custom logos, stores, and tickers, while maintaining central control.
                </li>
                <li style={{ marginBottom: '14px', lineHeight: 1.65 }}>
                  <strong style={{ color: '#0F172A' }}>Enhanced Asset Valuation:</strong> Media networks command significantly higher exit multiples (often 8x -
                  15x EBITDA) than individual channels, as their revenue is diversified across dozens of independent
                  creators and sub-brands.
                </li>
              </ul>

              {/* Optimal Use Case Box */}
              <div style={{
                background: '#F8FAFC',
                borderLeft: '4px solid #2563EB',
                padding: '16px 20px',
                borderRadius: '0 6px 6px 0',
                color: '#334155',
                fontSize: '14.5px',
                lineHeight: 1.6
              }}>
                <strong style={{ color: '#0F172A' }}>Optimal Use Case:</strong> Sports leagues, corporate parent companies, franchise operations, and
                ambitious digital media entrepreneurs.
              </div>
            </section>

            {/* ── Section 4: Feature & Metric Comparison Table ── */}
            <section style={{ marginBottom: '48px', borderTop: '1px solid #E2E8F0', paddingTop: '32px' }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 800, 
                color: '#1D4ED8', 
                margin: '0 0 20px 0',
                letterSpacing: '-0.3px'
              }}>
                4. Feature & Metric Comparison
              </h2>

              <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse', 
                  fontSize: '14px',
                  border: '1px solid #CBD5E1'
                }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      <th style={{ 
                        border: '1px solid #CBD5E1', 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontWeight: 800, 
                        color: '#0F172A',
                        textTransform: 'uppercase',
                        fontSize: '11.5px',
                        letterSpacing: '0.8px',
                        width: '28%'
                      }}>
                        STRATEGIC DIMENSION
                      </th>
                      <th style={{ 
                        border: '1px solid #CBD5E1', 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontWeight: 800, 
                        color: '#0F172A',
                        textTransform: 'uppercase',
                        fontSize: '11.5px',
                        letterSpacing: '0.8px',
                        width: '36%'
                      }}>
                        CHANNEL MODEL
                      </th>
                      <th style={{ 
                        border: '1px solid #CBD5E1', 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontWeight: 800, 
                        color: '#0F172A',
                        textTransform: 'uppercase',
                        fontSize: '11.5px',
                        letterSpacing: '0.8px',
                        width: '36%'
                      }}>
                        NETWORK MODEL (N2N)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', fontWeight: 700, color: '#0F172A' }}>
                        Value Proposition
                      </td>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', color: '#334155' }}>
                        Content expertise & direct viewer engagement
                      </td>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', color: '#334155' }}>
                        Distribution infrastructure & brand ecosystem
                      </td>
                    </tr>
                    <tr style={{ background: '#F8FAFC' }}>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', fontWeight: 700, color: '#0F172A' }}>
                        Primary Revenue
                      </td>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', color: '#334155' }}>
                        Tips, merchandise, bookings, premium subs
                      </td>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', color: '#334155' }}>
                        Platform rev-share, network ads, SaaS fees
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', fontWeight: 700, color: '#0F172A' }}>
                        Content Dependency
                      </td>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', color: '#334155' }}>
                        High (Requires constant content creation)
                      </td>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', color: '#334155' }}>
                        Low (Leverages child channel content creators)
                      </td>
                    </tr>
                    <tr style={{ background: '#F8FAFC' }}>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', fontWeight: 700, color: '#0F172A' }}>
                        Audience Scaling
                      </td>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', color: '#334155' }}>
                        Linear (Grows through direct acquisition)
                      </td>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', color: '#334155' }}>
                        Exponential (Compound growth of all child channels)
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', fontWeight: 700, color: '#0F172A' }}>
                        Valuation Multiple
                      </td>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', color: '#334155' }}>
                        1x - 3x annual net earnings
                      </td>
                      <td style={{ border: '1px solid #CBD5E1', padding: '14px 16px', color: '#0F172A', fontWeight: 700 }}>
                        8x - 15x+ annual platform EBITDA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── Section 5: Strategic Recommendation ── */}
            <section style={{ marginBottom: '48px', borderTop: '1px solid #E2E8F0', paddingTop: '32px' }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 800, 
                color: '#1D4ED8', 
                margin: '0 0 16px 0',
                letterSpacing: '-0.3px'
              }}>
                5. Strategic Recommendation
              </h2>

              <p style={{ color: '#334155', fontSize: '15px', lineHeight: 1.75, margin: 0 }}>
                For entities establishing their initial audience footprint, starting with a <strong>Channel</strong> is the most capital-efficient path to product-market fit. However, the ultimate goal of long-term scaling is transition into a
                <strong>Network</strong>. By owning the platform, you insulate your business from individual channel churn, capture rich
                network-wide data, and construct an investable, institutional-grade media asset.
              </p>
            </section>

            {/* ── Document Footer ── */}
            <footer style={{ 
              borderTop: '1px solid #E2E8F0', 
              paddingTop: '24px', 
              marginTop: '48px',
              textAlign: 'center',
              color: '#94A3B8',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}>
              POWERED BY VIBE NETWORK ARCHITECTURE • CONFIDENTIAL STRATEGIC WHITEPAPER
            </footer>

          </motion.article>
        )}

      </div>
    </div>
  );
}
