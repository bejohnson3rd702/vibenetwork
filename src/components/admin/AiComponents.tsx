import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { DictationButton } from '../DictationButton';
import { EmojiPickerButton } from '../EmojiPickerButton';

export const AiInput = ({ defaultValue, label, placeholder, accent, onChange }: { defaultValue: string, label: string, placeholder?: string, accent: string, onChange?: (v: string) => void }) => {
   const [val, setVal] = useState(defaultValue || '');
   const [isAiLoading, setIsAiLoading] = useState(false);

   const triggerAi = async () => {
      setIsAiLoading(true);
      await new Promise(r => setTimeout(r, 800));
      const phrases = [
         "Accelerate Growth Intelligently",
         "Unlock Scalable Enterprise Value",
         "Transform Your Digital Workflow",
         "Next-Gen Conversion Architecture",
         "Premium White-Label Infrastructure",
         "Elevate Your Brand Narrative"
      ];
      const cleanText = phrases[Math.floor(Math.random() * phrases.length)];
      setVal(cleanText);
      if (onChange) onChange(cleanText);
      setIsAiLoading(false);
   };

   return (
       <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
             <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>{label}</label>
             <button onClick={triggerAi} style={{ background: `linear-gradient(45deg, ${accent}, #a600ff)`, border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s', opacity: isAiLoading ? 0.7 : 1 }}>
                <Sparkles size={14} /> {isAiLoading ? 'Synthesizing...' : 'AI Enhance'}
             </button>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input type="text" value={val} onChange={e=>{setVal(e.target.value); if(onChange) onChange(e.target.value);}} placeholder={placeholder || "Type here..."} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', padding: '16px', paddingRight: '50px', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
            <div style={{ position: 'absolute', right: '10px', display: 'flex', gap: '4px' }}>
              <EmojiPickerButton onSelect={(emoji) => {
                const newVal = val + emoji;
                setVal(newVal);
                if (onChange) onChange(newVal);
              }} />
              <DictationButton onResult={(text) => {
                const newVal = val ? `${val} ${text}` : text;
                setVal(newVal);
                if (onChange) onChange(newVal);
              }} />
            </div>
          </div>
       </div>
   )
}

export const AiTextArea = ({ defaultValue, label, rows=4, accent, onChange }: { defaultValue: string, label?: string, rows?: number, accent: string, onChange?: (v: string) => void }) => {
   const [val, setVal] = useState(defaultValue || '');
   const [isAiLoading, setIsAiLoading] = useState(false);

   const triggerAi = async () => {
      setIsAiLoading(true);
      await new Promise(r => setTimeout(r, 1200));
      const paragraphs = [
         "Revolutionize your enterprise operations with our AI-driven SaaS platform, delivering real-time analytics, seamless integrations, and adaptive automation that reduces costs while boosting productivity. Partner with us to unlock next-generation insights, secure data governance, and scalable performance that keeps your business at the forefront of industry innovation.",
         "Elevate your brand narrative with our high-performance content engine, delivering hyper-personalized copy that resonates with each stakeholder across the sales funnel. Secure higher ROI and streamline collaboration by integrating our platform's robust analytics into your existing tech stack.",
         "Unlock unprecedented scalability and data security with our enterprise-grade infrastructure built specifically for modern digital agencies. Experience frictionless onboarding, granular access controls, and a fully customizable white-label experience designed to maximize your recurring revenue."
      ];
      const cleanText = paragraphs[Math.floor(Math.random() * paragraphs.length)];
      setVal(cleanText);
      if (onChange) onChange(cleanText);
      setIsAiLoading(false);
   };

   return (
       <div style={{ flex: 1, background: label ? 'rgba(255,255,255,0.02)' : 'transparent', padding: label ? '30px' : '0', borderRadius: '20px', border: label ? '1px solid rgba(255,255,255,0.05)' : 'none', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
             {label ? <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>{label}</label> : <span />}
             <button onClick={triggerAi} style={{ background: `linear-gradient(45deg, ${accent}, #0055ff)`, border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s', opacity: isAiLoading ? 0.7 : 1 }}>
                <Sparkles size={14} /> {isAiLoading ? 'Synthesizing...' : 'AI Re-Write'}
             </button>
          </div>
          <div style={{ position: 'relative' }}>
            <textarea rows={rows} value={val} onChange={e=>{setVal(e.target.value); if(onChange) onChange(e.target.value);}} placeholder="Type here..." style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', padding: '20px', paddingRight: '50px', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
            <div style={{ position: 'absolute', right: '10px', bottom: '10px', display: 'flex', gap: '4px' }}>
              <EmojiPickerButton onSelect={(emoji) => {
                const newVal = val + emoji;
                setVal(newVal);
                if (onChange) onChange(newVal);
              }} />
              <DictationButton onResult={(text) => {
                const newVal = val ? `${val} ${text}` : text;
                setVal(newVal);
                if (onChange) onChange(newVal);
              }} />
            </div>
          </div>
       </div>
   )
}
