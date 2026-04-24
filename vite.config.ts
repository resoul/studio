import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_URL || '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3222,
    host: '0.0.0.0',
    proxy: {
      '/auth/v1': {
        target: 'http://auth:9999',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth\/v1/, ''),
      },
      '/api/v1': {
        target: 'http://api:8080',
        changeOrigin: true,
      },
    },
  },
})
