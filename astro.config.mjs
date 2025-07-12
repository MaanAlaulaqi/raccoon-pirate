import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import path from 'path';


// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
    vite: {
    build: {
      rollupOptions: {
        input: {
          terminal: path.resolve('./src/terminal-entry.js'),
          main: path.resolve('./src/pages/index.astro'),
        },
        output: {
          entryFileNames: 'assets/[name].bundle.js',
        },
      },
    },
  },
  server: {
    port: 9001,
  },
});
