import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function stripeStagingPlugin(env: Record<string, string>) {
  return {
    name: 'stripe-staging-middleware',
    configureServer(server: any) {
      const stripeSecretKey = env.STRIPE_SECRET_KEY || '';
      const isStripeActive = env.VITE_ENABLE_STRIPE === 'true' && !!stripeSecretKey;

      server.middlewares.use('/api/stripe/status', (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          stripeEnabled: isStripeActive,
          env: env.VITE_APP_ENV || 'unknown',
          publicKey: isStripeActive ? env.VITE_STRIPE_PUBLIC_KEY : null,
        }));
      });

      server.middlewares.use('/api/stripe/create-checkout-session', (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('Method Not Allowed');
        }

        let bodyStr = '';
        req.on('data', (chunk: any) => { bodyStr += chunk; });
        req.on('end', async () => {
          try {
            if (!isStripeActive) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Stripe is disabled in this environment.' }));
            }

            const body = JSON.parse(bodyStr || '{}');
            const { productTitle, amount, returnUrl, extraMetadata } = body;
            const cleanNum = typeof amount === 'number' ? amount : parseFloat(String(amount || '').replace(/[^0-9.]/g, ''));
            const unitAmountCents = Math.max(50, Math.round((isNaN(cleanNum) ? 10 : cleanNum) * 100));

            console.log(`[Staging Stripe] Creating checkout session for "${productTitle}" - $${(unitAmountCents / 100).toFixed(2)} (${unitAmountCents} cents)`);

            const origin = returnUrl ? new URL(returnUrl, 'http://localhost:5174').origin : 'http://localhost:5174';
            const successUrl = returnUrl ? `${returnUrl}${returnUrl.includes('?') ? '&' : '?'}stripe_success=true` : `${origin}/profile?stripe_success=true`;
            const cancelUrl = returnUrl ? `${returnUrl}${returnUrl.includes('?') ? '&' : '?'}stripe_canceled=true` : `${origin}/profile?stripe_canceled=true`;

            const uiMode = body.uiMode || 'embedded_page';
            const formData = new URLSearchParams({
              'mode': 'payment',
              'ui_mode': uiMode,
              'managed_payments[enabled]': 'false',
              'line_items[0][price_data][currency]': 'usd',
              'line_items[0][price_data][product_data][name]': String(productTitle || 'Vibe Store Purchase'),
              'line_items[0][price_data][product_data][tax_code]': 'txcd_10000000',
              'line_items[0][price_data][unit_amount]': String(unitAmountCents),
              'line_items[0][quantity]': '1',
              'payment_intent_data[metadata][product_title]': String(productTitle || 'Vibe Store Purchase'),
              'payment_intent_data[metadata][env]': 'staging',
            });

            if (uiMode === 'embedded_page' || uiMode === 'embedded') {
              const returnUrlWithSession = returnUrl 
                ? `${returnUrl}${returnUrl.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}&stripe_success=true`
                : `${origin}/profile?session_id={CHECKOUT_SESSION_ID}&stripe_success=true`;
              formData.append('return_url', returnUrlWithSession);
            } else {
              formData.append('success_url', successUrl);
              formData.append('cancel_url', cancelUrl);
            }

            if (extraMetadata && typeof extraMetadata === 'object') {
              Object.entries(extraMetadata).forEach(([k, v]) => {
                if (v !== undefined && v !== null) {
                  formData.append(`payment_intent_data[metadata][${k}]`, String(v));
                }
              });
            }

            const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${stripeSecretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: formData.toString()
            });

            const stripeData = await stripeRes.json();
            if (!stripeRes.ok) {
              console.error('[Staging Stripe] API Error:', stripeData);
              res.statusCode = stripeRes.status;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: stripeData.error?.message || 'Stripe API error' }));
            }

            console.log(`[Staging Stripe] Checkout session created: ${stripeData.id} (client_secret: ${!!stripeData.client_secret})`);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              url: stripeData.url,
              id: stripeData.id,
              clientSecret: stripeData.client_secret
            }));
          } catch (err: any) {
            console.error('[Staging Stripe] Server Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), stripeStagingPlugin(env)],
    server: {
      proxy: {
        '/api/ncaa': {
          target: 'https://ncaa-api.henrygd.me',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ncaa/, ''),
        },
        '/api/espn': {
          target: 'https://site.api.espn.com/apis/site/v2/sports',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/espn/, ''),
        },
        '/api/story': {
          target: 'https://now.core.api.espn.com/v1/sports/news',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/story/, ''),
        },
        '/api/yt-rss': {
          target: 'https://www.youtube.com',
          changeOrigin: true,
          rewrite: (path) => {
            const channelId = path.replace('/api/yt-rss/', '');
            return `/feeds/videos.xml?channel_id=${channelId}`;
          },
        },
        '/api/shop': {
          target: 'https://shopavo.la',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/shop/, ''),
        },
        '/api/bama': {
          target: 'https://api.nil-prod.rallyhub.net',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/bama/, ''),
        },
        '/api/rss/cnn': {
          target: 'http://rss.cnn.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/rss\/cnn/, '/rss'),
        },
        '/api/rss/foxnews': {
          target: 'https://moxie.foxnews.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/rss\/foxnews/, '/google-publisher'),
        },
        '/api/rss/cnbc': {
          target: 'https://search.cnbc.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/rss\/cnbc/, '/rs/search'),
        },
        '/api/rss/people': {
          target: 'https://people.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/rss\/people/, ''),
        },
      },
    },
    build: {
      target: 'esnext',
      sourcemap: false,
      minify: 'esbuild',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              if (id.includes('supabase') || id.includes('postgrest') || id.includes('websocket')) {
                return 'vendor-supabase';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-framer-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-lucide';
              }
              return 'vendor-core';
            }
          }
        }
      }
    }
  };
})
