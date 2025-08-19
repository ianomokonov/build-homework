import css from "rollup-plugin-import-css";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import html from "@rollup/plugin-html";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import fs from "node:fs";

const template = fs.readFileSync("./template.html", "utf-8");

export default {
  input: "./src/index.tsx",
  output: {
    file: "./dist/rollup/main.js",
    format: "iife",
    assetFileNames: "[name][extname]",
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    commonjs(),
    nodeResolve(),
    typescript(),
    css(),
    html({
      publicPath: "/rollup/",
      template: ({ files, title, publicPath }) => {
        const scripts = (files.js || [])
          .map(
            ({ fileName }) =>
              `<script type="module" src="${publicPath}${fileName}"></script>`
          )
          .join("\n");
          return `<!DOCTYPE html>
<html lang="en">
<head>
    <title>${title}</title>
</head>
<body>
    <div id="root"></div>
    ${scripts}
</body>
</html>`
      },
    }),
  ],
};
