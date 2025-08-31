const path = require("path");
const HtmlRspackPlugin = require("html-rspack-plugin");

module.exports = {
  entry: {
    main: "./index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "./"),
      publicPath: "/",
    },
    hot: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlRspackPlugin({
      template: "./index.html",
    }),
  ],
};
