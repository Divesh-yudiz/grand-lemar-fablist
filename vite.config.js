import { defineConfig } from 'vite'
import glslify from 'rollup-plugin-glslify'
import * as path from 'path'
import dotenv from 'dotenv'

dotenv.config();
console.log(process.env.YUDIZ_URL);

export default defineConfig({
  root: 'src',
  base: './', // for Github pages, otherwise use './'
  build: {
    outDir: '../dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/js/components')) {
            return 'components';
          }
          // Add more conditions as needed
        },
      },
    },
    chunkSizeWarningLimit: 50000, // Adjust this limit if necessary
  },
  server: {
    port: 2001,
    host: true, // to test on other devices with IP address
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [glslify()],
  define: {
    'import.meta.env.YUDIZ_URL': JSON.stringify(process.env.YUDIZ_URL),
  },
  assetsInclude: ['**/*.glb'],
})
