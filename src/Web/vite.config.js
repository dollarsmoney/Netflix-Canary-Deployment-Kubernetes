import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

// The gateway (nginx/openresty) serves the API + SignalR hub. When developing the
// web app on its own, run the docker stack so the gateway is reachable on HTTPS 4430,
// then Vite proxies the API/websocket routes to it.
const GATEWAY = 'https://localhost:4430';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/user-api': { target: GATEWAY, changeOrigin: true, secure: false },
      '/post-api': { target: GATEWAY, changeOrigin: true, secure: false },
      '/newsfeed-api': { target: GATEWAY, changeOrigin: true, secure: false },
      '/hubs': { target: GATEWAY, changeOrigin: true, secure: false, ws: true },
    },
  },
});
