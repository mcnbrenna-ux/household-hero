import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this as a project site at /household-hero/, not the
  // domain root — only apply that base for production builds so local dev
  // still runs at "/".
  base: mode === 'production' ? '/household-hero/' : '/',
  plugins: [react()],
}))
