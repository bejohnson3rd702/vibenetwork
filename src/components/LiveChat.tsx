import { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';

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
  const [input, setInput] = useState("");
  const autoScrollRef = useRef<HTMLDivElement>(null);
  
  const [isActive, setIsActive] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    setIsActive(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, 10000);
  };

  useEffect(() => {
    resetTimer();
    const handleActivity = () => resetTimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // Generate initial messages
    const initial = Array.from({length: 5}).map((_, i) => ({
      id: Math.random().toString(),
      user: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      text: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
      time: new Date(Date.now() - (5-i)*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }));
    setMessages(initial);

    // Simulate incoming live chat messages
    const interval = setInterval(() => {
      setMessages(prev => {
        const newMsg = {
          id: Math.random().toString(),
          user: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
          text: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        const next = [...prev, newMsg];
        if (next.length > 15) next.shift(); // Keep bounded
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [streamId]);

  useEffect(() => {
    if (autoScrollRef.current) {
      autoScrollRef.current.scrollTop = autoScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => {
      const next = [...prev, {
        id: Math.random().toString(),
        user: "You",
        text: input,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }];
      if (next.length > 15) next.shift();
      return next;
    });
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
        <span style={{ fontSize: '12px', color: '#888' }}>{Math.floor(Math.random() * 5000 + 1000).toLocaleString()} watching</span>
      </div>

      <div ref={autoScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', scrollBehavior: 'smooth' }}>
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
