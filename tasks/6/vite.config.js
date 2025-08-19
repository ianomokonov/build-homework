import { defineConfig, Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      input: ["./src/entry.js", "./src/performance.js"],
      output: {
        dir: "./dist/vite",
        entryFileNames: "[name].js",
      },
    },
  },
});
