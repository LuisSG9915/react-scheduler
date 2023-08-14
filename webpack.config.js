// const path = require("path");
// const nodeExternals = require("webpack-node-externals");
// // const BundleAnalyzerPlugin =
// //   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// module.exports = {
//   mode: "production",
//   target: "node",
//   entry: path.resolve(__dirname, "src", "lib", "index.tsx"),
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "index.js",
//     libraryTarget: "commonjs2",
//   },
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         exclude: /node_modules/,
//         use: [
//           {
//             loader: "ts-loader",
//             options: {
//               configFile: "tsconfig.build.json",
//             },
//           },
//         ],
//       },
//     ],
//   },
//   resolve: {
//     extensions: [".tsx", ".ts", ".js"],
//   },
//   externals: [nodeExternals()],
// };
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development", // Puedes cambiar a 'production' para la versión final
  entry: path.resolve(__dirname, "src", "index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 3000,
  },
};
