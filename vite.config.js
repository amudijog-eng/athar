import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

const surgeSpaPlugin = () => ({
  name: 'surge-spa-200',
  closeBundle() {
    const indexPath = path.resolve('dist', 'index.html');
    const spaPath = path.resolve('dist', '200.html');
    if (fs.existsSync(indexPath)) {
      fs.copyFileSync(indexPath, spaPath);
      console.log('✓ Created dist/200.html for Surge SPA routing');
    }
  }
});

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    react(),
    surgeSpaPlugin()
  ],
})
