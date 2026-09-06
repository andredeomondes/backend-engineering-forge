import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.join(directory, "src"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.join(directory, "src"),
    },
  },
  build: {
    outDir: path.join(directory, "dist"),
    emptyOutDir: true,
  },
});
