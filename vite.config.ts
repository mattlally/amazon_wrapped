import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// For GitHub Pages: set base to "/<REPO_NAME>/" (e.g., "/amazon-wrapped-web/")
// For local dev: set base to "/"
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/amazon-wrapped-web/' : '/',
  optimizeDeps: {
    include: ['plotly.js', 'react-plotly.js', 'buffer'],
  },
  define: {
    'process.env': {},
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      'buffer': 'buffer',
    },
  },
})
