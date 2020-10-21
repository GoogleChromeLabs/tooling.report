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
const {
  sources: { ConcatSource },
  util: { createHash },
  Compilation,
} = require('webpack');

/** @typedef {import('webpack/lib/Compiler')} Compiler */

module.exports = class ServiceWorkerInfoPlugin {
  constructor({
    test = file => file === 'sw.js',
    filterAssets = () => true,
  } = {}) {
    this.test = test;
    this.filterAssets = filterAssets;
  }

  /** @param {Compiler} compiler */
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      'ServiceWorkerInfoPlugin',
      compilation => {
        compilation.hooks.processAssets.tap(
          {
            name: 'ServiceWorkerInfoPlugin',
            stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
          },
          assetsList => {
            const assets = compilation.getAssets();
            const swAssets = assets.filter(asset => this.test(asset.name));
            const referencedAssets = assets
              .filter(
                asset =>
                  this.filterAssets(asset.name) && !this.test(asset.name),
              )
              .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

            const { outputOptions } = compilation;
            const versionHash = createHash(outputOptions.hashFunction);
            if (outputOptions.hashSalt) {
              versionHash.update(outputOptions.hashSalt);
            }
            for (const asset of referencedAssets) {
              versionHash.update(asset.source.buffer());
            }
            const version = versionHash
              .digest(outputOptions.hashDigest)
              .slice(0, outputOptions.hashDigestLength);

            const publicPath =
              outputOptions.publicPath === 'auto'
                ? '/'
                : outputOptions.publicPath || '/';
            const fileNames = referencedAssets.map(
              asset => publicPath + asset.name.replace(/(index)?\.html$/, ''),
            );

            for (const asset of swAssets) {
              compilation.updateAsset(asset.name, source => {
                return new ConcatSource(
                  `const VERSION = ${JSON.stringify(version)};\n`,
                  `const ASSETS = ${JSON.stringify(fileNames)};\n`,
                  source,
                );
              });
            }
          },
        );
      },
    );
  }
};
