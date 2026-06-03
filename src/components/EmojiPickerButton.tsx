import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

interface EmojiPickerButtonProps {
  onSelect: (emoji: string) => void;
  color?: string;
  style?: React.CSSProperties;
}

export function EmojiPickerButton({ onSelect, color = '#fff', style }: EmojiPickerButtonProps) {
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div ref={containerRef} style={{ position: 'relative', ...style }}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setShowPicker(!showPicker);
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: showPicker ? '#ff3366' : color,
          opacity: showPicker ? 1 : 0.7,
          transition: 'color 0.2s, opacity 0.2s',
        }}
      >
        <Smile size={20} />
      </button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              zIndex: 1000,
              marginBottom: '10px'
            }}
          >
            <Suspense fallback={<div style={{ padding: '16px', background: '#0f0f0f', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '12px' }}>Loading...</div>}>
              <EmojiPicker 
                theme={'dark' as any}
                onEmojiClick={(emojiData: any) => {
                  onSelect(emojiData.emoji);
                  setShowPicker(false);
                }}
                lazyLoadEmojis={true}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
