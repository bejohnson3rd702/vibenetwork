import { Mic, MicOff } from 'lucide-react';
import { useDictation } from '../hooks/useDictation';
import { motion } from 'framer-motion';

interface DictationButtonProps {
  onResult: (text: string) => void;
  style?: React.CSSProperties;
  color?: string;
}

export function DictationButton({ onResult, style, color = '#fff' }: DictationButtonProps) {
  const { isListening, toggleListening, supported } = useDictation(onResult);

  if (!supported) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.preventDefault();
        toggleListening();
      }}
      title="Talk to Text"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isListening ? '#ff3366' : color,
        opacity: isListening ? 1 : 0.7,
        transition: 'color 0.2s, opacity 0.2s',
        ...style
      }}
    >
      {isListening ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Mic size={20} />
        </motion.div>
      ) : (
        <MicOff size={20} />
      )}
    </motion.button>
  );
}
