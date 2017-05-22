/* eslint-env node*/

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/app'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: 'http://localhost:8080/',
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: [path.resolve(__dirname, 'node_modules')],
      query: {
        presets: ['es2015'],
      },
    },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'index.html' },
      { from: 'node_modules/@qlik/picasso/dist/picasso.js' },
      { from: 'node_modules/@qlik/picasso/plugins/q/dist/picasso-q.js' },
      { from: 'src/app.html', to: 'src/' },
      { from: 'src/app.css', to: 'src/' },
      { from: 'src/resources', to: 'src/resources' },
    ]),
  ],
};
