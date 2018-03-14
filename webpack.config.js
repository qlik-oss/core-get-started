/* eslint-env node */

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname),
  entry: { app: './src/hello-visualization/app.js' },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: { host: '0.0.0.0', port: '8080', disableHostCheck: true },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true,
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [path.resolve(__dirname, 'node_modules')],
        query: { presets: ['env'] },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/hello-visualization/index.html' },
      { from: 'src/hello-visualization/app.html' },
      { from: 'src/hello-visualization/app.css' },
      { from: 'src/hello-visualization/resources/', to: 'resources/' },
    ]),
  ],
};
