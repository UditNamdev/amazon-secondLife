import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/grade': 'http://localhost:3000',
      '/upload': 'http://localhost:3000',
      '/item': 'http://localhost:3000',
      '/requirements': 'http://localhost:3000',
      '/evaluate-risk': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    }
  }
})
