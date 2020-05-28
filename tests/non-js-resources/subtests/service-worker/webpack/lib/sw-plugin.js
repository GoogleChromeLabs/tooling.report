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
// const ConcatSource = require('webpack-sources/lib/ConcatSource');

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
      // compilation.mainTemplate.outputOptions.globalObject = 'self';
      return this.emit(compilation, serviceWorkers);
    });

    /*
				contextInfo,
				resolveOptions,
				context,
				request,
				dependencies
    */

    compiler.hooks.normalModuleFactory.tap(NAME, factory => {
      // factory.getResolver('normal');

      factory.hooks.beforeResolve.tap(NAME, dep => {
        // return (dep, callback) => {
        if (!dep.request.startsWith(swFilePrefix)) return dep;

        const request = dep.request.slice(swFilePrefix.length);

        console.log('sw: ', request, dep);

        serviceWorkers.push({
          outputFilename: this.output,
          filename: request,
          context: dep.context,
        });

        return dep;

        // return {
        //   identifier: () => `sw-${serviceWorkers.length}`,
        //   source: () => `export default ${JSON.stringify(this.output)};`,
        // };
      });

      // factory.hooks.createModule.tap(NAME, result => {
      //   console.log('createModule: ', result);
      // });

      /*
      // https://github.com/webpack/webpack/blob/8070bcd333cd1d07ce13fe5e91530c80779d51c6/lib/NormalModuleFactory.js#L34
      factory.hooks.resolver.tap(NAME, originalResolve => {
        // console.log(resolve + '');
        return (dep, callback) => {
          // console.log(dep);
          // factory.hooks.beforeResolve.tap(NAME, dep => {
          // const { contextInfo, resolveOptions, context, request, dependencies } = dependency;
          // const p = factory.resolveRequestArray(
          //   factory.context,
          //   context,
          //   request,
          //   factory.getResolver('normal'),
          //   (a, b) => {

          //   }
          // );
          // console.log('resolve', dep.request, dep.context);
          if (dep.request.startsWith(swFilePrefix)) {
            console.log('SW: ', dep);
            const request = dep.request.slice(swFilePrefix.length);
            serviceWorkers.push({
              outputFilename: this.output,
              filename: request,
              context: dep.context,
            });

            const mod = new RawModule(
              `export default ${JSON.stringify(this.output)};`,
              null,
              `sw:${request}`,
            );

            callback(mod);
            return;

            // return mod;

            // return new RawModule(
            //   `export default ${JSON.stringify(this.output)};`,
            //   null,
            //   `sw:${request}`,
            // );
            // return request;
          }

          originalResolve(dep, callback);
        };
      });
      */
    });
  }

  /**
   * @param {import('webpack/lib/Compilation')} compilation
   * @param {{ outputFilename: string, filename: string, context: import('webpack').compilation.Module['context'] }[]} serviceWorkers
   */
  async emit(compilation, serviceWorkers) {
    const toCache = Object.keys(compilation.assets).filter(this.filterAssets);

    const hash = createHash('sha1');
    for (const file of toCache) {
      compilation.assets[file].updateHash(hash);
    }
    const version = hash.digest('hex');
    const fileNames = toCache.map(
      // @TODO: prepend output.publicPath?
      fileName => './' + fileName.replace(/(index)?\.html$/, ''),
    );

    for (const serviceWorker of serviceWorkers) {
      const { filename, context, outputFilename } = serviceWorker;
      const swAsset = await this.bundleSw(
        compilation,
        filename,
        context,
        outputFilename,
      );

      // const swCode =
      //   `const VERSION = ${JSON.stringify(version)};\n` +
      //   `const ASSETS = ${JSON.stringify(fileNames)};\n` +
      //   swAsset.source();
      // compilation.assets[filename] = new RawSource(swCode);

      compilation.assets[filename] = new ConcatSource(
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
   * @param {string} name
   * @returns {Promise<import('webpack-sources').Source>}
   */
  bundleSw(compilation, filename, context, name = filename) {
    const opts = {
      filename,
      globalObject: 'self',
    };
    const childCompiler = compilation.createChildCompiler(NAME, opts, []);
    new WebWorkerTemplatePlugin().apply(childCompiler);
    new SingleEntryPlugin(context, filename, name).apply(childCompiler);

    return new Promise((resolve, reject) => {
      childCompiler.runAsChild((err, entries) => {
        if (err) reject(err);
        else resolve(entries[0].files[0]);
      });
    });
  }
};
