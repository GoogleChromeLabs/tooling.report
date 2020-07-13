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
    index: './src/index.js',
    profile: './src/profile.js',
  },
  output: {
    filename: '[name].[contenthash:5].js',
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash:5].[ext]',
        },
      },
    ],
  },
  optimization: {
    moduleIds: 'hashed',
    // create a dedicated bootstrap + hash mapping bundle:
    runtimeChunk: 'single',
    splitChunks: {
      // extract all shared dependencies from entry bundles:
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        // change the caching behavior of assets:
        assets: {
          // Select assets:
          test: /\.txt$/,
          chunks: 'async',
          // Target:
          name: 'runtime',
          // Do not check size limits:
          enforce: true,
        },
      },
    },
  },
};
