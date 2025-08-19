import { Configuration } from "webpack";
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: Configuration = {
  entry: "./src/webpack.tsx",
  mode: "development",
  devtool: false,
  output: {
    path: path.resolve(import.meta.dirname, "dist/webpack"),
    publicPath: "/webpack/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./template.html",
    }),
  ],
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                jsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                },
              },
            },
          },
        },
      },
    ],
  },
  experiments: {
    css: true,
  },
};

export default config;
