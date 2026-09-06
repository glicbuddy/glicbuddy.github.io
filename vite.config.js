import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  root: `${import.meta.dirname}/src`,
  publicDir: `${import.meta.dirname}/public`,
  envDir: import.meta.dirname,
  build: {
    outDir: `${import.meta.dirname}/dist`,
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
      '@': `${import.meta.dirname}/src`,
      stream: 'stream-browserify'
    }
  },
  optimizeDeps: {
    include: ['blob-stream'],
    rolldownOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})
