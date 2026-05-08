import { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            <EmojiPicker 
              theme={Theme.DARK}
              onEmojiClick={(emojiData: any) => {
                onSelect(emojiData.emoji);
                setShowPicker(false);
              }}
              lazyLoadEmojis={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
