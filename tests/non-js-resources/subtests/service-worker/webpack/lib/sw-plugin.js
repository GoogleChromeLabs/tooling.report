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
const { promisify, callbackify } = require('util');
const { createHash } = require('crypto');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const WebWorkerTemplatePlugin = require('webpack/lib/webworker/WebWorkerTemplatePlugin');
const { ConcatSource, Source } = require('webpack-sources');
const RawModule = require('webpack/lib/RawModule');

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
    compiler.hooks.emit.tapPromise(NAME, this.emit.bind(this));

    compiler.hooks.normalModuleFactory.tap(NAME, factory => {
      factory.hooks.resolver.tap(NAME, resolve => {
        resolve = promisify(resolve);
        return callbackify(
          async dep => (await this.load(dep, resolve)) || (await resolve(dep)),
        );
      });
    });

    // compiler.hooks.normalModuleFactory.tap(NAME, factory => {
    //   const resolve = dep =>
    //     factory
    //       .getResolver('normal')
    //       .hooks.resolve.callAsync(dep.context, dep.request, dep.request, {});
    //   factory.hooks.afterResolve.tapAsync(NAME, async dep => {
    //     return (await this.load(dep, resolve)) || (await resolve(dep));
    //   });
    // });

    // compiler.hooks.normalModuleFactory.tap(NAME, factory => {
    //   factory.hooks.resolver.tap(NAME, originalResolve => {
    //     const resolve = promisify(originalResolve);
    //     return async (dep, callback) => {
    //       try {
    //         return (await this.load(dep, resolve)) || (await resolve(dep));
    //       } catch (e) {
    //         callback(e);
    //       }
    //     };
    //   });
    // });

    // compiler.hooks.normalModuleFactory.tap(NAME, factory => {
    //   factory.hooks.resolver.tap(NAME, resolve => {
    //     resolve = promisify(resolve);
    //     async function resolver(resolve, dep) {
    //       return (await this.load(dep, resolve)) || (await resolve(dep));
    //     }
    //     return callbackify(resolver);
    //   });
    // });

    // async function customResolve(resolve, dep) {
    //   const resolved = await this.load(dep, resolve);
    //   return resolved || (await resolve(dep));
    // }
    // compiler.hooks.normalModuleFactory.tap(NAME, factory => {
    //   factory.hooks.resolver.tap(NAME, resolve => {
    //     return callbackify(customResolve.bind(this, promisify(resolve)));
    //   });
    // });

    // compiler.hooks.normalModuleFactory.tap(NAME, factory => {
    //   factory.hooks.resolver.tap(NAME, resolve => {
    //     resolve = promisify(resolve);
    //     return callbackify(
    //       async dep => (await this.load(dep, resolve)) || (await resolve(dep)),
    //     );
    //   });
    // });

    // const doResolve = callbackify(async (resolve, dep) => {
    //   return (await this.load(dep, resolve)) || (await resolve(dep));
    // });
    // compiler.hooks.normalModuleFactory.tap(NAME, factory => {
    //   factory.hooks.resolver.tap(NAME, resolve =>
    //     doResolve.bind(null, promisify(resolve)),
    //   );
    // });

    // compiler.hooks.normalModuleFactory.tap(NAME, factory => {
    //   factory.hooks.resolver.tap(NAME, originalResolve => {
    //     const resolve = promisify(originalResolve);
    //     return (dep, callback) => {
    //       this.load(dep, resolve)
    //         .then(result => {
    //           if (result) callback(null, result);
    //           else originalResolve(dep, callback);
    //         })
    //         .catch(callback);
    //     };
    //   });
    // });
  }

  /** @param {NormalModule} dep */
  async load(dep, resolve) {
    if (!dep.request.startsWith(swFilePrefix)) return;

    dep.request = dep.request.slice(swFilePrefix.length);
    dep = await resolve(dep);
    if (!dep) return;
    this.sw = dep;

    const url = JSON.stringify(this.output);
    const code = `module.exports = __webpack_public_path__ + ${url}`;
    return new RawModule(code, null, `sw:${dep.rawRequest}`);
  }

  /** @param {Compilation} compilation */
  async emit(compilation) {
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

    const swAsset = await this.bundleSw(compilation, this.sw);

    compilation.assets[this.output] = new ConcatSource(
      `const VERSION = ${JSON.stringify(version)};\n`,
      `const ASSETS = ${JSON.stringify(fileNames)};\n`,
      swAsset.source(),
    );
  }

  /**
   * @param {Compilation} compilation
   * @param {NormalModule} sw
   * @returns {Promise<Source>}
   */
  bundleSw(compilation, sw) {
    const opts = {
      filename: this.output,
      globalObject: 'self',
    };
    const compiler = compilation.createChildCompiler(NAME, opts, []);
    new WebWorkerTemplatePlugin().apply(compiler);
    new SingleEntryPlugin(sw.context, sw.request, 'sw').apply(compiler);

    return new Promise((resolve, reject) => {
      compiler.runAsChild((err, entries, compilation) => {
        if (err) reject(err);
        else resolve(compilation.getAssets()[0].source);
      });
    });
  }
};
