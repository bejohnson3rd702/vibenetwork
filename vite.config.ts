import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // Prevents CPU-heavy ES5/older syntax transpilation
    sourcemap: false, // Disables heavy sourcemap generation
    minify: 'esbuild', // Ensures the ultra-fast Rust-based minifier is used
    cssCodeSplit: true, // Splits CSS into smaller chunks for faster post-processing
    chunkSizeWarningLimit: 2000
  }
})
