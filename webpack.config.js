var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: require.resolve('./src/index.js'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  watch: true,
  devtool: 'sourcemap',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: ['babel'],
      query: {
        presets: ['es2015']
      }
    }]
  }
};
