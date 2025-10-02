import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',              // root project
  publicDir: 'public',    // folder public/assets
  base: '/',              // penting supaya file JS/CSS dimuat di Vercel
  build: {
    outDir: 'dist',       // hasil build masuk dist/
    emptyOutDir: true     // kosongkan dist setiap build
  },
  server: {
    port: 5173,
    open: true
  }
})
