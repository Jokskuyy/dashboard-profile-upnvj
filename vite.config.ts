import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Use '/' for development, '/dashboard-profile-upnvj/' for production build
  base: command === 'serve' ? '/' : '/dashboard-profile-upnvj/',
  server: {
    fs: {
      // Allow serving files from unity-builds
      allow: ['..'],
    },
  },
  build: {
    // Ensure Unity files are properly handled in production
    assetsInlineLimit: 0,
    // Increase chunk size warning limit for Unity files
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Ensure Unity .br files are treated as assets
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.br')) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  assetsInclude: ['**/*.br', '**/*.data', '**/*.wasm'],
}))
