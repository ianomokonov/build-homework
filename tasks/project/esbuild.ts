import esbuild from "esbuild";
import { htmlPlugin } from "@craftamap/esbuild-plugin-html";

const options = {
  entryPoints: ["./src/index.tsx"],
  bundle: true,
  publicPath: "/esbuild/",
  outdir: "dist/esbuild",
  plugins: [
    htmlPlugin({
      files: [
        {
          entryPoints: ["src/index.tsx"],
          filename: "index.html",
          htmlTemplate: "./template.html",
        },
      ],
    }),
  ],
};

esbuild.build(options).catch(() => process.exit(1));
