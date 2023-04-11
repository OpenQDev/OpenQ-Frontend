import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test-utils/setup.js',
    reporters: [ "default",'junit'],
    outputFile: 'junit.xml',
    cache: false,
    
  }
})
process.env = Object.assign(process.env, {
  NEXT_PUBLIC_DEPLOY_ENV: 'local',
  DEPLOY_ENV: 'local',
  TZ: 'UTC',
});
