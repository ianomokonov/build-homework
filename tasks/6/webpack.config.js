import path from "node:path";

export default {
  devtool: false,
  mode: "development",
  entry: {
    entry: "./src/entry.js",
    performance: "./src/performance.js",
  },
  output: {
    path: path.resolve("./dist/webpack"),
    filename: "[name].js",
  },
};
