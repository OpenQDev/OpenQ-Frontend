import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test-utils/setup.js',
   maxConcurrency: 2,
   minThreads:1,
   maxThreads: 1,
    
  }
})