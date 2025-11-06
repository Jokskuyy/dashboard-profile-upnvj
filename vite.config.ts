import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow serving files from unity-builds
      allow: ['..'],
    },
  },
  build: {
    // Ensure Unity files are properly handled in production
    assetsInlineLimit: 0,
  },
})
