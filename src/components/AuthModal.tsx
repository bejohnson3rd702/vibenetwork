import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { X, Lock, Mail, AtSign } from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
  defaultIsLogin?: boolean;
  defaultRole?: 'viewer' | 'influencer' | 'business';
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, defaultIsLogin = true, defaultRole = 'viewer' }) => {
  const { wlConfig: activeTenantConfig, setWlConfig: setGlobalWlDeploy } = useWhiteLabel();
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'viewer' | 'influencer' | 'business'>(defaultRole);
  
  const [errorMSG, setErrorMSG] = useState('');
  const [loading, setLoading] = useState(false);

  // Business Wizard State
  const [showBusinessWizard, setShowBusinessWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wlConfig, setWlConfig] = useState({ name: '', domain: '', bg: '#000', accent: '#ff4d85', heroImage: '', logoImage: '', sliderCount: 4, customSections: '', heroCopy: '' });
  const [chatHistory, setChatHistory] = useState<{sender: 'bot'|'user', text: string, imagePreview?: string}[]>([
    { sender: 'bot', text: "Welcome to the Beginning of your Business's AI Journey. I am your automated AI setup architect. First off, what is the name of your organization?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>(['Contact Us Form']);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, wizardStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG('');

    if (isLogin) {
      // Login flow
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMSG(error.message);
      } else if (data.user) {
         // Strict Tenancy Isolation Check
         const { data: profile } = await supabase!.from('profiles').select('whitelabel_id, is_admin').eq('id', data.user.id).single();
         const isMaster = activeTenantConfig?.domain === 'vibenetwork.tv';
         
         let allowed = false;
         
         if (!profile) {
            allowed = true; // New account, profile not initialized yet.
         } else if (profile.is_admin) {
            allowed = true; // Global Admins can log in anywhere.
         } else {
             // 1. Are they the explicit owner of this Tenant?
             if (activeTenantConfig?.id) {
                 const { data: tenantConfig } = await supabase!.from('whitelabel_configs').select('owner_id').eq('id', activeTenantConfig.id).single();
                 if (tenantConfig && tenantConfig.owner_id === data.user.id) {
                     allowed = true;
                 }
             }
             
             // 2. If not the owner, does their profile strictly bind to this Tenant?
             if (!allowed) {
                 if (isMaster && !profile.whitelabel_id) {
                     allowed = true;
                 } else if (!isMaster && profile.whitelabel_id === activeTenantConfig?.id) {
                     allowed = true;
                 }
             }
         }

         if (!allowed) {
             await supabase!.auth.signOut();
             setErrorMSG('Access Denied: Your account is restricted to a different network domain.');
             setLoading(false);
             return;
         }

         onSuccess(data.user);
         onClose();
      }
    } else {
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role,
            whitelabel_id: activeTenantConfig?.domain === 'vibenetwork.tv' ? null : activeTenantConfig?.id
          }
        }
      });
      if (error) setErrorMSG(error.message);
      else if (data.user) {
        onSuccess(data.user);
        if (role === 'business') {
           setShowBusinessWizard(true);
        } else {
           onClose();
        }
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100000
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        style={{
          width: '100%', maxWidth: '440px',
          background: 'linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(15,15,15,0.95) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '40px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '24px', right: '24px',
            background: 'none', border: 'none', color: '#888',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>
          {isLogin ? 'Welcome Back' : 'Join Vibe'}
        </h2>
        <p style={{ color: '#ccc', marginBottom: '32px', fontSize: '15px' }}>
          {isLogin ? 'Sign in to access your Vibe Favorites.' : 'Create an account to start streaming.'}
        </p>

        {errorMSG && (
          <div style={{ background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)', padding: '12px', borderRadius: '8px', color: '#ff6b6b', fontSize: '14px', marginBottom: '20px' }}>
            {errorMSG}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <AtSign size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input 
                type="text" placeholder="Choose a Username" required
                value={username} onChange={e => setUsername(e.target.value)}
                style={{
                  width: '100%', padding: '16px 16px 16px 44px', boxSizing: 'border-box',
                  background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', color: '#fff', fontSize: '16px', outline: 'none'
                }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input 
              type="email" placeholder="Email Address" required
              value={email} onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '16px 16px 16px 44px', boxSizing: 'border-box',
                background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', color: '#fff', fontSize: '16px', outline: 'none'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input 
              type="password" placeholder="Password" required
              value={password} onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '16px 16px 16px 44px', boxSizing: 'border-box',
                background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', color: '#fff', fontSize: '16px', outline: 'none'
              }}
            />
          </div>

          {!isLogin && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '10px' }}>Account Type</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setRole('viewer')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px',
                    background: role === 'viewer' ? '#fff' : 'rgba(255,255,255,0.05)',
                    color: role === 'viewer' ? '#000' : '#888',
                    border: '1px solid', borderColor: role === 'viewer' ? '#fff' : 'rgba(255,255,255,0.1)',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  Viewer
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole('influencer')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px',
                    background: role === 'influencer' ? '#fff' : 'rgba(255,255,255,0.05)',
                    color: role === 'influencer' ? '#000' : '#888',
                    border: '1px solid', borderColor: role === 'influencer' ? '#fff' : 'rgba(255,255,255,0.1)',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  Creator
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole('business')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px',
                    background: role === 'business' ? '#ff4d85' : 'rgba(255,255,255,0.05)',
                    color: role === 'business' ? '#fff' : '#888',
                    border: '1px solid', borderColor: role === 'business' ? '#ff4d85' : 'rgba(255,255,255,0.1)',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  Business
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%', padding: '18px', marginTop: '16px',
              background: '#fff', color: '#000', fontWeight: 'bold', fontSize: '16px',
              border: 'none', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Profile')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#888', fontSize: '14px' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>

        {showBusinessWizard && (
          <div style={{ position: 'absolute', inset: 0, background: '#111', borderRadius: '24px', zIndex: 10, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ background: '#000', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
               <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>🚀 Beginning of your Business's AI Journey</h3>
            </div>
            
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {chatHistory.map((msg, idx) => (
                 <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? '#ff4d85' : 'rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '16px', maxWidth: '85%', color: '#fff', fontSize: '14px', lineHeight: 1.4 }}>
                   {msg.text && <div>{msg.text}</div>}
                   {msg.imagePreview && (
                     <img src={msg.imagePreview} alt="Preview" style={{ width: '100%', marginTop: '12px', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.2)', objectFit: 'contain', height: '180px', backgroundColor: '#000' }} />
                   )}
                 </div>
               ))}
               <div ref={messagesEndRef} />
               
               {wizardStep === 9 && (
                 <button onClick={() => {
                   onClose();
                   window.dispatchEvent(new CustomEvent('whitelabel_commit', { detail: wlConfig }));
                 }} style={{ marginTop: '20px', padding: '16px', background: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                   Boot New Operations Dashboard
                 </button>
               )}
            </div>
            
             {wizardStep === 5 && (
               <div style={{ padding: '20px', background: 'rgba(0,0,0,0.8)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '15px' }}>Click to append custom modular architectures to your network payload:</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                     {['About Us', 'Contact Us Form', 'Engineering Blog', 'Featured Merch'].map(sec => (
                        <button key={sec} onClick={(e) => {
                            e.preventDefault();
                            if (selectedSections.includes(sec)) setSelectedSections(s => s.filter(i => i !== sec));
                            else setSelectedSections(s => [...s, sec]);
                        }} style={{ padding: '10px 20px', borderRadius: '20px', background: selectedSections.includes(sec) ? wlConfig.accent : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>
                            {selectedSections.includes(sec) ? '✓ ' : '+ '} {sec}
                        </button>
                     ))}
                  </div>
                  <button onClick={(e) => {
                     e.preventDefault();
                     const finalStr = selectedSections.length > 0 ? selectedSections.join(', ') : 'None';
                     setChatInput(finalStr);
                     // Set a fast timeout so the state catches up before the main form handler triggers
                     setTimeout(() => {
                        document.getElementById('wizardSubmitBtn')?.click();
                     }, 50);
                  }} style={{ padding: '12px 24px', background: '#fff', color: '#000', fontWeight: 'bold', borderRadius: '12px', border: 'none', marginTop: '20px', cursor: 'pointer', width: '100%' }}>Deploy Selected Architectures</button>
               </div>
            )}
            
            {wizardStep < 9 && (
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim()) return;
                
                const input = chatInput;
                setChatHistory(h => [...h, { sender: 'user', text: input }]);
                setChatInput('');
                
                setTimeout(() => {
                  switch (wizardStep) {
                     case 0: {
                       setWlConfig(c => ({ ...c, name: input }));
                       window.dispatchEvent(new CustomEvent('whitelabel_update', { detail: { name: input } }));
                       document.title = input;
                       setChatHistory(h => [...h, { sender: 'bot', text: `Brilliant. '${input}' is officially staged. Do you already have a logo, or would you like our AI to generate one for you? (Type 'create one' or 'I have one').` }]);
                       setWizardStep(1);
                       break;
                     }
                     case 1: {
                       if (input.toLowerCase().includes('create') || input.toLowerCase().includes('yes')) {
                          setChatHistory(h => [...h, { sender: 'bot', text: `Awesome. Briefly describe what you want the logo to look like (e.g., 'A minimalist white lion logo').` }]);
                          setWizardStep(1.5);
                       } else {
                           const autoDomain = `${wlConfig.name.replace(/\s+/g, '').toLowerCase()}.vibenetwork.tv`;
                           setWlConfig(c => ({ ...c, domain: autoDomain }));
                           setChatHistory(h => [...h, { sender: 'bot', text: `Great, we'll use your text name for now and you can upload a logo file later. I've automatically assigned you the isolated subdomain: ${autoDomain}. Next, what are your primary brand colors? (e.g. "Black and Gold" or "Purple and Cyan").` }]);
                           setWizardStep(3);
                        }
                       break;
                     }
                     case 1.5: {
                       const logoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(input + ' minimal vector logomark isolated')}?width=300&height=300&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
                       setWlConfig(c => ({ ...c, logoImage: logoUrl }));
                       window.dispatchEvent(new CustomEvent('whitelabel_update', { detail: { logo: logoUrl } }));
                       const autoDomain = `${wlConfig.name.replace(/\s+/g, '').toLowerCase()}.vibenetwork.tv`;
                       setWlConfig(c => ({ ...c, domain: autoDomain }));
                       setChatHistory(h => [...h, { sender: 'bot', text: `Logo locked in! Here's a preview. I've automatically assigned you the isolated subdomain: ${autoDomain}. Next, what are your primary brand colors? (e.g. "Black and Gold" or "Purple and Cyan").`, imagePreview: logoUrl }]);
                       setWizardStep(3);
                       break;
                     }
                     case 2: {
                       // Step 2 is now deprecated/skipped.
                       break;
                     }
                     case 3: {
                       const colorInput = input.toLowerCase();
                       let bg = '#050505'; let accent = '#ff4d85';
                       
                       const colorMap: Record<string, { bg: string, accent: string }> = {
                         black: { bg: '#050505', accent: '#ffffff' },
                         dark: { bg: '#050505', accent: '#ffffff' },
                         white: { bg: '#f4f4f4', accent: '#111111' },
                         light: { bg: '#f4f4f4', accent: '#111111' },
                         blue: { bg: '#050c24', accent: '#0055ff' },
                         purple: { bg: '#12001a', accent: '#a600ff' },
                         green: { bg: '#001a09', accent: '#00ff44' },
                         red: { bg: '#1a0505', accent: '#ff0033' },
                         gold: { bg: '#1a1805', accent: '#ffd700' },
                         yellow: { bg: '#1a1a05', accent: '#ffea00' },
                         teal: { bg: '#051a1a', accent: '#00e5ff' },
                         pink: { bg: '#1a0510', accent: '#ff4d85' },
                         orange: { bg: '#1a0f05', accent: '#ff8800' },
                         cyan: { bg: '#051a1a', accent: '#00ffff' },
                         silver: { bg: '#111111', accent: '#c0c0c0' }
                       };

                       const mentioned = Object.keys(colorMap).filter(c => colorInput.includes(c));
                       if (mentioned.length === 1) {
                           bg = colorMap[mentioned[0]].bg;
                           accent = colorMap[mentioned[0]].accent;
                       } else if (mentioned.length > 1) {
                           bg = colorMap[mentioned[0]].bg;
                           accent = colorMap[mentioned[1]].accent;
                       }

                       const hexMatches = colorInput.match(/(#[0-9a-f]{3,6})/gi);
                       if (hexMatches) {
                           if (hexMatches.length === 1) {
                               accent = hexMatches[0];
                           } else if (hexMatches.length >= 2) {
                               bg = hexMatches[0];
                               accent = hexMatches[1];
                           }
                       }

                       if (bg === '#f4f4f4' || bg === '#ffffff') {
                           document.documentElement.setAttribute('data-theme', 'light');
                       } else {
                           document.documentElement.removeAttribute('data-theme');
                       }

                       document.documentElement.style.setProperty('--bg-color', bg);
                       window.dispatchEvent(new CustomEvent('whitelabel_update', { detail: { accent } }));
                       setWlConfig(c => ({ ...c, bg, accent }));
                       setChatHistory(h => [...h, { sender: 'bot', text: `Boom! Theming established. Now, do you want any video/image slider carousels added to your homepage? If so, how many? (e.g. '4').` }]);
                       setWizardStep(4);
                       break;
                     }
                     case 4: {
                       const count = parseInt(input.replace(/[^0-9]/g, '')) || 4;
                       setWlConfig(c => ({ ...c, sliderCount: count }));
                       setChatHistory(h => [...h, { sender: 'bot', text: `Done. ${count} core sliders allocated. Are there any other specific sections you need? (e.g. 'About Us', 'Contact Form', or 'None').` }]);
                       setWizardStep(5);
                       break;
                     }
                     case 5: {
                       setWlConfig(c => ({ ...c, customSections: input }));
                       setChatHistory(h => [...h, { sender: 'bot', text: `Got it. Now, what verbiage do you want in the main Hero section? Need help? Just type 'AI write it' and I'll generate premium marketing copy.` }]);
                       setWizardStep(6);
                       break;
                     }
                     case 6: {
                       let copy = input;
                       if (input.toLowerCase().includes('ai')) {
                          copy = `Welcome to the absolute pinnacle of digital media. ${wlConfig.name} is the premier destination for exclusive, high-quality streaming content.`;
                       }
                       setWlConfig(c => ({ ...c, heroCopy: copy }));
                       setChatHistory(h => [...h, { sender: 'bot', text: `Hero verbiage locked! Next, what about the Hero background image? Write a prompt for the AI to design it, or paste an image URL to upload your own.` }]);
                       setWizardStep(7);
                       break;
                     }
                     case 7: {
                       let imageUrl = input;
                       if (!input.startsWith('http')) {
                          imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(input)}?width=1920&height=1080&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
                       }
                       setWlConfig(c => ({ ...c, heroImage: imageUrl }));
                       setChatHistory(h => [...h, 
                         { sender: 'bot', text: `How does this background look? Type 'yes' to proceed, or write a new prompt to regenerate it!`, imagePreview: imageUrl }
                       ]);
                       setWizardStep(7.5);
                       break;
                     }
                     case 7.5: {
                       const ans = input.toLowerCase();
                       if (ans === 'yes' || ans === 'y' || ans === 'good' || ans === 'looks good') {
                          setChatHistory(h => [...h, { sender: 'bot', text: `Beautiful. Final Step: This White Label feature costs $199 for setup and your first month, then $99/mo. Please physically type 'I AGREE' to e-sign the 1-Year Service Agreement and process your invoice.` }]);
                          setWizardStep(8);
                       } else {
                          const newUrl = input.startsWith('http') ? input : `https://image.pollinations.ai/prompt/${encodeURIComponent(input + ' v2 masterpiece')}?width=1920&height=1080&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
                          setWlConfig(c => ({ ...c, heroImage: newUrl }));
                          setChatHistory(h => [...h, { sender: 'bot', text: `How about this one? Type 'yes' to proceed, or write a new prompt!`, imagePreview: newUrl }]);
                       }
                       break;
                     }
                     case 8: {
                       if (input.trim() === 'I AGREE') {
                          setChatHistory(h => [...h, { sender: 'bot', text: `Agreement securely executed. Payment processed. All systems go, your White Label architecture is fully staged and ready for administration.` }]);
                          setWizardStep(9);
                       } else {
                          setChatHistory(h => [...h, { sender: 'bot', text: `Signature invalid. You must precisely type 'I AGREE' to digitally execute the 1-Year Service contract.` }]);
                       }
                       break;
                     }
                  }
                }, 800);
                
              }} style={{ padding: '20px', background: 'rgba(0,0,0,0.5)', display: 'flex', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type your answer here..." style={{ flex: 1, padding: '20px', background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none' }} autoFocus />
                <button type="submit" id="wizardSubmitBtn" style={{ padding: '0 24px', background: '#fff', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Send</button>
              </form>
            )}
            
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default AuthModal;
