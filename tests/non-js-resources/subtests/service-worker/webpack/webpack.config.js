/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AutoSWPlugin = require('./lib/sw-plugin');

module.exports = {
  output: {
    filename: '[name].[contenthash:5].js',
  },
  module: {
    rules: [
      {
        test: /\.png$/,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash:5].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:5].css',
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      minify: {
        removeScriptTypeAttributes: true,
      },
    }),

    // Automatically compile navigator.serviceWorker.register("..") using Webpack.
    // This also inlines a (optionally filtered) Array of asset URLs as `BUILD_ASSETS`.
    new AutoSWPlugin({
      filename: 'sw.js',
    }),
  ],
};
