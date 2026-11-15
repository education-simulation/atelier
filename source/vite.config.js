// Construit la démo « Découvre Antigravity » (decouvrir.html) et l'aide « fenêtres d'autorisation » (fenetres.html)
// à la racine du site. Lancer depuis source/ : npm install (une fois), puis npm run build.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  root: '.',
  base: './',
  plugins: [react()],
  build: {
    outDir: '../_build',
    emptyOutDir: true,
    rollupOptions: { input: { decouvrir: resolve('decouvrir.html'), fenetres: resolve('fenetres.html') } },
  },
})
