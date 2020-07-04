const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production',
  optimization: {
    /**
     * Below values are deliberated to create a separate chunk of `exclaim.js`.
     * These are not to be used in production grade code.
     */
    splitChunks: {
      chunks: 'all',
      minChunks: 1,
      minSize: 10,
      maxSize: 10,
    },
  },
  plugins: [new HTMLWebpackPlugin()],
};
