import React from 'react';
import { motion } from 'framer-motion';

const MoreInfo: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-color)', 
      paddingTop: '120px', 
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ maxWidth: '1000px', width: '100%', padding: '0 40px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-1px' }}
        >
          About Vibe Network Architecture
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '40px' }}
        >
          Vibe Network provides enterprise-grade, highly scalable white-label streaming architectures. 
          Deploy high-fidelity, interactive broadcasting experiences tailored entirely to your brand's aesthetic.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--bg-surface-hover)' }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Key Features</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', fontSize: '18px', paddingLeft: '20px', lineHeight: 1.6 }}>
            <li><b style={{ color: 'var(--accent-primary)' }}>Dynamic Tenancy:</b> Configure custom domains, logos, and color palettes on the fly.</li>
            <li><b style={{ color: 'var(--accent-primary)' }}>High-Fidelity Streaming:</b> Support for ultra-low latency broadcasting using enterprise servers.</li>
            <li><b style={{ color: 'var(--accent-primary)' }}>Real-Time Interactive Chat:</b> Global scaled websockets for millions of concurrent users.</li>
            <li><b style={{ color: 'var(--accent-primary)' }}>Generative UI Components:</b> Seamlessly adapt the platform's look and feel with AI-assisted design tokens.</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default MoreInfo;
