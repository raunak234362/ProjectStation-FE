import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      workbox: {
        maximumFileSizeToCacheInBytes: 48 * 1024 * 1024, // 12 MB
      },
      manifest: {
        name: "My App",
        short_name: "App",
        description: "My awesome React Vite PWA!",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  build: {
    sourcemap: false, // Avoid "can't resolve original location" errors
    chunkSizeWarningLimit: 1500, // Optional: Increase warning limit
  },
  server: {
    proxy: {
      "/api": {
        target: "https://106.51.141.125:5154",
        changeOrigin: true,
        secure: false, // For development only
      },
    },
  },
});
