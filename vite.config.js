import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/excel-interview/',
  css: {
    preprocessorOptions: {},
  },
  optimizeDeps: {
    include: [
      '@univerjs/core',
      '@univerjs/sheets',
      '@univerjs/sheets-ui',
      '@univerjs/sheets-formula',
      '@univerjs/sheets-formula-ui',
      '@univerjs/ui',
      '@univerjs/docs',
      '@univerjs/docs-ui',
      '@univerjs/design',
      '@univerjs/engine-render',
      '@univerjs/engine-formula',
      '@univerjs/sheets-numfmt',
      '@univerjs/sheets-numfmt-ui',
    ],
  },
})
