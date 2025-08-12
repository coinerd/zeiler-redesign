import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/data": path.resolve(__dirname, "./src/data"),
    },
  },
  base: '/', // Stellt sicher, dass die Basis-URL korrekt ist
  server: {
    historyApiFallback: true, // Wichtig für SPA-Routing
  },
})


