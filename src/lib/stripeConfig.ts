/**
 * Stripe Environment & Feature Gate Configuration
 * - Staging: Enabled with Stripe Test Keys (VITE_ENABLE_STRIPE="true")
 * - Dev & Prod: Disabled by default (VITE_ENABLE_STRIPE="false")
 */

export const getStripeEnv = (): 'staging' | 'development' | 'production' => {
  const env = import.meta.env.VITE_APP_ENV || import.meta.env.MODE;
  if (env === 'staging') return 'staging';
  if (env === 'production') return 'production';
  return 'development';
};

export const isStripeEnabled = (): boolean => {
  const isEnabledFlag = import.meta.env.VITE_ENABLE_STRIPE === 'true';
  const hasKey = !!import.meta.env.VITE_STRIPE_PUBLIC_KEY && 
                 import.meta.env.VITE_STRIPE_PUBLIC_KEY.startsWith('pk_');
  return isEnabledFlag && hasKey;
};

export const getStripePublicKey = (): string => {
  if (!isStripeEnabled()) return '';
  return import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
};

let cachedStripePromise: Promise<any> | null = null;

export const getStripeClient = async () => {
  if (!isStripeEnabled()) {
    return null;
  }
  if (!cachedStripePromise) {
    cachedStripePromise = import('@stripe/stripe-js').then(({ loadStripe }) => {
      const key = getStripePublicKey();
      return key ? loadStripe(key) : null;
    });
  }
  return cachedStripePromise;
};
