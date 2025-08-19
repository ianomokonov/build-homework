import { defineConfig, Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths() as Plugin],
  base: "/vite/",
  build: {
    outDir: "dist/vite",
    minify: false,
  },
});
