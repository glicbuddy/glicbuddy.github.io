import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: path.resolve(__dirname, './src'),
  publicDir: path.resolve(__dirname, './public'),
  envDir: __dirname,
  build: {
    outDir: path.resolve(__dirname, './dist'),
    emptyOutDir: true
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
