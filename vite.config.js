import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // API 요청만 프록시
      '/api': {
        target: 'http://i-turtle.kro.kr',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
