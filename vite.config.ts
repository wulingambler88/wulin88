import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  build: {
    // Phaser is inherently ~1.3 MB; suppress the warning for the vendor chunk.
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Rolldown requires the function form of manualChunks.
        manualChunks(id: string): string | undefined {
          if (id.includes('node_modules') && /[\\/]phaser[\\/]/.test(id)) return 'phaser'
          return undefined
        },
      },
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,webp,png}'],
        // The app loads only .webp art; the large fallback .png copies would
        // exceed Workbox's 2 MiB precache limit and are not needed offline.
        globIgnores: ['art/**/*.png'],
      },
      manifest: {
        name: 'Qian Hui Avatar City',
        short_name: 'Avatar City',
        description: 'A cozy, creative dollhouse adventure for children.',
        theme_color: '#ff8fc4',
        background_color: '#fff4fa',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '.',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
})
