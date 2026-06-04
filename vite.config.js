import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.js']
  },
  server: {
    port: 9000,
    open: '/src/dev-bootstrap5.html'
  },
  build: {
    lib: {
      entry: 'src/index.js',
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
