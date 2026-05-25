import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { DictationButton } from './DictationButton';
import { EmojiPickerButton } from './EmojiPickerButton';

export default function LiveChat({ streamId }: { streamId: string }) {
  const [messages, setMessages] = useState<{id: string, user: string, text: string, time: string, isSuperTip?: boolean, amount?: number}[]>([]);
  const [viewersCount, setViewersCount] = useState(1);
  const [input, setInput] = useState("");
  const autoScrollRef = useRef<HTMLDivElement>(null);
  
  // Super-Tip States
  const [showSuperTipPanel, setShowSuperTipPanel] = useState(false);
  const [tipAmount, setTipAmount] = useState<number>(5);
  const [tipMessage, setTipMessage] = useState("");
  const [pinnedSuperTip, setPinnedSuperTip] = useState<any | null>(null);
  const [pinTimeLeft, setPinTimeLeft] = useState(30);

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
    }, 20000); // 20s idle
  };

  // Pinned Super-Tip Timer Effect
  useEffect(() => {
    if (!pinnedSuperTip) return;
    setPinTimeLeft(30);
    const interval = setInterval(() => {
      setPinTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPinnedSuperTip(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pinnedSuperTip]);

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
    if (supabase) {
      const channelId = `live-chat-${streamId}`;
      const channel = supabase.channel(channelId);
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const totalViewers = Object.values(state).reduce((acc, presences) => acc + presences.length, 0);
          setViewersCount(totalViewers || 1);
        })
        .on('broadcast', { event: 'new-message' }, (payload) => {
          const msg = payload.payload.message;
          if (msg.isSuperTip) {
            setPinnedSuperTip(msg);
          }
          setMessages(prev => {
            const next = [...prev, msg];
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
    
    setMessages(prev => {
      const next = [...prev, myMessage];
      if (next.length > 50) next.shift();
      return next;
    });
    
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'new-message',
        payload: { message: myMessage }
      });
    }
    
    setInput("");
  };

  const handleSendSuperTip = () => {
    if (!tipAmount) return;

    const myMessage = {
      id: Math.random().toString(),
      user: "You",
      text: tipMessage.trim() || "Supported the stream! 🚀✨",
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      amount: tipAmount,
      isSuperTip: true
    };

    setMessages(prev => {
      const next = [...prev, myMessage];
      if (next.length > 50) next.shift();
      return next;
    });

    setPinnedSuperTip(myMessage);

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'new-message',
        payload: { message: myMessage }
      });
    }

    setTipMessage("");
    setShowSuperTipPanel(false);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', 
      background: 'rgba(0,0,0,0.85)', borderLeft: isActive ? '1px solid rgba(255,255,255,0.1)' : 'none',
      overflow: 'hidden',
      width: isActive ? '350px' : '0px',
      opacity: isActive ? 1 : 0,
      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out'
    }}>
      {/* Chat Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Live Chat <span style={{ width: '8px', height: '8px', background: '#ff0055', borderRadius: '50%', display: 'inline-block' }}></span>
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{viewersCount} watching</span>
      </div>

      {/* Pinned Glowing Super-Tip */}
      {pinnedSuperTip && (
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.15))', 
          borderBottom: '2px solid #FFD700',
          padding: '12px 16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '6px',
          boxShadow: '0 4px 15px rgba(255,215,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {/* Glowing particle effect lines */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#FFD700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              👑 {pinnedSuperTip.user} sent ${pinnedSuperTip.amount} Super-Tip!
            </span>
            <span style={{ fontSize: '10px', color: '#FFD700', opacity: 0.8 }}>Pinned • {pinTimeLeft}s</span>
          </div>
          <span style={{ fontSize: '13px', color: '#fff', fontStyle: 'italic', fontWeight: 500 }}>"{pinnedSuperTip.text}"</span>
        </div>
      )}

      {/* Scrollable Message List */}
      <div ref={autoScrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', scrollBehavior: 'smooth', maxHeight: '450px' }}>
        {messages.map(msg => {
          if (msg.isSuperTip) {
            return (
              <div 
                key={msg.id} 
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,165,0,0.08))', 
                  border: '1px solid rgba(255,215,0,0.3)', 
                  borderRadius: '16px', 
                  padding: '12px 16px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px',
                  boxShadow: '0 4px 10px rgba(255,215,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#FFD700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    👑 {msg.user} sent ${msg.amount} Super-Tip!
                  </span>
                  <span style={{ fontSize: '9px', color: '#888' }}>{msg.time}</span>
                </div>
                <span style={{ fontSize: '13px', color: '#fff', fontStyle: 'italic' }}>"{msg.text}"</span>
              </div>
            );
          }

          return (
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
          );
        })}
      </div>

      {/* Super-Tip Creator panel popup */}
      {showSuperTipPanel && (
        <div style={{ padding: '16px', background: 'rgba(15,15,20,0.98)', borderTop: '1px solid rgba(255,215,0,0.3)', display: 'flex', flexDirection: 'column', gap: '12px', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <h4 style={{ margin: 0, fontSize: '13px', color: '#FFD700', fontWeight: 'bold' }}>👑 Send Glowing Super-Tip</h4>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {[5, 10, 20, 50, 100].map(amt => (
              <button 
                key={amt} 
                type="button" 
                onClick={() => setTipAmount(amt)}
                style={{ 
                  flex: 1, 
                  padding: '8px 0', 
                  borderRadius: '20px', 
                  background: tipAmount === amt ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(255,255,255,0.05)', 
                  color: tipAmount === amt ? '#000' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  transition: '0.2s'
                }}
              >
                ${amt}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Highlight message..." 
              value={tipMessage}
              onChange={e => setTipMessage(e.target.value)}
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }}
            />
            <button 
              type="button" 
              onClick={handleSendSuperTip} 
              style={{ 
                background: 'linear-gradient(135deg, #FFD700, #FFA500)', 
                color: '#000', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '0 16px', 
                fontWeight: '900', 
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              SEND
            </button>
          </div>
        </div>
      )}

      {/* Primary Message Input Form */}
      <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px', background: 'var(--bg-surface)', flexShrink: 0, alignItems: 'center' }}>
        <button 
          type="button" 
          onClick={() => setShowSuperTipPanel(!showSuperTipPanel)} 
          style={{ 
            background: 'linear-gradient(135deg, #FFD700, #FFA500)', 
            border: 'none', 
            borderRadius: '50%', 
            width: '36px', 
            height: '36px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(255,215,0,0.3)',
            transition: '0.2s',
            flexShrink: 0
          }}
          title="Send Super-Tip"
        >
          👑
        </button>
        
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '10px 16px', color: 'var(--text-primary)', outline: 'none', minWidth: 0 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <EmojiPickerButton onSelect={(emoji) => setInput(prev => prev + emoji)} />
          <DictationButton onResult={(text) => setInput(prev => prev ? `${prev} ${text}` : text)} />
        </div>
        <button type="submit" disabled={!input.trim()} style={{ background: input.trim() ? '#00ff88' : 'rgba(255,255,255,0.1)', color: '#000', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: '0.2s', flexShrink: 0 }}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
