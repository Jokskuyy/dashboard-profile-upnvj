import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Change this to '/' if deploying to custom domain
  base: process.env.GITHUB_PAGES === 'true' ? '/dashboard-profile-upnvj/' : '/',
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
