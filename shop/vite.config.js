import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',              // root project (default)
  publicDir: 'public',    // supaya folder public/assets bisa kebaca
  build: {
    outDir: 'dist',
    emptyOutDir: true     // kosongkan dist setiap build
  },
  server: {
    port: 5173,
    open: true
  }
})
