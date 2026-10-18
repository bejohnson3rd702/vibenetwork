import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, 
  Tv, 
  Calendar, 
  Users, 
  Mail, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import type { WlConfig } from '../lib/whitelabel';

interface GccNetworkHomeProps {
  wlConfig?: WlConfig;
}

export default function GccNetworkHome({ wlConfig }: GccNetworkHomeProps) {
  const accent = '#00E5FF';
  const [activeTab, setActiveTab] = useState<'home' | 'events' | 'watch' | 'about' | 'contact'>('home');
  const [selectedEventModal, setSelectedEventModal] = useState<any | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contact form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formType, setFormType] = useState('General');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormType('General');
      setFormMessage('');
      setFormSubmitted(false);
    }, 4000);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'events', label: 'Events' },
    { id: 'watch', label: 'Watch / PPV' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ] as const;

  return (
    <div style={{ background: '#090C12', color: '#F1F5F9', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      {/* ── GCC Top Header / Navigation ── */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(9, 12, 18, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '14px 24px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          
          {/* Logo / Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              border: `2px solid ${accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#04060A',
              boxShadow: `0 0 16px ${accent}40`,
              flexShrink: 0
            }}>
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <div style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.8px', color: '#FFFFFF' }}>GLOBAL</div>
                <div style={{ fontSize: '7px', fontWeight: 900, color: accent }}>COMBAT</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '1.5px', color: '#FFFFFF', textTransform: 'uppercase' }}>
                Global Combat Collective
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', letterSpacing: '0.8px' }}>
                Official N2N Combat Network
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav style={{ display: 'none' }} className="md:flex" id="gcc-desktop-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    background: activeTab === item.id ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
                    color: activeTab === item.id ? accent : '#94A3B8',
                    border: activeTab === item.id ? `1px solid ${accent}40` : '1px solid transparent',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.id) e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.id) e.currentTarget.style.color = '#94A3B8';
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* CTA & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                setActiveTab('events');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: accent,
                color: '#04060A',
                padding: '9px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 900,
                letterSpacing: '0.5px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 0 20px ${accent}50`,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1.0)')}
            >
              <Ticket size={15} />
              Buy Tickets
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '12px', paddingTop: '12px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '12px' }}>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      background: activeTab === item.id ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                      color: activeTab === item.id ? accent : '#CBD5E1',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 700,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main Tab Content ── */}
      <main style={{ minHeight: 'calc(100vh - 180px)' }}>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: HOME (Pages 2 & 3 of PDF)
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'home' && (
          <div>
            {/* ── Hero / Featured Event Section ── */}
            <section style={{ 
              position: 'relative', 
              minHeight: '620px', 
              display: 'flex', 
              alignItems: 'center', 
              overflow: 'hidden',
              background: '#04060A'
            }}>
              {/* Background Combat Fighter Image */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url("https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=1800")',
                backgroundSize: 'cover',
                backgroundPosition: 'center 20%',
                opacity: 0.45,
                filter: 'contrast(1.2) grayscale(20%)'
              }} />

              {/* Gradient overlays for cinematic atmosphere */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, #090C12 30%, rgba(9, 12, 18, 0.75) 60%, rgba(9, 12, 18, 0.3) 100%)'
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(0deg, #090C12 5%, transparent 50%, #090C12 95%)'
              }} />

              {/* Hero Content */}
              <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 10, width: '100%' }}>
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ maxWidth: '640px' }}
                >
                  <div style={{ 
                    display: 'inline-block', 
                    color: accent, 
                    fontSize: '12px', 
                    fontWeight: 900, 
                    letterSpacing: '2.5px', 
                    textTransform: 'uppercase',
                    marginBottom: '16px' 
                  }}>
                    FEATURED EVENT
                  </div>

                  <h1 style={{ 
                    fontSize: 'clamp(36px, 6vw, 64px)', 
                    fontWeight: 900, 
                    lineHeight: 1.05, 
                    letterSpacing: '-1.5px', 
                    margin: '0 0 16px 0',
                    color: '#FFFFFF',
                    textTransform: 'uppercase'
                  }}>
                    GCC CHAMPIONSHIP<br />
                    <span style={{ color: accent }}>WILDER</span> vs. <span style={{ color: '#FFFFFF' }}>HERNDON</span>
                  </h1>

                  <p style={{ 
                    fontSize: '18px', 
                    color: '#E2E8F0', 
                    fontWeight: 600, 
                    margin: '0 0 8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>June 27, 2025</span>
                    <span>•</span>
                    <span>Koch Arena</span>
                  </p>
                  <p style={{ fontSize: '15px', color: '#94A3B8', margin: '0 0 28px 0' }}>
                    Wichita, Kansas • 8:00 PM EST / 5:00 PM PST
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <button
                      onClick={() => {
                        setSelectedEventModal({
                          name: 'GCC Championship: Wilder vs. Herndon',
                          fighterA: 'Deontay Wilder',
                          fighterB: 'Robert Herndon',
                          date: 'June 27, 2025',
                          venue: 'Koch Arena',
                          location: 'Wichita, Kansas',
                          doors: '7:00 PM CST',
                          broadcast: '8:00 PM EST'
                        });
                      }}
                      style={{
                        background: accent,
                        color: '#04060A',
                        padding: '13px 28px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 900,
                        letterSpacing: '0.5px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: `0 4px 20px ${accent}40`
                      }}
                    >
                      Buy Tickets
                    </button>

                    <button
                      onClick={() => setActiveTab('watch')}
                      style={{
                        background: 'transparent',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '13px 28px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
                    >
                      Buy PPV
                    </button>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Tickets via Official Box Office • PPV via Global Combat Live Streaming
                  </div>
                </motion.div>
              </div>

              {/* Bottom Tagline Bar */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(4, 6, 10, 0.85)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px 24px',
                zIndex: 10
              }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: accent, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                      GLOBAL COMBAT COLLECTIVE
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>
                      Fight night starts here
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#94A3B8' }}>
                    Find your next event. Experience the action in person or watch live.
                  </div>
                </div>
              </div>
            </section>

            {/* ── Below The Fold: About GCC & Latest Highlights ── */}
            <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px' }}>
              
              {/* "Built around the fighters" Block */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '40px', 
                alignItems: 'center',
                marginBottom: '80px',
                background: 'rgba(14, 20, 34, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '40px',
                overflow: 'hidden'
              }}>
                <div>
                  <div style={{ color: accent, fontSize: '12px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                    ABOUT GCC
                  </div>
                  <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 18px 0', letterSpacing: '-0.5px' }}>
                    Built around the fighters
                  </h2>
                  <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#94A3B8', margin: '0 0 24px 0' }}>
                    Global Combat Collective brings fighters and fans together through professional combat sports events,
                    live broadcasts, and original content. GCC creates opportunities for athletes while delivering compelling
                    fight experiences in the arena and on screen.
                  </p>
                  <button
                    onClick={() => setActiveTab('about')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'transparent',
                      color: accent,
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Learn About GCC <ArrowRight size={16} />
                  </button>
                </div>

                <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', height: '300px' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1000" 
                    alt="GCC Fighters"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #090C12 0%, transparent 60%)' }} />
                </div>
              </div>

              {/* Latest Highlights */}
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 24px 0', letterSpacing: '-0.5px' }}>
                  Latest highlights
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  {/* Highlight 1 */}
                  <div 
                    onClick={() => setActiveTab('watch')}
                    style={{
                      background: 'rgba(14, 20, 34, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = `${accent}80`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <div style={{ height: '180px', position: 'relative' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=600" 
                        alt="Fight week"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04060A' }}>
                          <Play size={20} fill="#04060A" />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                        Women's championship / Fight week
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                        Behind the scenes training & media day
                      </div>
                    </div>
                  </div>

                  {/* Highlight 2 */}
                  <div 
                    onClick={() => setActiveTab('watch')}
                    style={{
                      background: 'rgba(14, 20, 34, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = `${accent}80`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <div style={{ height: '180px', position: 'relative' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600" 
                        alt="Championship boxing"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04060A' }}>
                          <Play size={20} fill="#04060A" />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                        Women's championship boxing
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                        Baumgardner vs. Persoon full highlights
                      </div>
                    </div>
                  </div>

                  {/* Highlight 3 */}
                  <div 
                    onClick={() => setActiveTab('watch')}
                    style={{
                      background: 'rgba(14, 20, 34, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = `${accent}80`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <div style={{ height: '180px', position: 'relative' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&q=80&w=600" 
                        alt="GCC experience"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04060A' }}>
                          <Play size={20} fill="#04060A" />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                        Inside the GCC experience
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                        Arena walkout & locker room immersion
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </section>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: EVENTS (Pages 4 & 5 of PDF)
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'events' && (
          <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>
            <div style={{ color: accent, fontSize: '12px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              THE GCC SCHEDULE
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 36px 0', letterSpacing: '-1px' }}>
              Upcoming events
            </h1>

            {/* Next Event Card */}
            <div style={{
              background: 'rgba(14, 20, 34, 0.8)',
              border: `1px solid ${accent}40`,
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              padding: '36px',
              marginBottom: '64px',
              boxShadow: `0 8px 32px rgba(0, 229, 255, 0.1)`
            }}>
              <div>
                <span style={{ 
                  background: 'rgba(0, 229, 255, 0.15)', 
                  color: accent, 
                  fontSize: '11px', 
                  fontWeight: 900, 
                  letterSpacing: '1px', 
                  padding: '4px 10px', 
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  NEXT LIVE FIGHT NIGHT
                </span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#FFFFFF', margin: '16px 0 10px 0' }}>
                  WILDER vs. HERNDON
                </h2>
                <div style={{ fontSize: '16px', color: '#CBD5E1', marginBottom: '6px' }}>
                  June 27, 2025 • Koch Arena
                </div>
                <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '28px' }}>
                  Wichita, Kansas • Doors: 7:00 PM CST | Broadcast: 8:00 PM EST
                </div>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setSelectedEventModal({
                        name: 'Wilder vs. Herndon: Legacy Reloaded',
                        fighterA: 'Deontay Wilder',
                        fighterB: 'Robert Herndon',
                        date: 'June 27, 2025',
                        venue: 'Koch Arena',
                        location: 'Wichita, Kansas',
                        doors: '7:00 PM CST',
                        broadcast: '8:00 PM EST'
                      });
                    }}
                    style={{
                      background: accent,
                      color: '#04060A',
                      padding: '11px 24px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    View Event Details
                  </button>

                  <button
                    onClick={() => setActiveTab('watch')}
                    style={{
                      background: 'transparent',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      padding: '11px 24px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Buy PPV Access
                  </button>
                </div>
              </div>

              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '240px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800" 
                  alt="Wilder vs Herndon"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Past Events Section */}
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 24px 0', letterSpacing: '-0.5px' }}>
              Past events
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Past Event 1 */}
              <div style={{
                background: 'rgba(14, 20, 34, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ color: '#64748B', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    JUNE 27, 2025
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                    Legacy Reloaded
                  </h3>
                  <div style={{ fontSize: '14px', color: '#CBD5E1', marginBottom: '4px' }}>
                    Wilder vs. Herndon
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
                    Wichita, Kansas
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('watch')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}
                >
                  View Recap
                </button>
              </div>

              {/* Past Event 2 */}
              <div style={{
                background: 'rgba(14, 20, 34, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ color: '#64748B', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    SEPTEMBER 27, 2024
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                    Baumgardner vs. Persoon
                  </h3>
                  <div style={{ fontSize: '14px', color: '#CBD5E1', marginBottom: '4px' }}>
                    Women's championship boxing
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
                    Fayetteville, Georgia
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('watch')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}
                >
                  View Recap
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: WATCH / PPV (Page 6 of PDF)
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'watch' && (
          <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>
            <div style={{ color: accent, fontSize: '12px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              LIVE BROADCASTS
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0', letterSpacing: '-1px' }}>
              Watch GCC live
            </h1>
            <p style={{ fontSize: '16px', color: '#94A3B8', margin: '0 0 40px 0', maxWidth: '680px' }}>
              Purchase access through the official provider and watch from wherever you are.
            </p>

            {/* PPV Main Feature Card */}
            <div style={{
              background: 'rgba(14, 20, 34, 0.85)',
              border: `1px solid ${accent}40`,
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              padding: '36px',
              marginBottom: '64px',
              boxShadow: `0 12px 40px rgba(0, 229, 255, 0.12)`
            }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', height: '260px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800" 
                  alt="PPV Stream Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={24} fill="#04060A" color="#04060A" />
                  </div>
                </div>
              </div>

              <div>
                <span style={{ 
                  background: 'rgba(0, 229, 255, 0.15)', 
                  color: accent, 
                  fontSize: '11px', 
                  fontWeight: 900, 
                  letterSpacing: '1px', 
                  padding: '4px 10px', 
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  PAY-PER-VIEW
                </span>

                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#FFFFFF', margin: '14px 0 10px 0' }}>
                  WILDER vs. HERNDON: LIVE PPV
                </h2>
                <div style={{ fontSize: '15px', color: '#CBD5E1', marginBottom: '6px' }}>
                  June 27, 2025 at 8:00 PM EST / 5:00 PM PST
                </div>
                <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '8px' }}>
                  Available on Official Global Combat PPV Stream
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#38BDF8', marginBottom: '24px' }}>
                  $39.99 / Available Worldwide
                </div>

                <button
                  onClick={() => alert('Redirecting to official GCC PPV purchase portal...')}
                  style={{
                    background: accent,
                    color: '#04060A',
                    padding: '12px 28px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 900,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: `0 4px 16px ${accent}40`,
                    marginBottom: '10px'
                  }}
                >
                  Buy PPV on Global Combat
                </button>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  You'll continue to the provider's secure purchase page.
                </div>
              </div>
            </div>

            {/* How To Watch 3 Steps */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 24px 0' }}>
                How to watch
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'rgba(14, 20, 34, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: accent, marginBottom: '8px' }}>01</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>Purchase access</div>
                  <div style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>Open the official event purchase link.</div>
                </div>

                <div style={{ background: 'rgba(14, 20, 34, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: accent, marginBottom: '8px' }}>02</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>Follow provider instructions</div>
                  <div style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>Use its sign-in and viewing guidance.</div>
                </div>

                <div style={{ background: 'rgba(14, 20, 34, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: accent, marginBottom: '8px' }}>03</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>Watch live</div>
                  <div style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>Tune in at the listed broadcast time.</div>
                </div>
              </div>
            </div>

          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 4: ABOUT GCC & LEADERSHIP (Pages 7 & 8 of PDF)
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'about' && (
          <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>
            
            {/* Overview */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '40px', 
              alignItems: 'center', 
              marginBottom: '72px' 
            }}>
              <div>
                <div style={{ color: accent, fontSize: '12px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  GLOBAL COMBAT COLLECTIVE
                </div>
                <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 20px 0', letterSpacing: '-1px' }}>
                  About GCC
                </h1>
                <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#CBD5E1', margin: '0 0 16px 0' }}>
                  Global Combat Collective brings fighters and fans together through professional combat sports events,
                  live broadcasts, and original content. GCC creates opportunities for athletes while delivering compelling
                  fight experiences in the arena and on screen.
                </p>
                <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#94A3B8', margin: 0 }}>
                  From championship boxing to athlete development, GCC connects competition with a broader audience.
                </p>
              </div>

              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '320px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&q=80&w=1000" 
                  alt="Arena Atmosphere"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Leadership Section */}
            <div>
              <div style={{ color: accent, fontSize: '12px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                ABOUT GCC / LEADERSHIP
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 32px 0', letterSpacing: '-0.5px' }}>
                The people behind GCC
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
                
                {/* 1. Nelson Lopez Jr. */}
                <div style={{ 
                  background: 'rgba(14, 20, 34, 0.7)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  borderRadius: '14px', 
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '240px', 
                    borderRadius: '10px', 
                    overflow: 'hidden', 
                    marginBottom: '20px',
                    background: '#151C2C'
                  }}>
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" 
                      alt="Nelson Lopez Jr." 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} 
                    />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                    Nelson Lopez Jr.
                  </h3>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
                    Co-Founder and CEO
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#94A3B8', margin: 0 }}>
                    Nelson brings more than two decades of experience in boxing management, promotion, and
                    matchmaking. His work with established champions and developing athletes informs GCC's
                    approach to fighter opportunity and competitive events.
                  </p>
                </div>

                {/* 2. Joshua Chasse */}
                <div style={{ 
                  background: 'rgba(14, 20, 34, 0.7)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  borderRadius: '14px', 
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '240px', 
                    borderRadius: '10px', 
                    overflow: 'hidden', 
                    marginBottom: '20px',
                    background: '#151C2C'
                  }}>
                    <img 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600" 
                      alt="Joshua Chasse" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} 
                    />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                    Joshua Chasse
                  </h3>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
                    Co-Founder and President
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#94A3B8', margin: 0 }}>
                    Joshua is a sports and media executive with experience in combat sports promotion, strategic
                    marketing, and digital content. His background in creator partnerships and network development connects
                    GCC's events with audiences and commercial partners.
                  </p>
                </div>

                {/* 3. Zab Judah */}
                <div style={{ 
                  background: 'rgba(14, 20, 34, 0.7)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  borderRadius: '14px', 
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '240px', 
                    borderRadius: '10px', 
                    overflow: 'hidden', 
                    marginBottom: '20px',
                    background: '#151C2C'
                  }}>
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600" 
                      alt="Zab Judah" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} 
                    />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                    Zab Judah
                  </h3>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
                    President of Fighter Relations
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#94A3B8', margin: 0 }}>
                    Zab is a former undisputed welterweight champion and a world champion in two weight
                    divisions. He brings firsthand experience at boxing's highest level to GCC's relationships with
                    athletes and its focus on fighter opportunity.
                  </p>
                </div>

              </div>
            </div>

          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 5: CONTACT (Page 9 of PDF)
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'contact' && (
          <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '48px',
              alignItems: 'flex-start'
            }}>
              
              {/* Left Column: Context & Support info */}
              <div>
                <div style={{ color: accent, fontSize: '12px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  LET'S CONNECT
                </div>
                <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 16px 0', letterSpacing: '-1px' }}>
                  Contact GCC
                </h1>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#94A3B8', margin: '0 0 24px 0' }}>
                  Questions about an event? Interested in sponsorship or media access? Contact the GCC team.
                </p>

                <div style={{ 
                  background: 'rgba(14, 20, 34, 0.6)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  borderRadius: '12px', 
                  padding: '20px',
                  marginBottom: '28px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                    DIRECT EMAIL
                  </div>
                  <a href="mailto:contact@globalcombatcollective.com" style={{ color: accent, fontSize: '16px', fontWeight: 700, textDecoration: 'none' }}>
                    contact@globalcombatcollective.com
                  </a>
                </div>

                <div style={{ 
                  background: 'rgba(14, 20, 34, 0.6)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  borderRadius: '12px', 
                  padding: '20px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                    Ticket or PPV support
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#94A3B8', margin: '0 0 14px 0' }}>
                    For an existing order or account issue, contact your purchase provider directly.
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => alert('Support guidance: Check your order confirmation email from the ticket provider.')}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Ticket support
                    </button>
                    <button 
                      onClick={() => alert('Support guidance: Sign into your streaming provider account to restore PPV access.')}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      PPV support
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div style={{ 
                background: 'rgba(14, 20, 34, 0.85)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '16px', 
                padding: '36px' 
              }}>
                {formSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.15)', color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                      <Check size={24} />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                      Inquiry Received
                    </h3>
                    <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0 }}>
                      Thank you for contacting Global Combat Collective. Our team will respond shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#CBD5E1', marginBottom: '8px' }}>
                        Name
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Your name"
                        style={{
                          width: '100%',
                          background: 'rgba(4, 6, 10, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#CBD5E1', marginBottom: '8px' }}>
                        Email
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={{
                          width: '100%',
                          background: 'rgba(4, 6, 10, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#CBD5E1', marginBottom: '8px' }}>
                        Inquiry type
                      </label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(4, 6, 10, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="General">General Inquiry</option>
                        <option value="Sponsorship">Sponsorship & Commercial</option>
                        <option value="Media">Media & Press Access</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#CBD5E1', marginBottom: '8px' }}>
                        Message
                      </label>
                      <textarea 
                        rows={4}
                        required
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder="How can we help?"
                        style={{
                          width: '100%',
                          background: 'rgba(4, 6, 10, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        background: accent,
                        color: '#04060A',
                        padding: '13px 20px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 900,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: `0 4px 16px ${accent}40`
                      }}
                    >
                      Send Inquiry
                    </button>
                  </form>
                )}
              </div>

            </div>
          </section>
        )}

      </main>

      {/* ── Event Detail Modal (Page 5 Mockup) ── */}
      <AnimatePresence>
        {selectedEventModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#090C12',
                border: `1px solid ${accent}50`,
                borderRadius: '16px',
                maxWidth: '720px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '36px',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setSelectedEventModal(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '8px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <button
                onClick={() => setSelectedEventModal(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: accent,
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ← All events
              </button>

              <div style={{ color: accent, fontSize: '11px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                GCC LIVE BOXING
              </div>

              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0' }}>
                {selectedEventModal.fighterA} vs. {selectedEventModal.fighterB}
              </h2>

              <div style={{ fontSize: '15px', color: '#CBD5E1', marginBottom: '4px' }}>
                {selectedEventModal.date} • {selectedEventModal.venue}, {selectedEventModal.location}
              </div>
              <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>
                Doors: {selectedEventModal.doors} • Broadcast: {selectedEventModal.broadcast}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                <button
                  onClick={() => alert('Opening ticket provider...')}
                  style={{
                    background: accent,
                    color: '#04060A',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 900,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Buy Tickets
                </button>
                <button
                  onClick={() => {
                    setSelectedEventModal(null);
                    setActiveTab('watch');
                  }}
                  style={{
                    background: 'transparent',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Buy PPV
                </button>
              </div>

              {/* Announced Fight Card */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px 0' }}>
                  Announced fight card
                </h4>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '8px', fontSize: '14px', color: '#CBD5E1' }}>
                  <div style={{ fontWeight: 700, color: accent, marginBottom: '6px' }}>Main Event:</div>
                  <div style={{ marginBottom: '12px' }}>{selectedEventModal.fighterA} vs. {selectedEventModal.fighterB} (12 Rounds, Heavyweight)</div>
                  
                  <div style={{ fontWeight: 700, color: accent, marginBottom: '6px' }}>Confirmed Supporting Bouts:</div>
                  <div style={{ color: '#94A3B8', lineHeight: 1.6 }}>
                    • Co-Main Event: Super Featherweight Championship Qualifier (10 Rounds)<br />
                    • Cruiserweight Showcase Bout (8 Rounds)<br />
                    • Undercard Opening Bouts (4 Bouts)
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', fontStyle: 'italic' }}>
                  Fight card subject to change.
                </div>
              </div>

              {/* Event Questions FAQ */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px 0' }}>
                  Event questions
                </h4>

                {[
                  { q: 'Where do I buy tickets?', a: 'Tickets are available through the official venue box office and authorized ticketing partners linked on this page.' },
                  { q: 'How do I watch the PPV?', a: 'Purchase streaming access through Global Combat Collective live broadcasting tab. You will receive an immediate stream pass.' },
                  { q: 'Parking and accessibility', a: 'On-site arena parking opens 2 hours before door time. Accessible seating and ADA accommodations are available at the arena entrance.' }
                ].map((faq, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 0' }}>
                    <div 
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}
                    >
                      <span>{faq.q}</span>
                      <span>{openFaqIndex === idx ? '-' : '+'}</span>
                    </div>
                    {openFaqIndex === idx && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── GCC Footer (Page 3 & 9 of PDF) ── */}
      <footer style={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
        background: '#04060A',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: `1.5px solid ${accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000'
              }}>
                <span style={{ fontSize: '7px', fontWeight: 900, color: accent }}>GCC</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '1px' }}>
                GLOBAL COMBAT COLLECTIVE
              </span>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '20px',
            fontSize: '12px',
            color: '#64748B'
          }}>
            <div>
              contact@globalcombatcollective.com • Verified Official Combat Network
            </div>
            <div>
              Privacy Policy • Terms of Service • © 2026 Global Combat Collective. All rights reserved.
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
