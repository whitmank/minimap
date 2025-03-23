import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { surrealdbNodeEngines } from "@surrealdb/node";

// VITE ——— https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: "./src/index.html",
        manifest: "./public/manifest.json",
        service_worker: "./public/service-worker.js",
      },
    },
  },
  optimizeDeps: {
    exclude: [
      "@surrealdb/node",
      "@surrealdb/node-darwin-universal",
      "@surrealdb/node-darwin-arm64",
    ]
  },
});
