import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.ts']
  },
  server: {
    port: 9000,
    open: '/src/dev-bootstrap5.html'
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'AppendGrid',
      formats: ['umd'],
      fileName: () => 'AppendGrid.js'
    },
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    },
    rollupOptions: {
      output: {
        exports: 'default'
      }
    }
  }
})
