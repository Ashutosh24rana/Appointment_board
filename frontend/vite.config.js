import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Single project-root .env (one level above frontend/).
  envDir: '../',
  server: {
    port: 5173,
    proxy: {
      // optional: allows relative /api calls during dev
      // '/appointments': 'http://localhost:8000',
    },
  },
})
