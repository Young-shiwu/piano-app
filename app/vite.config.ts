import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base 指向 GitHub Pages 的项目子路径 /piano-app/
export default defineConfig({
  base: '/piano-app/',
  plugins: [react()],
})
