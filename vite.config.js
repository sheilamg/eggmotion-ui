import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Definir variables globales para compatibilidad
    global: 'globalThis',
  },
  envPrefix: 'VITE_', // Solo cargar variables que empiecen con VITE_
})
