import { defineConfig } from 'astro/config';
import path from 'path';

export default defineConfig({
  server: {
    port: 9001,
  },
  vite: {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve('./src/pages/index.astro'), 
          terminal: path.resolve('./src/terminal-entry.js'), 
        },
        output: {
          entryFileNames: 'assets/[name].bundle.js', 
          chunkFileNames: 'assets/chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]', 
        },
      },
    },
  },
});
