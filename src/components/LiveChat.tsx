import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { supabase } from '../supabaseClient';

const MOCK_NAMES = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Sam", "Avery"];
const MOCK_MESSAGES = [
  "This stream is fire! 🔥", 
  "Wait, how did they do that?!", 
  "LFG!", 
  "dropping a sub for this", 
  "Does anyone know what time the next segment starts?",
  "yooo 👏", 
  "Can't believe I caught this live.", 
  "The production quality is insane.",
  "hi from brazil 🇧🇷",
  "anyone else lagging?"
];

export default function LiveChat({ streamId }: { streamId: string }) {
  const [messages, setMessages] = useState<{id: string, user: string, text: string, time: string}[]>([]);
  const [viewersCount] = useState(() => Math.floor(Math.random() * 5000 + 1000).toLocaleString());
  const [input, setInput] = useState("");
  const autoScrollRef = useRef<HTMLDivElement>(null);
  
  const [isActive, setIsActive] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimer = () => {
    setIsActive(prev => {
      if (!prev) return true;
      return prev;
    });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, 10000);
  };

  // Realtime Broadcast Channel
  const channelRef = useRef<any>(null);

  useEffect(() => {
    resetTimer();
    let lastUpdate = 0;
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > 1000) {
        resetTimer();
        lastUpdate = now;
      }
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // 1. Initial Mocks (isolated session)
    const initial = Array.from({length: 5}).map((_, i) => ({
      id: Math.random().toString(),
      user: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      text: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
      time: new Date(Date.now() - (5-i)*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }));
    setMessages(initial);

    // 2. Realtime WebSocket binding specifically for this single live stream
    if (supabase) {
      const channelId = `live-chat-${streamId}`;
      const channel = supabase.channel(channelId);
      
      channel.on('broadcast', { event: 'new-message' }, (payload) => {
         setMessages(prev => {
           const next = [...prev, payload.payload.message];
           if (next.length > 10) next.shift();
           return next;
         });
      }).subscribe();
      
      channelRef.current = channel;
    }

    // 3. Local simulated bots to keep chat feeling active
    const activeBots = setInterval(() => {
      setMessages(prev => {
        const newMsg = {
          id: Math.random().toString(),
          user: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
          text: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        const next = [...prev, newMsg];
        if (next.length > 10) next.shift(); // Keep bounded
        return next;
      });
    }, 4500);

    return () => {
      clearInterval(activeBots);
      if (channelRef.current) {
        supabase?.removeChannel(channelRef.current);
      }
    };
  }, [streamId]);

  useEffect(() => {
    if (autoScrollRef.current) {
      autoScrollRef.current.scrollTop = autoScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const myMessage = {
      id: Math.random().toString(),
      user: "You",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    // Inject instantly locally
    setMessages(prev => {
      const next = [...prev, myMessage];
      if (next.length > 10) next.shift();
      return next;
    });
    
    // Blast to anyone else currently watching this exact stream ID
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'new-message',
        payload: { message: myMessage }
      });
    }
    
    setInput("");
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', 
      background: 'rgba(0,0,0,0.8)', borderLeft: isActive ? '1px solid rgba(255,255,255,0.1)' : 'none',
      overflow: 'hidden',
      width: isActive ? '350px' : '0px',
      opacity: isActive ? 1 : 0,
      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out'
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Live Chat <span style={{ width: '8px', height: '8px', background: '#ff0055', borderRadius: '50%', display: 'inline-block' }}></span>
        </h3>
        <span style={{ fontSize: '12px', color: '#888' }}>{viewersCount} watching</span>
      </div>

      <div ref={autoScrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', scrollBehavior: 'smooth', maxHeight: '450px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: '12px', opacity: 0.9 }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={14} color="#888" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '13px', color: msg.user === 'You' ? '#00ff88' : '#fff' }}>{msg.user}</span>
                <span style={{ fontSize: '10px', color: '#555' }}>{msg.time}</span>
              </div>
              <span style={{ fontSize: '14px', lineHeight: 1.4, wordBreak: 'break-word', marginTop: '2px' }}>{msg.text}</span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px', background: '#111' }}>
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '10px 16px', color: '#fff', outline: 'none' }}
        />
        <button type="submit" disabled={!input.trim()} style={{ background: input.trim() ? '#00ff88' : 'rgba(255,255,255,0.1)', color: '#000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: '0.2s' }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
