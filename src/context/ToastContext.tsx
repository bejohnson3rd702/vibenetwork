/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useRef, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Loader2, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface ToastOptions {
  id?: string;
  title?: string;
  duration?: number;
  progress?: number;
}

export interface ToastItem {
  id: string;
  message: string;
  title?: string;
  type: ToastType;
  progress?: number;
  duration?: number;
}

export interface ToastContextType {
  success: (message: string, options?: ToastOptions | { duration?: number }) => string;
  error: (message: string, options?: ToastOptions | { duration?: number }) => string;
  info: (message: string, options?: ToastOptions | { duration?: number }) => string;
  warning: (message: string, options?: ToastOptions | { duration?: number }) => string;
  loading: (message: string, options?: ToastOptions | { duration?: number }) => string;
  dismiss: (id: string) => void;
  updateToast: (id: string, updates: Partial<ToastItem>) => void;
  toast?: ToastContextType;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    const existingTimeout = timeoutsRef.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addOrUpdateToast = useCallback(
    (message: string, type: ToastType, options?: ToastOptions | { duration?: number }): string => {
      const id = (options && 'id' in options && options.id) ? options.id : Math.random().toString(36).substring(2, 9);
      const title = options && 'title' in options ? options.title : undefined;
      const progress = options && 'progress' in options ? options.progress : undefined;
      const duration = options && 'duration' in options ? options.duration : (type === 'loading' ? 0 : 5000);

      // Clear previous timeout if this toast is being updated
      const existingTimeout = timeoutsRef.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        timeoutsRef.current.delete(id);
      }

      setToasts((prev) => {
        const index = prev.findIndex((t) => t.id === id);
        const newItem: ToastItem = { id, message, title, type, progress, duration };
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = newItem;
          return updated;
        }
        return [...prev, newItem];
      });

      // Schedule removal only if duration > 0 (not indefinitely loading)
      if (duration && duration > 0) {
        const timeout = setTimeout(() => {
          removeToast(id);
        }, duration);
        timeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    [removeToast]
  );

  const updateToast = useCallback((id: string, updates: Partial<ToastItem>) => {
    setToasts((prev) => {
      const index = prev.findIndex((t) => t.id === id);
      if (index === -1) return prev;
      const updated = [...prev];
      const existing = updated[index];
      const merged: ToastItem = { ...existing, ...updates };
      updated[index] = merged;

      // Handle duration update if type changed from loading
      if (updates.type && updates.type !== 'loading') {
        const dur = updates.duration || 5000;
        const existingTimeout = timeoutsRef.current.get(id);
        if (existingTimeout) clearTimeout(existingTimeout);
        const t = setTimeout(() => {
          removeToast(id);
        }, dur);
        timeoutsRef.current.set(id, t);
      }

      return updated;
    });
  }, [removeToast]);

  const contextValue: ToastContextType = {
    success: (msg, opts) => addOrUpdateToast(msg, 'success', opts),
    error: (msg, opts) => addOrUpdateToast(msg, 'error', opts),
    info: (msg, opts) => addOrUpdateToast(msg, 'info', opts),
    warning: (msg, opts) => addOrUpdateToast(msg, 'warning', opts),
    loading: (msg, opts) => addOrUpdateToast(msg, 'loading', opts),
    dismiss: removeToast,
    updateToast,
  };
  contextValue.toast = contextValue; // Allow `const { toast } = useToast()` or `const toast = useToast()`

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          pointerEvents: 'none',
          maxWidth: '92vw'
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isLoading = toast.type === 'loading';
            const isWarning = toast.type === 'warning';

            const accentColor = isSuccess
              ? '#10b981'
              : isError
              ? '#ef4444'
              : isLoading
              ? '#8b5cf6'
              : isWarning
              ? '#f59e0b'
              : 'var(--accent-primary, #3b82f6)';

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  background: 'rgba(18, 18, 26, 0.95)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  color: 'var(--text-primary, #fff)',
                  padding: '14px 18px',
                  borderRadius: 14,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderLeft: `5px solid ${accentColor}`,
                  boxShadow: `0 12px 35px -4px rgba(0,0,0,0.7), 0 0 20px ${accentColor}25`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  pointerEvents: 'auto',
                  minWidth: 320,
                  maxWidth: 440,
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isLoading && (
                      <Loader2
                        size={20}
                        color={accentColor}
                        style={{ animation: 'spin 1s linear infinite' }}
                      />
                    )}
                    {isSuccess && <CheckCircle size={20} color={accentColor} />}
                    {isError && <AlertCircle size={20} color={accentColor} />}
                    {isWarning && <AlertCircle size={20} color={accentColor} />}
                    {toast.type === 'info' && <Info size={20} color={accentColor} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {toast.title && (
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#fff',
                          marginBottom: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        {toast.title}
                        {isLoading && (
                          <span
                            style={{
                              fontSize: '10px',
                              padding: '1px 6px',
                              borderRadius: '6px',
                              background: 'rgba(139, 92, 246, 0.25)',
                              color: '#c4b5fd',
                              fontWeight: 600,
                              letterSpacing: '0.5px'
                            }}
                          >
                            PROCESSING
                          </span>
                        )}
                        {isSuccess && (
                          <span
                            style={{
                              fontSize: '10px',
                              padding: '1px 6px',
                              borderRadius: '6px',
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#6ee7b7',
                              fontWeight: 600
                            }}
                          >
                            ACTIVE
                          </span>
                        )}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '12.5px',
                        color: 'rgba(255, 255, 255, 0.88)',
                        lineHeight: 1.45,
                        wordBreak: 'break-word'
                      }}
                    >
                      {toast.message}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    aria-label="Dismiss notification"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      padding: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 4,
                      transition: 'color 0.15s ease',
                      flexShrink: 0
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)')}
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Progress bar if progress percentage is provided */}
                {toast.progress !== undefined && toast.progress >= 0 && (
                  <div
                    style={{
                      width: '100%',
                      height: 5,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      marginTop: 2
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(0, toast.progress))}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #3b82f6, #a855f7, #10b981)',
                        borderRadius: 3
                      }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
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
