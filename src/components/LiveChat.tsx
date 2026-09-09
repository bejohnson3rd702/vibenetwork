import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { DictationButton } from './DictationButton';
import { EmojiPickerButton } from './EmojiPickerButton';

interface LiveChatProps {
  streamId: string;
  isStreamer?: boolean;
  isStreamLive?: boolean;
}

export default function LiveChat({ streamId, isStreamer = false, isStreamLive }: LiveChatProps) {
  const storageKey = `vibe_live_chat_${streamId.toLowerCase()}`;

  const [messages, setMessages] = useState<{id: string, user: string, text: string, time: string, isSuperTip?: boolean, amount?: number}[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.messages) && Date.now() - (parsed.updatedAt || 0) < 12 * 60 * 60 * 1000) {
            return parsed.messages;
          }
        }
      } catch (_) {}
    }
    return [];
  });

  const [viewersCount, setViewersCount] = useState(0);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const autoScrollRef = useRef<HTMLDivElement>(null);

  // Check if current user is the streamer/host
  const isActualStreamer = isStreamer || Boolean(
    currentUser?.username && (
      currentUser.username.toLowerCase() === streamId.toLowerCase()
    )
  );

  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('profiles').select('username').eq('id', session.user.id).single().then(({ data }) => {
          if (data) {
            setCurrentUser(data);
          } else {
            setCurrentUser({ username: session.user.email?.split('@')[0] || 'User' });
          }
        });
      }
    });
  }, []);
  
  // Super-Tip States
  const [showSuperTipPanel, setShowSuperTipPanel] = useState(false);
  const [tipAmount, setTipAmount] = useState<number>(5);
  const [tipMessage, setTipMessage] = useState("");
  const [pinnedSuperTip, setPinnedSuperTip] = useState<any | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.pinnedSuperTip && Date.now() - (parsed.updatedAt || 0) < 30 * 1000) {
            return parsed.pinnedSuperTip;
          }
        }
      } catch (_) {}
    }
    return null;
  });
  const [pinTimeLeft, setPinTimeLeft] = useState(30);

  // Disappearing chat on idle (commented out):
  // const [isActive, setIsActive] = useState(true);
  // const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // const resetTimer = () => {
  //   setIsActive(prev => {
  //     if (!prev) return true;
  //     return prev;
  //   });
  //   if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //   timeoutRef.current = setTimeout(() => {
  //     setIsActive(false);
  //   }, 20000); // 20s idle
  // };

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

  // Save messages to session and local storage so they stay on page refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (messages.length > 0 || pinnedSuperTip) {
      try {
        const payload = JSON.stringify({
          messages,
          pinnedSuperTip,
          updatedAt: Date.now(),
        });
        sessionStorage.setItem(storageKey, payload);
        localStorage.setItem(storageKey, payload);
      } catch (_) {}
    }
  }, [messages, pinnedSuperTip, storageKey]);

  const wasLiveRef = useRef<boolean>(false);

  // Clear chat when the stream ends (was live, now ended)
  useEffect(() => {
    if (isStreamLive) {
      wasLiveRef.current = true;
    } else if (wasLiveRef.current && isStreamLive === false) {
      console.log('[LiveChat] Stream ended (was live, now offline). Clearing chat.');
      wasLiveRef.current = false;
      setMessages([]);
      setPinnedSuperTip(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(storageKey);
        localStorage.removeItem(storageKey);
      }
    }
  }, [isStreamLive, storageKey]);

  // Also listen for explicit stream-ended events
  useEffect(() => {
    const handleStreamEndEvent = () => {
      console.log('[LiveChat] Received stream-ended window event. Clearing chat.');
      wasLiveRef.current = false;
      setMessages([]);
      setPinnedSuperTip(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(storageKey);
        localStorage.removeItem(storageKey);
      }
    };
    window.addEventListener('vibe_stream_ended', handleStreamEndEvent);
    return () => window.removeEventListener('vibe_stream_ended', handleStreamEndEvent);
  }, [storageKey]);

  // Realtime Broadcast Channel
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (supabase) {
      const channelId = `live-chat-${streamId}`;
      const channel = supabase.channel(channelId);
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          let watchers = 0;
          Object.values(state).forEach((presences: any) => {
            presences.forEach((p: any) => {
              // Do not count the streamer/host as a watcher
              const isHostPresence = p.isStreamer === true || 
                p.role === 'streamer' || 
                (p.username && p.username.toLowerCase() === streamId.toLowerCase());
              if (!isHostPresence) {
                watchers++;
              }
            });
          });
          setViewersCount(watchers);
        })
        .on('broadcast', { event: 'stream-ended' }, () => {
          console.log('[LiveChat] Received broadcast stream-ended. Clearing chat.');
          wasLiveRef.current = false;
          setMessages([]);
          setPinnedSuperTip(null);
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(storageKey);
            localStorage.removeItem(storageKey);
          }
        })
        .on('broadcast', { event: 'new-message' }, (payload) => {
          const msg = payload.payload.message;
          // Skip messages sent by the current user (they were already added optimistically)
          if (currentUser && msg.user === currentUser.username && !msg.isSuperTip) return;
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
            await channel.track({
              online_at: new Date().toISOString(),
              isStreamer: isActualStreamer,
              role: isActualStreamer ? 'streamer' : 'watcher',
              username: currentUser?.username || undefined,
            });
          }
        });
      
      channelRef.current = channel;
    }

    return () => {
      if (channelRef.current) {
        supabase?.removeChannel(channelRef.current);
      }
    };
  }, [streamId, isActualStreamer]);

  // Update presence role when currentUser finishes loading
  useEffect(() => {
    if (channelRef.current && currentUser) {
      channelRef.current.track({
        online_at: new Date().toISOString(),
        isStreamer: isActualStreamer,
        role: isActualStreamer ? 'streamer' : 'watcher',
        username: currentUser.username,
      }).catch(() => {});
    }
  }, [currentUser, isActualStreamer]);

  useEffect(() => {
    if (autoScrollRef.current) {
      autoScrollRef.current.scrollTop = autoScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    
    const myMessage = {
      id: Math.random().toString(),
      user: currentUser?.username || 'Guest',
      text: trimmed,
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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleSendSuperTip = () => {
    if (!tipAmount) return;

    const myMessage = {
      id: Math.random().toString(),
      user: currentUser?.username || 'Guest',
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
      background: 'rgba(0,0,0,0.85)', 
      borderLeft: '1px solid rgba(255,255,255,0.1)',
      overflow: 'hidden',
      width: '350px',
      opacity: 1,
      // Commented out chat disappearing on idle:
      // borderLeft: isActive ? '1px solid rgba(255,255,255,0.1)' : 'none',
      // width: isActive ? '350px' : '0px',
      // opacity: isActive ? 1 : 0,
      // transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out'
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
                  <span style={{ fontWeight: 'bold', fontSize: '13px', color: (currentUser && msg.user === currentUser.username) ? '#00ff88' : '#fff' }}>{msg.user}</span>
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

      {/* Quick Reaction Emojis Bar */}
      <div style={{ padding: '6px 16px', display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Quick:</span>
        {['🔥', '👏', '❤️', '😂', '🎉', '💯'].map(em => (
          <button
            key={em}
            type="button"
            onClick={() => setInput(prev => prev + em)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '2px 4px',
              borderRadius: '6px',
              transition: 'transform 0.15s ease'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.25)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {em}
          </button>
        ))}
      </div>

      {/* Primary Message Input Form */}
      <form onSubmit={handleSend} style={{ position: 'relative', zIndex: 50, padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px', background: 'var(--bg-surface)', flexShrink: 0, alignItems: 'center' }}>
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
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Send a message..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '10px 16px', color: 'var(--text-primary)', outline: 'none', minWidth: 0 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <EmojiPickerButton pickerWidth={300} pickerHeight={350} onSelect={(emoji) => setInput(prev => prev + emoji)} />
          <DictationButton onResult={(text) => setInput(prev => prev ? `${prev} ${text}` : text)} />
        </div>
        <button type="submit" disabled={!input.trim()} style={{ background: input.trim() ? '#00ff88' : 'rgba(255,255,255,0.1)', color: '#000', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: '0.2s', flexShrink: 0 }}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
