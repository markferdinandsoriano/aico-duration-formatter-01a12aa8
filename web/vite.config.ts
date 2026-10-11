import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The web app calls the API under /api (template v3): in development the dev server proxies it to the API; deployed,
// the platform gateway does the same.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: `http://127.0.0.1:${process.env.API_PORT ?? '3000'}`, rewrite: (path) => path.replace(/^\/api/, '') },
    },
  },
});
