import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

interface EmojiPickerButtonProps {
  onSelect: (emoji: string) => void;
  color?: string;
  style?: React.CSSProperties;
  pickerStyle?: React.CSSProperties;
  pickerWidth?: number;
  pickerHeight?: number;
}

export function EmojiPickerButton({
  onSelect,
  color = '#fff',
  style,
  pickerStyle,
  pickerWidth = 310,
  pickerHeight = 350
}: EmojiPickerButtonProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [rightOffset, setRightOffset] = useState<number | string>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamically position popover so it never gets cut off by parent overflow: hidden or screen edges
  useEffect(() => {
    if (showPicker && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const parent = containerRef.current.closest<HTMLElement>('[style*="350px"]') || 
                     containerRef.current.closest<HTMLElement>('form') ||
                     containerRef.current.parentElement;
      const parentRect = parent ? parent.getBoundingClientRect() : { left: 0, right: window.innerWidth };
      const pickerW = Math.min(pickerWidth, window.innerWidth - 20);

      // If anchored at right: 0 relative to button, calculate where left edge lands
      const anticipatedLeft = rect.right - pickerW;
      if (anticipatedLeft < parentRect.left + 10) {
        // Shift picker rightwards to stay inside container with 10px margin
        const overflow = (parentRect.left + 10) - anticipatedLeft;
        const maxShift = (parentRect.right - 10) - rect.right;
        const shift = Math.min(overflow, Math.max(0, maxShift));
        setRightOffset(-shift);
      } else {
        setRightOffset(0);
      }
    }
  }, [showPicker, pickerWidth]);

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

  const effectiveWidth = Math.min(pickerWidth, typeof window !== 'undefined' ? window.innerWidth - 24 : 310);

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
              right: rightOffset,
              zIndex: 9999,
              marginBottom: '10px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 12px 36px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.12)',
              ...pickerStyle
            }}
          >
            <Suspense fallback={<div style={{ padding: '16px', background: '#0f0f0f', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '12px' }}>Loading...</div>}>
              <EmojiPicker 
                theme={'dark' as any}
                width={effectiveWidth}
                height={pickerHeight}
                previewConfig={{
                  showPreview: false
                }}
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
