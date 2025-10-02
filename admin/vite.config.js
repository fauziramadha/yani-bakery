import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',              // root project (default)
  publicDir: 'public',    // folder public untuk assets statis
  build: {
    outDir: 'dist',
    emptyOutDir: true     // kosongkan dist setiap build
  },
  server: {
    port: 5174,           // biar beda port sama shop (5173)
    open: true
  }
})
