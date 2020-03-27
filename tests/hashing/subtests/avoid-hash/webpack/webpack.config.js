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
module.exports = {
  entry: {
    hashed: './src/hashed-entry.js',
    unhashed: './src/unhashed-entry.js',
  },
  output: {
    filename: chunkData => {
      return /unhashed/.test(chunkData.chunk.name)
        ? '[name].js'
        : '[name].[contenthash:5].js';
    },
    // In Webpack 4, this cannot be a function.
    // That means we can't hash splitted bundles conditionally.
    chunkFilename: '[name].[contenthash:5].js',
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        loader: 'file-loader',
        options: {
          name: resource =>
            /unhashed/.test(resource)
              ? '[name].[ext]'
              : '[name].[contenthash:5].[ext]',
        },
      },
    ],
  },
};
