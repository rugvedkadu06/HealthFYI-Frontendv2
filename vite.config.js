import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      'bdaf-2401-4900-881d-5326-145f-4e64-c241-cd28.ngrok-free.app',
    ],
  },
})
