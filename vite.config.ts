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
    },
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000
  }
})
