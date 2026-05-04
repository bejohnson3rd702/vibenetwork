import React from 'react';
import { motion } from 'framer-motion';
import { useWhiteLabel } from '../context/WhiteLabelContext';

const TermsOfService: React.FC = () => {
  const { wlConfig } = useWhiteLabel();
  const platformName = wlConfig?.name || 'Vibe Network';
  const email = wlConfig?.contactEmail || 'legal@vibenetwork.tv';
  const accentColor = wlConfig?.accent || 'var(--accent-primary)';

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-color)', 
      paddingTop: '120px', 
      paddingBottom: '80px',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ maxWidth: '800px', width: '100%', padding: '0 40px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '42px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-1px' }}
        >
          Terms of Service
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
          Last Updated: {new Date().toLocaleDateString()}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '30px', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '16px' }}
        >
          <section>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
            <p>By accessing and using {platformName} (the "Platform"), you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>2. User Content & Conduct</h2>
            <p>You are solely responsible for all video, audio, and text content that you upload, broadcast, or transmit via the Platform. You agree not to upload content that is illegal, infringes on intellectual property rights, or violates the privacy of others. We reserve the right to remove any content at our sole discretion.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>3. DMCA & Copyright Policy</h2>
            <p>{platformName} respects the intellectual property of others. If you believe your copyrighted work has been infringed upon, please submit a takedown notice to our designated copyright agent at <b style={{ color: accentColor }}>{email}</b> containing your contact information and a description of the copyrighted work.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>4. Subscriptions and Payments</h2>
            <p>Certain features of the Platform may be subject to payments. All transactions are final and non-refundable unless legally required. The Platform utilizes secure third-party payment processors, and we do not store raw credit card data.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>5. Limitation of Liability</h2>
            <p>The Platform is provided "as is" without any warranties. {platformName} shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>6. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at <b style={{ color: accentColor }}>{email}</b>.</p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
