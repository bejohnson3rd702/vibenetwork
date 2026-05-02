import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useWhiteLabel } from '../context/WhiteLabelContext';

const Contact: React.FC = () => {
  const { wlConfig } = useWhiteLabel();
  const accentColor = wlConfig?.accent || 'var(--accent-primary)';
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const fullMessage = `Name: ${formData.name}\nSubject: ${formData.subject}\n\n${formData.message}`;

    const { error } = await supabase.from('network_leads').insert([
       {
          whitelabel_id: wlConfig?.id || null,
          email: formData.email,
          message: fullMessage,
          status: 'new'
       }
    ]);

    setIsSending(false);
    
    if (error) {
       alert("Failed to send message: " + error.message);
    } else {
       setIsSent(true);
       setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-color)', 
      paddingTop: '120px', 
      paddingBottom: '80px',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background elements */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: '400px', height: '400px', background: accentColor, filter: 'blur(200px)', opacity: 0.15, zIndex: 0, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px', background: '#ffffff', filter: 'blur(150px)', opacity: 0.05, zIndex: 0, borderRadius: '50%' }} />

      <div style={{ maxWidth: '1200px', width: '100%', padding: '0 40px', position: 'relative', zIndex: 2 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '8px 24px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
              Enterprise Support
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '56px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-2px' }}
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}
          >
            Ready to scale your architecture? Reach out to our enterprise specialists to discuss custom deployments, pricing, and infrastructure.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          
          {/* Contact Info Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
          >
            <div style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--bg-surface-hover)', flex: 1 }}>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '30px' }}>Contact Information</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${accentColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email Us</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{wlConfig?.contactEmail || 'enterprise@vibenetwork.tv'}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${accentColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Call Us</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{wlConfig?.contactPhone || '+1 (800) 555-VIBE'}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${accentColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Headquarters</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{wlConfig?.contactAddress ? wlConfig.contactAddress.split('\n').map((line: string, i: number) => <React.Fragment key={i}>{line}<br/></React.Fragment>) : <React.Fragment>1200 Tech Ave, Suite 400<br/>San Francisco, CA 94107</React.Fragment>}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--bg-surface-hover)' }}
          >
            {isSent ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: `0 10px 30px ${accentColor}66` }}>
                  <Send fill="white" size={24} />
                </div>
                <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Thank you for reaching out to Vibe Network. Our enterprise team will get back to you within 24 hours.</p>
                <button 
                  onClick={() => setIsSent(false)}
                  style={{ marginTop: '30px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', transition: 'border 0.2s' }} onFocus={e => e.target.style.borderColor = accentColor} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="John Doe" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', transition: 'border 0.2s' }} onFocus={e => e.target.style.borderColor = accentColor} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="john@company.com" />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Subject</label>
                  <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', transition: 'border 0.2s' }} onFocus={e => e.target.style.borderColor = accentColor} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="Enterprise Architecture Inquiry" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Message</label>
                  <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', minHeight: '150px', resize: 'vertical', transition: 'border 0.2s' }} onFocus={e => e.target.style.borderColor = accentColor} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="Tell us about your streaming needs..." />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSending}
                  style={{ width: '100%', padding: '18px', background: accentColor, color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', cursor: isSending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', boxShadow: `0 10px 30px ${accentColor}66`, opacity: isSending ? 0.7 : 1 }}
                >
                  <Send size={18} />
                  {isSending ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
