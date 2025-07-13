import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'public/assets',
    emptyOutDir: false, // Don’t wipe out other files like favicon.svg
    rollupOptions: {
      input: path.resolve('./src/terminal-entry.js'),
      output: {
        entryFileNames: 'terminal.bundle.js',
        format: 'es',
      },
    },
  },
});
