import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CreditCard, Sparkles, Copy, Check, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { getStripeClient } from '../lib/stripeConfig';
import toast from 'react-hot-toast';

interface StripeEmbeddedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string;
  productTitle: string;
  amount: number | string;
  productType?: string;
  downloadUrl?: string;
  onSuccess?: () => void;
}

export default function StripeEmbeddedCheckoutModal({
  isOpen,
  onClose,
  clientSecret,
  productTitle,
  amount,
  productType = 'digital',
  downloadUrl,
  onSuccess
}: StripeEmbeddedCheckoutModalProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const checkoutInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const displayAmount = typeof amount === 'number' 
    ? `$${amount.toFixed(2)}` 
    : String(amount).startsWith('$') ? amount : `$${amount}`;

  const effectiveDownloadUrl = downloadUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564';

  const copyTestCard = () => {
    navigator.clipboard.writeText('4242424242424242');
    setCopied(true);
    toast.success('Test Card (4242...) copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!isOpen || !clientSecret) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setPaymentCompleted(false);

    const initCheckout = async () => {
      try {
        const stripe = await getStripeClient();
        if (!stripe) {
          throw new Error('Stripe client initialization failed.');
        }

        if (checkoutInstanceRef.current) {
          checkoutInstanceRef.current.destroy();
          checkoutInstanceRef.current = null;
        }

        const checkoutCreator = (stripe as any).createEmbeddedCheckoutPage 
          ? (stripe as any).createEmbeddedCheckoutPage.bind(stripe)
          : (stripe as any).initEmbeddedCheckout 
          ? (stripe as any).initEmbeddedCheckout.bind(stripe)
          : null;

        if (!checkoutCreator) {
          throw new Error('Embedded checkout is not supported by this version of Stripe.js.');
        }

        const checkout = await checkoutCreator({
          clientSecret,
          onComplete: () => {
            if (isMounted) {
              setPaymentCompleted(true);
              toast.success(`Payment verified for ${productTitle}! 🎉`);
              if (onSuccess) onSuccess();
            }
          }
        });

        if (isMounted) {
          checkoutInstanceRef.current = checkout;
          if (mountRef.current) {
            mountRef.current.innerHTML = '';
            checkout.mount(mountRef.current);
          }
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Failed to mount Stripe embedded checkout:', err);
        if (isMounted) {
          setError(err.message || 'Failed to initialize in-app checkout.');
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(initCheckout, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (checkoutInstanceRef.current) {
        checkoutInstanceRef.current.destroy();
        checkoutInstanceRef.current = null;
      }
    };
  }, [isOpen, clientSecret]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(16px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(180deg, #111422 0%, #0b0d18 100%)',
            border: paymentCompleted ? '1px solid rgba(0, 255, 136, 0.5)' : '1px solid rgba(255, 77, 133, 0.35)',
            boxShadow: paymentCompleted 
              ? '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(0, 255, 136, 0.2)'
              : '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 77, 133, 0.15)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: paymentCompleted ? 'linear-gradient(135deg, #00ff88, #00e5ff)' : 'linear-gradient(135deg, #ff4d85, #8A2BE2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: paymentCompleted ? '#000' : '#fff',
                boxShadow: paymentCompleted ? '0 4px 15px rgba(0,255,136,0.3)' : '0 4px 15px rgba(255,77,133,0.3)'
              }}>
                {paymentCompleted ? <CheckCircle2 size={22} /> : <CreditCard size={20} />}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '0.3px' }}>
                  {paymentCompleted ? 'Purchase Successful!' : productTitle}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                  <span style={{ color: '#00ff88', fontWeight: 900, fontSize: '15px' }}>
                    {displayAmount}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>•</span>
                  <span style={{ color: '#aaa', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={13} color="#00ff88" /> {paymentCompleted ? 'Verified by Stripe' : '256-Bit SSL Encrypted'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 77, 77, 0.2)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
            >
              <X size={18} />
            </button>
          </div>

          {!paymentCompleted && (
            <div style={{
              background: 'rgba(99, 91, 255, 0.12)',
              borderBottom: '1px solid rgba(99, 91, 255, 0.3)',
              padding: '10px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd' }}>
                <Sparkles size={14} color="#a594fd" />
                <span><strong>Stripe Test Mode</strong>: Use test card to verify checkout</span>
              </div>
              <button
                onClick={copyTestCard}
                style={{
                  background: copied ? 'rgba(0,255,136,0.2)' : 'rgba(99, 91, 255, 0.25)',
                  border: `1px solid ${copied ? '#00ff88' : '#a594fd'}`,
                  color: copied ? '#00ff88' : '#fff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied 4242...' : 'Copy 4242 4242...'}
              </button>
            </div>
          )}

          {/* Modal Content */}
          <div style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1,
            minHeight: '380px',
            position: 'relative'
          }}>
            {paymentCompleted ? (
              /* Success / Download Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '30px 10px',
                  gap: '20px'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(0, 255, 136, 0.12)',
                  border: '2px solid #00ff88',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00ff88',
                  boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)'
                }}>
                  <CheckCircle2 size={44} />
                </div>

                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px 0', color: '#fff' }}>
                    Payment Confirmed! 🎉
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '440px', margin: 0, lineHeight: 1.5 }}>
                    Your purchase of <strong style={{ color: '#fff' }}>{productTitle}</strong> was successful. Your digital deliverable is ready below.
                  </p>
                </div>

                <div style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  marginTop: '10px'
                }}>
                  <a
                    href={effectiveDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      background: 'linear-gradient(135deg, #00ff88, #00e5ff)',
                      color: '#000',
                      borderRadius: '14px',
                      fontSize: '16px',
                      fontWeight: 900,
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      textDecoration: 'none',
                      boxShadow: '0 8px 25px rgba(0, 255, 136, 0.4)',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                  >
                    <Download size={20} /> Download {productTitle} Now
                  </a>

                  <button
                    onClick={onClose}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Continue to Store <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {loading && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '14px',
                    background: 'rgba(11, 13, 24, 0.95)',
                    zIndex: 10
                  }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      border: '3px solid rgba(255, 77, 133, 0.2)',
                      borderTop: '3px solid #ff4d85',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>
                      Loading In-App Checkout...
                    </span>
                  </div>
                )}

                {error ? (
                  <div style={{
                    padding: '30px 20px',
                    textAlign: 'center',
                    color: '#ff6b8b',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>{error}</p>
                    <button
                      onClick={onClose}
                      style={{
                        padding: '8px 20px',
                        background: '#ff4d85',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div id="stripe-checkout-mount" ref={mountRef} style={{ width: '100%' }} />
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
