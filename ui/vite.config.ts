import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@config': path.resolve(__dirname, './src/config'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils/index'),
      '@store': path.resolve(__dirname, './src/store'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@api': path.resolve(__dirname, './src/api'),
      '@modals': path.resolve(__dirname, './src/modals'),
      '@tables': path.resolve(__dirname, './src/tables'),
    },
  },
})
