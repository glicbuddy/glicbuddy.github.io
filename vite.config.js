import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

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
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true
      },
      overrides: {
        fs: 'memfs'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: 'stream-browserify'
    }
  },
  define: {
    __dirname: JSON.stringify('/'),
    __filename: JSON.stringify('/index.js')
  },
  optimizeDeps: {
    include: ['pdfkit/js/pdfkit.standalone.js', 'blob-stream'],
    rolldownOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})
