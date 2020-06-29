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
const RawModule = require('webpack/lib/RawModule');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const WebWorkerTemplatePlugin = require('webpack/lib/webworker/WebWorkerTemplatePlugin');
const { ConcatSource } = require('webpack-sources');

/** @typedef {import('webpack/lib/Compiler')} Compiler */
/** @typedef {import('webpack/lib/Compilation')} Compilation */
/** @typedef {import('webpack/lib/NormalModule')} NormalModule */

const swFilePrefix = 'service-worker:';

const NAME = 'service-worker';

module.exports = class SWPlugin {
  constructor({ output = 'sw.js', filterAssets = () => true }) {
    this.output = output;
    this.filterAssets = filterAssets;
  }

  /** @param {Compiler} compiler */
  apply(compiler) {
    compiler.hooks.emit.tapAsync(NAME, this.emit.bind(this));

    compiler.hooks.normalModuleFactory.tap(NAME, factory => {
      factory.hooks.resolver.tap(NAME, resolve => {
        return (dep, callback) => this.resolveId(dep, resolve, callback);
      });
    });
  }

  /** @param {NormalModule} dep */
  resolveId(dep, resolve, callback) {
    if (!dep.request.startsWith(swFilePrefix)) {
      return resolve(dep, callback);
    }

    dep.request = dep.request.slice(swFilePrefix.length);
    resolve(dep, (err, dep) => {
      if (err) return callback(err);

      this.sw = dep.request;

      const url = JSON.stringify(this.output);
      const code = `module.exports = __webpack_public_path__ + ${url}`;
      callback(null, new RawModule(code, null, `sw:${dep.rawRequest}`));
    });
  }

  /** @param {Compilation} compilation */
  async emit(compilation, callback) {
    const toCache = Object.keys(compilation.assets).filter(this.filterAssets);

    const versionHash = createHash('sha1');
    for (const file of toCache) {
      versionHash.update(compilation.assets[file].source());
    }
    const version = versionHash.digest('hex');

    const publicPath = compilation.outputOptions.publicPath || '/';
    const fileNames = toCache.map(
      fileName => publicPath + fileName.replace(/(index)?\.html$/, ''),
    );

    compileSw(compilation, this.sw, this.output, (err, swAsset) => {
      if (err) return callback(err);

      compilation.assets[this.output] = new ConcatSource(
        `const VERSION = ${JSON.stringify(version)};\n`,
        `const ASSETS = ${JSON.stringify(fileNames)};\n`,
        swAsset,
      );
      callback();
    });
  }
};

function compileSw(compilation, entry, output, callback) {
  const opts = {
    filename: output,
    globalObject: 'self',
  };
  const compiler = compilation.createChildCompiler(NAME, opts, []);
  new WebWorkerTemplatePlugin().apply(compiler);
  new SingleEntryPlugin(null, entry, 'sw').apply(compiler);
  compiler.runAsChild((err, entries, compilation) => {
    callback(err, compilation.assets[output]);
  });
}
