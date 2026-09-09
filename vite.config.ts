import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import { createClient } from '@supabase/supabase-js'

function youtubeTranscriptPlugin(env: Record<string, string>) {
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg';
  const supabase = createClient(supabaseUrl, supabaseKey);

  return {
    name: 'youtube-transcript-middleware',
    configureServer(server: any) {
      server.middlewares.use('/api/yt-transcript', async (req: any, res: any) => {
        try {
          const urlObj = new URL(req.url, 'http://localhost:5173');
          const rawId = urlObj.searchParams.get('videoId') || urlObj.searchParams.get('url') || '';
          const match = rawId.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
          const videoId = (match && match[1]?.length === 11) ? match[1] : (rawId.length === 11 ? rawId : '');

          if (!videoId) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: false, error: 'Valid YouTube videoId is required.' }));
          }

          // 1. Check Supabase cache
          try {
            const { data: cached } = await supabase
              .from('video_transcripts')
              .select('transcript')
              .eq('video_id', videoId)
              .maybeSingle();

            if (cached && Array.isArray(cached.transcript) && cached.transcript.length > 0) {
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: true, videoId, segments: cached.transcript, source: 'cache' }));
            }
          } catch (cacheErr) {
            console.warn('[yt-transcript] Cache query error:', cacheErr);
          }

          // 2. Extract using yt-dlp
          try {
            const ytdlpBin = [
              '/opt/homebrew/bin/yt-dlp',
              '/usr/local/bin/yt-dlp',
              'yt-dlp'
            ].find(bin => {
              try {
                execSync(`${bin} --version`, { stdio: 'ignore' });
                return true;
              } catch (_) {
                return false;
              }
            }) || 'yt-dlp';

            const raw = execSync(`${ytdlpBin} --dump-json --skip-download "https://www.youtube.com/watch?v=${videoId}"`, {
              encoding: 'utf8',
              maxBuffer: 20 * 1024 * 1024,
              timeout: 20000
            });
            const data = JSON.parse(raw);
            const subs = data.subtitles || {};
            const autoSubs = data.automatic_captions || {};

            const langKey = Object.keys(subs).find(k => k.startsWith('en'))
              || Object.keys(autoSubs).find(k => k.startsWith('en'))
              || Object.keys(subs)[0]
              || Object.keys(autoSubs)[0];

            if (langKey) {
              const formats = (subs[langKey] || autoSubs[langKey] || []);
              const json3Format = formats.find((f: any) => f.ext === 'json3') || formats[0];
              if (json3Format && json3Format.url) {
                const capRes = await fetch(json3Format.url);
                const json = await capRes.json();
                const segments: any[] = [];
                if (json.events && Array.isArray(json.events)) {
                  for (const ev of json.events) {
                    if (ev.segs && ev.tStartMs !== undefined) {
                      const text = ev.segs.map((s: any) => s.utf8).join('').trim();
                      if (text && text !== '\n') {
                        const totalSec = Math.floor(ev.tStartMs / 1000);
                        const m = Math.floor(totalSec / 60);
                        const s = Math.floor(totalSec % 60);
                        segments.push({
                          time: `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`,
                          seconds: totalSec,
                          speaker: 'YouTube Audio',
                          text: text,
                          isRecorded: true
                        });
                      }
                    }
                  }
                }

                if (segments.length > 0) {
                  // Save to Supabase
                  try {
                    await supabase.from('video_transcripts').upsert({
                      video_id: videoId,
                      transcript: segments,
                      created_at: new Date().toISOString()
                    }, { onConflict: 'video_id' });
                  } catch (saveErr) {
                    console.warn('[yt-transcript] Save to Supabase error:', saveErr);
                  }

                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ success: true, videoId, title: data.title, segments, source: 'youtube' }));
                }
              }
            }
          } catch (ytErr: any) {
            console.warn('[yt-transcript] yt-dlp error:', ytErr?.message);
          }

          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ success: false, videoId, error: 'No caption track available on YouTube for this video.' }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ success: false, error: err?.message || 'Server error' }));
        }
      });
    }
  };
}

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
    plugins: [react(), stripeStagingPlugin(env), youtubeTranscriptPlugin(env)],
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
