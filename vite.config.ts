import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/types': resolve(__dirname, './src/types'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/components': resolve(__dirname, './src/components'),
      '@/data': resolve(__dirname, './src/data'),
    },
  },
  base: '/', // Stellt sicher, dass die Basis-URL korrekt ist
  server: {
    historyApiFallback: true, // Wichtig für SPA-Routing
  },
})


