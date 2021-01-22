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
const path = require('path');
module.exports = [
  ...[1, 2].map(src => ({
    name: `web-${src}`,
    context: path.resolve(__dirname, `src${src}`),
    entry: {
      index: './index.js',
      profile: './profile.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist', 'web', src + ''),
      filename: '[name].[contenthash:5].js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 0,
      },
    },
  })),
  // variant: "web" target, when using `dependsOn` to specify entry bundle dependencies
  ...[1, 2].map(src => ({
    name: `web-dependOn-${src}`,
    context: path.resolve(__dirname, `src${src}`),
    entry: {
      utils: ['./utils.js'],
      index: {
        import: './index.js',
        dependOn: 'utils',
      },
      profile: {
        import: './profile.js',
        dependOn: 'utils',
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist', 'web-dependOn', src + ''),
      filename: '[name].[contenthash:5].js',
    },
  })),
  // variant: "node" target (intentionally does cascade dependency hashes to entry)
  ...[1, 2].map(src => ({
    name: `node-${src}`,
    context: path.resolve(__dirname, `src${src}`),
    entry: {
      index: './index.js',
      profile: './profile.js',
    },
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'dist', 'node', src + ''),
      filename: '[name].[contenthash:5].js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 0,
      },
    },
  })),
];
