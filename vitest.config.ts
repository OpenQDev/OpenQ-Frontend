import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test-utils/setup.js',
   minThreads:1,
   maxThreads: 1,
    reporters: [ "default",'junit'],
    outputFile: 'junit.xml',
  }
})