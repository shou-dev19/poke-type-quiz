import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // リライト転送用の絶対URLベースパス設定
  base: 'https://poke-type-quiz.vercel.app/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // プロダクションではsourcemap無効化
    minify: 'terser', // より良い圧縮
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-alert-dialog', '@radix-ui/react-select', '@radix-ui/react-progress'],
          'animation-vendor': ['framer-motion'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true, // console.logを本番で削除
        drop_debugger: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})