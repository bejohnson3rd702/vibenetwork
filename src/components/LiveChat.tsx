import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function LiveChat({ streamId }: { streamId: string }) {
  const [messages, setMessages] = useState<{id: string, user: string, text: string, time: string}[]>([]);
  const [viewersCount, setViewersCount] = useState(1);
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
    // Realtime WebSocket binding specifically for this single live stream
    if (supabase) {
      const channelId = `live-chat-${streamId}`;
      const channel = supabase.channel(channelId);
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          // Count total uniquely connected clients
          const totalViewers = Object.values(state).reduce((acc, presences) => acc + presences.length, 0);
          setViewersCount(totalViewers || 1);
        })
        .on('broadcast', { event: 'new-message' }, (payload) => {
          setMessages(prev => {
            const next = [...prev, payload.payload.message];
            if (next.length > 50) next.shift();
            return next;
          });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ online_at: new Date().toISOString() });
          }
        });
      
      channelRef.current = channel;
    }

    return () => {
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
      if (next.length > 50) next.shift();
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
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{viewersCount} watching</span>
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

      <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px', background: 'var(--bg-surface)' }}>
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '10px 16px', color: 'var(--text-primary)', outline: 'none' }}
        />
        <button type="submit" disabled={!input.trim()} style={{ background: input.trim() ? '#00ff88' : 'rgba(255,255,255,0.1)', color: '#000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: '0.2s' }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
