const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production',
  devtool: 'eval',
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minChunks: 1,
      minSize: 10,
      maxSize: 10,
    },
  },
  plugins: [new HTMLWebpackPlugin()],
};
