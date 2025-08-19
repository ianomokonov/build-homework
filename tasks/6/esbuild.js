import esbuild from "esbuild";
import { htmlPlugin } from "@craftamap/esbuild-plugin-html";

const options = {
  entryPoints: ["./src/entry.js", './src/performance.js'],
  outdir: "dist/esbuild",
};

esbuild.build(options).catch(() => process.exit(1));
