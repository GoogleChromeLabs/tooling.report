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
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadPlugin = require('preload-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name].[contenthash:5].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|ttf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash:5].[ext]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:5].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
    }),
    new PreloadPlugin({
      // Preload all assets, not just JS:
      include: 'allAssets',
      // By default only CSS and JS are supported, so we'll add images and fonts:
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.ttf$/.test(entry)) return 'font';
        if (/\.png$/.test(entry)) return 'image';
        return 'script';
      },
    }),
  ],
};
