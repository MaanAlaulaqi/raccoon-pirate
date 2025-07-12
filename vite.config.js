import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        terminal: path.resolve(__dirname, 'src/terminal-entry.js'),
      },
      output: {
        entryFileNames: '../public/terminal.bundle.js',
      },
    },
  },
});
