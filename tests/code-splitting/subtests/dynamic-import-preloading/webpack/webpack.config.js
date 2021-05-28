const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production',
  optimization: {
    /**
     * Below values are deliberated to create a separate chunk of `exclaim.js`.
     * These are not to be used in production grade code.
     */
    splitChunks: {
      minSize: 0,
    },
  },
  plugins: [new HTMLWebpackPlugin()],
};
