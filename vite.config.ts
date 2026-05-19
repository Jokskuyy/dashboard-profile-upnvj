import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    // Middleware: serve Unity Brotli files with correct headers in dev mode
    {
      name: 'unity-brotli-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          if (req.url.includes('/unity-builds/') && req.url.endsWith('.br')) {
            res.setHeader('Content-Encoding', 'br');
            if (req.url.endsWith('.wasm.br')) {
              res.setHeader('Content-Type', 'application/wasm');
            } else if (req.url.endsWith('.framework.js.br')) {
              res.setHeader('Content-Type', 'application/javascript');
            } else {
              res.setHeader('Content-Type', 'application/octet-stream');
            }
          }
          next();
        });
      },
    },
  ],
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
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
  assetsInclude: ['**/*.br', '**/*.data', '**/*.wasm'],
}))

