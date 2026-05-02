import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X, Mail, Lock, ShieldCheck, ArrowRight, Loader, AtSign } from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

interface EndUserAuthModalProps {
  onClose: () => void;
}

export default function EndUserAuthModal({ onClose }: EndUserAuthModalProps) {
  const { wlConfig } = useWhiteLabel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'viewer' | 'influencer'>('viewer');

  // Use the whitelabel primary color, fallback to a standard B2B blue
  const accentColor = wlConfig?.accent || '#0055ff';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Strict Login DB Isolation Check
        if (data.user?.user_metadata?.whitelabel_id !== wlConfig?.id) {
           await supabase!.auth.signOut();
           throw new Error("Invalid credentials for this network.");
        }
        
        onClose();
      } else {
        const { error } = await supabase!.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              username,
              role,
              whitelabel_id: wlConfig?.id
            }
          }
        });
        if (error) throw error;
        alert('Check your email to verify your account!');
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        background: '#0d0d0d',
        width: '100%',
        maxWidth: '450px',
        borderRadius: '24px',
        border: `1px solid ${accentColor}44`,
        boxShadow: `0 20px 60px ${accentColor}22`,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header Block */}
        <div style={{
          background: `linear-gradient(135deg, ${accentColor}22 0%, #000 100%)`,
          padding: '40px 30px 20px 30px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'relative'
        }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.4)', border: 'none', color: '#888', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
            onMouseOver={e=>e.currentTarget.style.color='#fff'}
            onMouseOut={e=>e.currentTarget.style.color='#888'}
          >
            <X size={20} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
             {wlConfig?.logoImage ? (
                <img src={wlConfig.logoImage} onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(wlConfig.name || 'Vibe')}&background=random`} style={{ height: '40px', objectFit: 'contain' }} alt="Logo" />
             ) : (
                <div style={{ background: accentColor, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <ShieldCheck size={28} color="#fff" />
                </div>
             )}
             {wlConfig?.name && (
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>
                   {wlConfig.name}
                </span>
             )}
          </div>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#fff', fontWeight: 900 }}>
             {isLogin ? 'Access Portal' : 'Register Account'}
          </h2>
          <p style={{ color: '#aaa', margin: '8px 0 0 0', fontSize: '15px' }}>
             Secure entry to the {wlConfig?.name || 'Enterprise'} environment.
          </p>
        </div>

        {/* Input Block */}
        <form onSubmit={handleAuth} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
           {errorMsg && (
              <div style={{ background: 'rgba(255, 50, 50, 0.1)', color: '#ff4444', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(255, 50, 50, 0.2)' }}>
                 {errorMsg}
              </div>
           )}

           {!isLogin && (
             <div>
               <div style={{ position: 'relative' }}>
                 <AtSign size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                 <input 
                   type="text" 
                   value={username}
                   onChange={e=>setUsername(e.target.value)}
                   required
                   placeholder="Choose a Username" 
                   style={{ width: '100%', background: '#050505', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '16px 16px 16px 48px', borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} 
                   onFocus={e=>e.currentTarget.style.borderColor = accentColor}
                   onBlur={e=>e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                 />
               </div>
             </div>
           )}

           <div>
              <label style={{ display: 'block', color: '#888', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Global Credentials</label>
              <div style={{ position: 'relative' }}>
                 <Mail size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                 <input 
                   type="email" 
                   value={email}
                   onChange={e=>setEmail(e.target.value)}
                   required
                   placeholder="name@company.com" 
                   style={{ width: '100%', background: '#050505', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '16px 16px 16px 48px', borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }} 
                   onFocus={e=>e.currentTarget.style.borderColor = accentColor}
                   onBlur={e=>e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                 />
              </div>
           </div>

           <div>
              <div style={{ position: 'relative' }}>
                 <Lock size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                 <input 
                   type="password" 
                   value={password}
                   onChange={e=>setPassword(e.target.value)}
                   required
                   placeholder="••••••••" 
                   style={{ width: '100%', background: '#050505', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '16px 16px 16px 48px', borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }} 
                   onFocus={e=>e.currentTarget.style.borderColor = accentColor}
                   onBlur={e=>e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                 />
              </div>
           </div>

           {!isLogin && (
             <div style={{ marginTop: '5px' }}>
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
                     background: role === 'influencer' ? accentColor : 'rgba(255,255,255,0.05)',
                     color: role === 'influencer' ? '#fff' : '#888',
                     border: '1px solid', borderColor: role === 'influencer' ? accentColor : 'rgba(255,255,255,0.1)',
                     cursor: 'pointer', transition: 'all 0.2s'
                   }}
                 >
                   Creator
                 </button>
               </div>
             </div>
           )}

           <button 
             type="submit" 
             disabled={loading}
             style={{ background: accentColor, color: '#fff', padding: '16px', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', marginTop: '10px' }}
             onMouseOver={e=>!loading && (e.currentTarget.style.filter = 'brightness(1.1)')}
             onMouseOut={e=>!loading && (e.currentTarget.style.filter = 'brightness(1)')}
           >
              {loading ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : (isLogin ? 'Authenticate' : 'Create Access Token')}
              {!loading && <ArrowRight size={18} />}
           </button>
        </form>

        <div style={{ padding: '0 30px 30px 30px', textAlign: 'center' }}>
           <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
             {isLogin ? "Need remote access?" : "Already provisioned?"}
             <button 
                onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: accentColor, fontWeight: 'bold', marginLeft: '6px', cursor: 'pointer' }}>
                {isLogin ? "Register Account" : "Login Here"}
             </button>
           </p>
        </div>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
