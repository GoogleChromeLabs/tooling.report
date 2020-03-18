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
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
// const PreloadPlugin = require('preload-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    profile: './src/profile.js',
  },
  output: {
    filename: '[name].[contenthash:5].js',
  },
  optimization: {
    // create a runtime.js script containing the module loader
    // runtimeChunk: 'single',

    splitChunks: {
      // extract shared dependencies from entry bundles:
      chunks: 'all',
      // allow any size dependency to be shared:
      minSize: 0,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      excludeChunks: ['profile'],
      chunks: 'all',
      prefetch: false,
      minify: {
        removeScriptTypeAttributes: true,
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'profile.html',
      excludeChunks: ['index'],
      chunks: 'all',
      prefetch: false,
      minify: {
        removeScriptTypeAttributes: true,
      },
    }),
    // The following two plugin setups produce the same result:
    new ScriptExtHtmlWebpackPlugin({
      preload: {
        test: /\.js$/,
        chunks: 'async',
      },
    }),
    // new PreloadPlugin({
    //   rel: 'preload',
    //   include: 'asyncChunks',
    // }),
  ],
};
