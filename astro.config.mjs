import path from "node:path";
import { defineConfig } from "astro/config";

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 9001,
  },
  vite: {
    server: {
      proxy: {
        "/auth/kratos": {
          target: "http://127.0.0.1:4433",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth\/kratos/, ""),
        },
        "/api": {
          target: "http://127.0.0.1:3000",
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve("./src/pages/index.astro"),
          terminal: path.resolve("./src/terminal-entry.js"),
        },
        output: {
          entryFileNames: "assets/[name].bundle.js",
          chunkFileNames: "assets/chunks/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
        },
      },
    },
  },
});
