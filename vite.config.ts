import { defineConfig, type Connect } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

const unityBrotliHeaders: Connect.NextHandleFunction = (req, res, next) => {
  const requestPath = req.url?.split('?', 1)[0]

  if (
    requestPath?.includes('/unity-builds/') &&
    (requestPath.endsWith('.unityweb') || requestPath.endsWith('.brbin'))
  ) {
    res.setHeader('Content-Encoding', 'br')

    if (
      requestPath.endsWith('.wasm.unityweb') ||
      requestPath.endsWith('.wasm.brbin')
    ) {
      res.setHeader('Content-Type', 'application/wasm')
    } else if (
      requestPath.endsWith('.framework.js.unityweb') ||
      requestPath.endsWith('.framework.js.brbin')
    ) {
      res.setHeader('Content-Type', 'application/javascript')
    } else {
      res.setHeader('Content-Type', 'application/octet-stream')
    }
  }

  next()
}

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    // Serve pre-compressed Unity files with the headers browsers need to
    // decompress them in both development and local preview mode.
    {
      name: 'unity-brotli-headers',
      configureServer(server) {
        server.middlewares.use(unityBrotliHeaders)
      },
      configurePreviewServer(server) {
        server.middlewares.use(unityBrotliHeaders)
      },
    },
  ],
  // Base path for subdirectory deployment
  base: '/',
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
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
    // Target modern browsers for smaller output
    target: 'es2020',
    // Allow small assets (< 4KB) to be inlined as base64
    assetsInlineLimit: 4096,
    // Increase chunk size warning limit for Unity files
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react'],
          'vendor-search': ['fuse.js'],
        },
      },
    },
  },
  assetsInclude: ['**/*.brbin', '**/*.data', '**/*.wasm'],
}))

