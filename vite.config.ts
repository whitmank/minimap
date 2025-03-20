import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
});
