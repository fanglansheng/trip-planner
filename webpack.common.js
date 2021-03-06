const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const outputPath = "trip_planner/static/dist";

module.exports = {
  // absolute path, for resolving entry points and loaders from configuration.
  context: __dirname,

  entry: {
    dashboard: [
      "react-hot-loader/patch",
      "webpack/hot/only-dev-server",
      "./client/entry.js"
    ],

    common: [
      "react-hot-loader/patch",
      "webpack/hot/only-dev-server",
      "react",
      "react-dom",
      "jquery"
    ]
  },

  output: {
    path: path.resolve(__dirname, outputPath),
    filename: "[name].bundle.js",
    publicPath: "/"
  },

  module: {
    loaders: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /node_modules/,
        loader: "babel-loader",
        query: { presets: ["es2015", "stage-2", "react"] }
      },
      // json loader
      { test: /\.json$/, loader: "json-loader" },
      // sass loader
      {
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract(["css-loader", "sass-loader"])
      },
      {
        // regular css files
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          loader: "css-loader?importLoaders=1"
          // https://github.com/webpack-contrib/css-loader/issues/228
        })
      },
      {
        test: /\.(otf|png|woff|woff2?|ttf|eot)$/,
        loader: "url-loader"
      },
      {
        test: /\.svg$/,
        loader: "react-svg-loader?es5=1"
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["common", "manifest"], // Specify the common chunk's name.
      filename: "[name].js" // the file name of the common chunk
    }),
    new ExtractTextPlugin("style/style.css")
  ],

  resolve: {
    extensions: [".js", ".jsx"]
  }
};
