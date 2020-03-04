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
const TerserPlugin = require('terser-webpack-plugin');
const WorkerPlugin = require('worker-plugin');

module.exports = {
  stats: 'minimal',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    // at some point this will probably become the default value:
    globalObject: 'self'
  },
  plugins: [
    new WorkerPlugin()
  ],
  optimization: {
    // runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      minSize: 0
    },
    minimizer: [new TerserPlugin({
      terserOptions: {
        mangle: false,
        output: {
          beautify: true
        }
      }
    })]
  }
};