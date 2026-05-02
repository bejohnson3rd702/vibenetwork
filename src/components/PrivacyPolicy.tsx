import React from 'react';
import { motion } from 'framer-motion';
import { useWhiteLabel } from '../context/WhiteLabelContext';

const PrivacyPolicy: React.FC = () => {
  const { wlConfig } = useWhiteLabel();
  const platformName = wlConfig?.name || 'Vibe Network';
  const email = wlConfig?.contactEmail || 'privacy@vibenetwork.tv';
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
          Privacy Policy
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
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>1. Introduction</h2>
            <p>Welcome to {platformName}. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at <b style={{ color: accentColor }}>{email}</b>.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>2. Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when you register on the Platform, express an interest in obtaining information about us or our products, or when you participate in activities on the Platform (such as sending messages in live chat or uploading content).</p>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li><b>Account Information:</b> Names, email addresses, usernames, and passwords.</li>
              <li><b>Payment Information:</b> Data necessary to process your payment if you make purchases. All payment data is stored by our payment processor.</li>
              <li><b>Usage Data:</b> IP addresses, browser characteristics, and details on how you interact with our streaming infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>3. How We Use Your Information</h2>
            <p>We use the information we collect or receive to facilitate account creation, fulfill and manage your orders, deliver and facilitate the delivery of services to the user, and to respond to legal requests and prevent harm.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>4. Cookies and Tracking Technologies</h2>
            <p>We may use cookies and similar tracking technologies to access or store information. You can manage your cookie preferences through our Cookie Consent banner or your browser settings.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>5. Data Retention & Deletion (Right to be Forgotten)</h2>
            <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required by law. You have the right to request the deletion of your personal data at any time by contacting us.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '12px' }}>6. Contact Us</h2>
            <p>For questions regarding this privacy policy or to exercise your data rights, please reach out to <b style={{ color: accentColor }}>{email}</b>.</p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
