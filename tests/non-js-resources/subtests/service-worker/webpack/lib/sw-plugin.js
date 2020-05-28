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
const { createHash } = require('crypto');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const WebWorkerTemplatePlugin = require('webpack/lib/webworker/WebWorkerTemplatePlugin');
const { ConcatSource } = require('webpack-sources');
const RawModule = require('webpack/lib/RawModule');

const swFilePrefix = 'sw:';

const NAME = 'service-worker';

module.exports = class AutoSWPlugin {
  constructor({ output = 'sw.js', filterAssets = () => true }) {
    this.output = output;
    this.filterAssets = filterAssets;
  }

  /** @param {import('webpack/lib/Compiler')} compiler */
  apply(compiler) {
    const serviceWorkers = [];

    compiler.hooks.emit.tapPromise(NAME, compilation => {
      return this.emit(compilation, serviceWorkers);
    });

    compiler.hooks.normalModuleFactory.tap(NAME, factory => {
      factory.hooks.resolver.tap(NAME, originalResolve => {
        return async (dep, callback) => {
          if (!dep.request.startsWith(swFilePrefix)) {
            return originalResolve(dep, callback);
          }

          const request = dep.request.slice(swFilePrefix.length);

          serviceWorkers.push({
            outputFilename: this.output,
            filename: request,
            context: dep.context,
          });

          const url = JSON.stringify(this.output);
          const code = `module.exports = __webpack_public_path__ + ${url}`;
          return callback(null, new RawModule(code, null, `sw:${request}`));
        };
      });
    });
  }

  /**
   * @param {import('webpack/lib/Compilation')} compilation
   * @param {{ outputFilename: string, filename: string, context: import('webpack').compilation.Module['context'] }[]} serviceWorkers
   */
  async emit(compilation, serviceWorkers) {
    const toCache = Object.keys(compilation.assets).filter(this.filterAssets);

    const versionHash = createHash('sha1');
    for (const file of toCache) {
      const asset = compilation.assets[file];
      versionHash.update(asset.source());
      // would work if HtmlWebpackPlugin used webpack-sources :/
      // asset.updateHash(hash);
    }
    const version = versionHash.digest('hex');

    const publicPath = compilation.outputOptions.publicPath || '/';
    const fileNames = toCache.map(
      fileName => publicPath + fileName.replace(/(index)?\.html$/, ''),
    );

    for (const serviceWorker of serviceWorkers) {
      const { filename, context, outputFilename } = serviceWorker;
      const swAsset = await this.bundleSw(compilation, filename, context);

      compilation.assets[outputFilename] = new ConcatSource(
        `const VERSION = ${JSON.stringify(version)};\n`,
        `const ASSETS = ${JSON.stringify(fileNames)};\n`,
        swAsset.source(),
      );
    }
  }

  /**
   * @param {import('webpack/lib/Compilation')} compilation
   * @param {string} filename
   * @param {string} context
   * @returns {Promise<import('webpack-sources').Source>}
   */
  bundleSw(compilation, filename, context) {
    const opts = {
      filename,
      globalObject: 'self',
    };
    const childCompiler = compilation.createChildCompiler(NAME, opts, []);
    new WebWorkerTemplatePlugin().apply(childCompiler);
    new SingleEntryPlugin(context, filename, 'sw').apply(childCompiler);

    return new Promise((resolve, reject) => {
      childCompiler.runAsChild((err, entries, compilation) => {
        if (err) reject(err);
        else resolve(compilation.getAssets()[0].source);
      });
    });
  }
};
