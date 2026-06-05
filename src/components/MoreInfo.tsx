import React from 'react';
import { motion } from 'framer-motion';
import { useWhiteLabel } from '../context/WhiteLabelContext';

const MoreInfo: React.FC = () => {
  const { wlConfig } = useWhiteLabel();
  const isTenant = wlConfig && wlConfig.domain !== 'vibenetwork.tv';
  const isAvo = wlConfig?.id === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7' || wlConfig?.parent_network_id === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7';
  const isOlympian = wlConfig?.name?.toLowerCase().includes('olympia') || 
                     wlConfig?.domain?.includes('mrolympia.com') ||
                     wlConfig?.name?.toLowerCase().includes('muscle') ||
                     wlConfig?.name?.toLowerCase().includes('fitness');
  const accentColor = wlConfig?.accent || 'var(--accent-primary)';

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-color)', 
      paddingTop: '120px', 
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background elements */}
      <div className="hide-on-mobile" style={{ position: 'absolute', top: '10%', right: '5%', width: '400px', height: '400px', background: accentColor, filter: 'blur(200px)', opacity: 0.15, zIndex: 0, borderRadius: '50%' }} />

      <div style={{ maxWidth: '1000px', width: '100%', padding: '0 40px', position: 'relative', zIndex: 2 }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-1px' }}
        >
          {isAvo 
            ? (wlConfig?.parent_network_id ? `About AVO & ${wlConfig.name}` : 'About AVO Network')
            : (isTenant ? `About ${wlConfig.name}` : 'About Vibe Network Architecture')}
        </motion.h1>
        
        {isAvo ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '20px' }}>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '0px' }}
            >
              These days, it seems like everything costs more than it’s worth. Whether it’s paying rent, buying a new outfit, or ordering avocado toast at brunch, we all feel it. That’s why we created AVO - a maker of high-quality garments sold at fair prices. You shouldn’t have to choose between affordability and quality, and with AVO, you don’t. You can have your avocado toast and eat it too.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--bg-surface-hover)' }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.8, margin: 0 }}>
                We source the same fabrics used by premium brands but keep prices affordable by selling directly to you instead of through retailers who mark them up. Simply put, we think it’s time you got your money’s worth. When you shop with AVO, that’s exactly what you’re getting.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ 
                background: `linear-gradient(135deg, ${accentColor}15 0%, rgba(0,0,0,0) 100%)`, 
                padding: '40px', 
                borderRadius: '24px', 
                border: `1px solid ${accentColor}33`,
                boxShadow: `0 10px 30px ${accentColor}08`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background: accentColor, boxShadow: `0 0 12px ${accentColor}`
              }} />
              <h3 style={{ margin: '0 0 12px 0', fontSize: '22px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Supporting Student Athletes
              </h3>
              <p style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', lineHeight: 1.8 }}>
                20% of every AVO order is donated to the university’s female student-athlete NIL fund. At AVO, we believe that American-made, high-quality clothing doesn't have to be expensive, and it should be easy to support all student athletes.
              </p>
            </motion.div>
          </div>
        ) : (
          <>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '40px' }}
            >
              {isOlympian 
                ? "Mr. Olympia is the ultimate arena of professional bodybuilding. For more than half a century, the iconic competition has crowned the finest physiques on Earth, establishing a legacy of discipline, athletic brilliance, and physical perfection."
                : isTenant 
                  ? `${wlConfig.heroCopy || 'The premiere destination for high quality digital content.'} Powered by Vibe Network.`
                  : "Vibe Network provides enterprise-grade, highly scalable white-label streaming architectures. Deploy high-fidelity, interactive broadcasting experiences tailored entirely to your brand's aesthetic."
              }
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--bg-surface-hover)' }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
                {isOlympian ? 'About Mr. Olympian' : (isTenant ? 'Our Platform' : 'Key Features')}
              </h2>
              
              {isOlympian ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.8, margin: 0 }}>
                  The official Mr. Olympian Network-to-Network (N2N) platform connects bodybuilding enthusiasts globally with exclusive media clips, event schedules, and official gear from legendary partner brands: Gold's Gym, Gaspari Nutrition, Rogue Fitness, Redcon1, and Gymshark. Together, we celebrate the passion and dedication that defines the fitness lifestyle.
                </p>
              ) : isTenant ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.6 }}>
                   This is the autogenerated structural block for your requested <b>About Us</b> modular section. Connect your CMS to deploy actual structured content here.
                </p>
              ) : (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', fontSize: '18px', paddingLeft: '20px', lineHeight: 1.6 }}>
                  <li><b style={{ color: accentColor }}>Dynamic Tenancy:</b> Configure custom domains, logos, and color palettes on the fly.</li>
                  <li><b style={{ color: accentColor }}>High-Fidelity Streaming:</b> Support for ultra-low latency broadcasting using enterprise servers.</li>
                  <li><b style={{ color: accentColor }}>Real-Time Interactive Chat:</b> Global scaled websockets for millions of concurrent users.</li>
                  <li><b style={{ color: accentColor }}>Generative UI Components:</b> Seamlessly adapt the platform's look and feel with AI-assisted design tokens.</li>
                </ul>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoreInfo;
