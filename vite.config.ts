import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  // Base path for subdirectory deployment
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      // Allow serving files from unity-builds
      allow: ['..'],
    },
  },
  build: {
    // Allow small assets (< 4KB) to be inlined as base64
    assetsInlineLimit: 4096,
    // Increase chunk size warning limit for Unity files
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Ensure Unity .br files are treated as assets
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.br')) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // Manual chunks for better code splitting
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
  assetsInclude: ['**/*.br', '**/*.data', '**/*.wasm'],
}))
