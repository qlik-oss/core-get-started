/* eslint-env node */

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: { app: './src/app.js' },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:8080/',
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [path.resolve(__dirname, 'node_modules')],
        query: { presets: ['es2015'] },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/index.html' },
      { from: 'src/app.html' },
      { from: 'src/app.css' },
      { from: 'src/resources/', to: 'resources/' },
    ]),
  ],
};
