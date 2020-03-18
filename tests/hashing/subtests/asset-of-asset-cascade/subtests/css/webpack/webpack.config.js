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

// An alternative (and more popular) configuration is commented out here:
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [1, 2, 3].map(src => ({
  entry: `./src${src}/index.js`,
  output: {
    path: require('path').resolve(__dirname, 'dist', src + ''),
    filename: 'index.js',
    // CSS subresources are loaded relative to this path, not the location of the CSS file:
    publicPath: '/',
  },
  module: {
    rules: [
      // parse CSS to find and process subresources:
      {
        test: /\.css$/,
        // use: [MiniCssExtractPlugin.loader, 'css-loader'],
        use: ['extract-loader', 'css-loader'],
        enforce: 'pre',
      },
      // both CSS and images end up being hashed assets:
      {
        test: /\.(svg|css)$/,
        // test: /\.svg$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[contenthash:5].[ext]',
        },
      },
    ],
  },
  // plugins: [
  //   new MiniCssExtractPlugin({
  //     filename: 'assets/[name].[contenthash:5].css',
  //   }),
  // ],
}));
