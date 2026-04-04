import React, { useState } from 'react';
import { X, Upload, Users, Settings, Film, CheckCircle, Layout, Mail, Type, Image as ImageIcon, Sparkles } from 'lucide-react';

const AiInput = ({ defaultValue, label, placeholder, accent }: { defaultValue: string, label: string, placeholder?: string, accent: string }) => {
   const [val, setVal] = useState(defaultValue || '');
   const [isAiLoading, setIsAiLoading] = useState(false);

   const triggerAi = () => {
      setIsAiLoading(true);
      setTimeout(() => {
         setVal("Premium AI Generated Short-Copy");
         setIsAiLoading(false);
      }, 1200);
   };

   return (
       <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
             <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>{label}</label>
             <button onClick={triggerAi} style={{ background: `linear-gradient(45deg, ${accent}, #a600ff)`, border: 'none', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s', opacity: isAiLoading ? 0.7 : 1 }}>
                <Sparkles size={14} /> {isAiLoading ? 'Synthesizing...' : 'AI Enhance'}
             </button>
          </div>
          <input type="text" value={val} onChange={e=>setVal(e.target.value)} placeholder={placeholder || "Type here..."} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '16px', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
       </div>
   )
}

const AiTextArea = ({ defaultValue, label, rows=4, accent }: { defaultValue: string, label?: string, rows?: number, accent: string }) => {
   const [val, setVal] = useState(defaultValue || '');
   const [isAiLoading, setIsAiLoading] = useState(false);

   const triggerAi = () => {
      setIsAiLoading(true);
      setTimeout(() => {
         setVal("This is highly optimized AI generated long-form copy designed to maximize conversion rates and precisely articulate your brand's core value proposition to your target audience.");
         setIsAiLoading(false);
      }, 1500);
   };

   return (
       <div style={{ flex: 1, background: label ? 'rgba(255,255,255,0.02)' : 'transparent', padding: label ? '30px' : '0', borderRadius: '20px', border: label ? '1px solid rgba(255,255,255,0.05)' : 'none', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
             {label ? <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>{label}</label> : <span />}
             <button onClick={triggerAi} style={{ background: `linear-gradient(45deg, ${accent}, #0055ff)`, border: 'none', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s', opacity: isAiLoading ? 0.7 : 1 }}>
                <Sparkles size={14} /> {isAiLoading ? 'Synthesizing...' : 'AI Re-Write'}
             </button>
          </div>
          <textarea rows={rows} value={val} onChange={e=>setVal(e.target.value)} placeholder="Type here..." style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '20px', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
       </div>
   )
}

export default function BusinessAdminDashboard({ wlConfig, onClose }: { wlConfig: any; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('hero');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  return (
     <div style={{ position: 'fixed', inset: 0, background: '#0b0b0b', color: '#fff', zIndex: 999999, display: 'flex', flexDirection: 'column' }}>
       {/* Header */}
       <div style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: 40, height: 40, borderRadius: 8, background: wlConfig.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
               {wlConfig.name.substring(0, 2).toUpperCase()}
             </div>
             <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '1px' }}>{wlConfig.name} Network OS</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <X size={28} />
          </button>
       </div>
       
       <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{ width: '280px', background: '#050505', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
             
             <button onClick={() => setActiveTab('hero')} style={{ padding: '16px 20px', background: activeTab === 'hero' ? wlConfig.accent : 'transparent', color: activeTab === 'hero' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Type size={22} /> Hero Display Node
             </button>
             
             <button onClick={() => setActiveTab('sliders')} style={{ padding: '16px 20px', background: activeTab === 'sliders' ? wlConfig.accent : 'transparent', color: activeTab === 'sliders' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Film size={22} /> Grid & Sliders Data
             </button>

             <button onClick={() => setActiveTab('pages')} style={{ padding: '16px 20px', background: activeTab === 'pages' ? wlConfig.accent : 'transparent', color: activeTab === 'pages' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Layout size={22} /> About & Custom Hubs
             </button>

             <button onClick={() => setActiveTab('inbox')} style={{ padding: '16px 20px', background: activeTab === 'inbox' ? wlConfig.accent : 'transparent', color: activeTab === 'inbox' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Mail size={22} /> Ingest Leads (Inbox)
             </button>

             <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />

             <button style={{ padding: '16px 20px', background: 'transparent', color: '#555', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'not-allowed', textAlign: 'left', fontWeight: 'bold', fontSize: '15px' }}>
                <Users size={22} /> Monetization CRM
             </button>
          </div>
          
          {/* Main Workspace */}
          <div style={{ flex: 1, padding: '60px 80px', overflowY: 'auto' }}>
            
            {/* HERO EDITOR TAB */}
            {activeTab === 'hero' && (
              <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div>
                  <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Hero Billboard OS</h1>
                  <p style={{ color: '#888', fontSize: '18px', lineHeight: 1.5 }}>Tune the primary verbiage, dynamic CTA buttons, and background master layers of the main site entry point.</p>
                </div>
                
                <AiTextArea label="Hero Marketing Verbiage" defaultValue={wlConfig.heroCopy} accent={wlConfig.accent} />

                <div style={{ display: 'flex', gap: '20px' }}>
                   <AiInput label="Primary Button Text" defaultValue="Access Admin Dashboard" accent={wlConfig.accent} />
                   <AiInput label="Secondary Button (+ Add)" defaultValue="" placeholder="e.g. Subscribe Now" accent={wlConfig.accent} />
                </div>

                <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }} />
                <button style={{ padding: '18px 40px', background: wlConfig.accent, color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', maxWidth: '250px' }}>Save Hero Config</button>
              </div>
            )}

            {/* SLIDERS ENGINES TAB */}
            {activeTab === 'sliders' && (
              <div style={{ maxWidth: '900px' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Content Grid Deployment</h1>
                <p style={{ color: '#888', fontSize: '18px', marginBottom: '40px', lineHeight: 1.5 }}>Upload high-definition visuals, bind routing links, and inject media payloads into your operational carousels.</p>
                
                <div style={{ border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '24px', padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: '0.3s ease' }} onMouseOver={e=>e.currentTarget.style.borderColor = wlConfig.accent} onMouseOut={e=>e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}>
                   <div style={{ background: `${wlConfig.accent}22`, padding: '24px', borderRadius: '50%' }}>
                      <Upload size={48} color={wlConfig.accent} />
                   </div>
                   <div>
                     <h3 style={{ fontSize: '24px', margin: '0 0 12px 0', fontWeight: 'bold' }}>Drop Slider Assets Here</h3>
                     <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>Attach images or video files directly to any slot</p>
                   </div>
                   <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                     <select style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>
                        <option>Target: Slider Row 1</option>
                        <option>Target: Slider Row 2</option>
                        <option>Target: Slider Row 3</option>
                        <option>Target: Slider Row 4</option>
                     </select>
                     <input type="text" placeholder="URL Route on click (e.g. /video/1)" style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', minWidth: '250px' }} />
                   </div>
                   <button onClick={() => {
                      setUploadStatus('uploading');
                      setTimeout(() => setUploadStatus('success'), 2000);
                   }} style={{ marginTop: '24px', padding: '18px 40px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer' }}>
                      Execute Upload Bind
                   </button>
                </div>
                
                {uploadStatus === 'uploading' && (
                  <div style={{ marginTop: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '48px', height: '48px', border: `4px solid ${wlConfig.accent}44`, borderTopColor: wlConfig.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '18px' }}>Ingesting payload architecture...</p>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                         <div style={{ width: '65%', height: '100%', background: wlConfig.accent, transition: 'width 2s linear' }} />
                      </div>
                    </div>
                  </div>
                )}
                {uploadStatus === 'success' && (
                  <div style={{ marginTop: '40px', background: 'rgba(0,255,100,0.1)', border: '1px solid rgba(0,255,100,0.3)', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <CheckCircle size={40} color="#00ff88" />
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#00ff88', fontSize: '18px' }}>Injection Bound to Slider</p>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>The asset and routing logic is now live on the global grid.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PAGES & ARCHITECTURE TAB */}
            {activeTab === 'pages' && (
              <div style={{ maxWidth: '900px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                   <div>
                     <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Global Structural Pages</h1>
                     <p style={{ color: '#888', fontSize: '18px', lineHeight: 1.5 }}>Add or edit underlying dynamic pages mapped into your master loop.</p>
                   </div>
                   <button style={{ padding: '16px 24px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>+ Spawn New Section</button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {(wlConfig.customSections ? wlConfig.customSections.split(',') : ['Default About Base']).map((sec: string, idx: number) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '24px', color: wlConfig.accent }}>[Live] {sec.trim()}</h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                               <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Load Editor</button>
                               <button style={{ padding: '8px 16px', background: 'rgba(255,50,50,0.1)', color: '#ff3333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Disconnect</button>
                            </div>
                         </div>
                         <AiTextArea defaultValue="" accent={wlConfig.accent} />
                      </div>
                   ))}
                </div>
              </div>
            )}

            {/* INBOX TAB */}
            {activeTab === 'inbox' && (
              <div style={{ maxWidth: '900px' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Contact Lead Triage</h1>
                <p style={{ color: '#888', fontSize: '18px', marginBottom: '40px', lineHeight: 1.5 }}>View encrypted payloads transmitted directly from your network's Contact Us nodes.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <div style={{ display: 'table', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ display: 'table-row', background: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
                         <div style={{ display: 'table-cell', padding: '16px 20px' }}>Date</div>
                         <div style={{ display: 'table-cell', padding: '16px 20px' }}>Entity</div>
                         <div style={{ display: 'table-cell', padding: '16px 20px' }}>Payload Preview</div>
                         <div style={{ display: 'table-cell', padding: '16px 20px' }}>Action</div>
                      </div>
                      
                      <div style={{ display: 'table-row', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                         <div style={{ display: 'table-cell', padding: '16px 20px', color: '#888' }}>2 minutes ago</div>
                         <div style={{ display: 'table-cell', padding: '16px 20px', fontWeight: 'bold' }}>jordan@invest.com</div>
                         <div style={{ display: 'table-cell', padding: '16px 20px', color: '#ccc' }}>"We love the white label structure..."</div>
                         <div style={{ display: 'table-cell', padding: '16px 20px' }}>
                            <button style={{ padding: '8px 16px', background: wlConfig.accent, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>View Full</button>
                         </div>
                      </div>

                      <div style={{ display: 'table-row', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                         <div style={{ display: 'table-cell', padding: '16px 20px', color: '#888' }}>1 hour ago</div>
                         <div style={{ display: 'table-cell', padding: '16px 20px', fontWeight: 'bold' }}>support@local.com</div>
                         <div style={{ display: 'table-cell', padding: '16px 20px', color: '#ccc' }}>"Can I get a refund on the merch..."</div>
                         <div style={{ display: 'table-cell', padding: '16px 20px' }}>
                            <button style={{ padding: '8px 16px', background: wlConfig.accent, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>View Full</button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

          </div>
       </div>
       <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
     </div>
  );
}
