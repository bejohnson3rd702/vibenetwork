import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
})
