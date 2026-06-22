import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// WHY THIS FILE EXISTS:
// Vite needs to know how to build your React app.
// The proxy below is the most important setting for development —
// it forwards any request from the frontend starting with /api
// to your Python backend on port 8000.
// This means in your React code you write:
//   axios.get('/api/prices')
// instead of:
//   axios.get('http://localhost:8000/prices')
// This avoids CORS errors during development.

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})