import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const contextValue = {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'none'
      }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{
                background: toast.type === 'error' ? 'var(--bg-card, #222)' : 'var(--bg-card, #222)',
                color: 'var(--text-primary, #fff)',
                padding: '12px 16px',
                borderRadius: 8,
                borderLeft: `4px solid ${
                  toast.type === 'success' ? '#10b981' : 
                  toast.type === 'error' ? '#ef4444' : 
                  'var(--accent-primary, #3b82f6)'
                }`,
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                pointerEvents: 'auto',
                minWidth: 280,
                maxWidth: 400
              }}
            >
              {toast.type === 'success' && <CheckCircle size={20} color="#10b981" />}
              {toast.type === 'error' && <AlertCircle size={20} color="#ef4444" />}
              {toast.type === 'info' && <Info size={20} color="var(--accent-primary, #3b82f6)" />}
              
              <span style={{ flex: 1, fontSize: '0.9rem' }}>{toast.message}</span>
              
              <button 
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #888)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex'
                }}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
