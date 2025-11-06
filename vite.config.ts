import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Use '/' for development, '/dashboard-profile-upnvj/' for production
  base: '/dashboard-profile-upnvj/',
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
  },
})
