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
const { ConcatSource, RawSource } = require('webpack-sources');
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

      const resolver = factory.getResolver('normal');
      const resolve = require('util').promisify(
        resolver.resolve.bind(resolver),
      );
      // const resolve = (context, request) => new Promise((resolve, reject) => {
      //   resolver.resolve({}, context, request, {}, (err, result) => {
      //     if (err) reject(err);
      //     else resolve(result);
      //   });
      // });

      factory.hooks.resolver.tap(NAME, originalResolve => {
        return async (dep, callback) => {
          if (!dep.request.startsWith(swFilePrefix)) {
            return originalResolve(dep, callback);
          }

          // debugger;

          // console.log('SW: ', dep);
          const request = dep.request.slice(swFilePrefix.length);
          const resolved = await resolve({}, dep.context, request, {});

          serviceWorkers.push({
            outputFilename: this.output,
            filename: request,
            context: dep.context,
          });

          // new Promise((resolve, reject) => {
          //   factory.getResolver('normal').resolve({}, dep.context, request, {}, (err, result) => {
          //     if (err) reject(err);
          //     else resolve(result);
          //   });
          // });

          // const resolver = factory.getResolver('normal');
          // resolver.resolve({}, dep.context, request, {}, (err, result) => {
          // });

          // console.log(dep.context, request, resolved);

          const str = JSON.stringify(this.output);
          const code = `module.exports = __webpack_public_path__ + ${str}`;
          return callback(null, new RawModule(code, null, `sw:${request}`));

          const mod = {
            type: 'javascript/dynamic',
            request,
            userRequest: dep.request,
            rawRequest: dep.rawRequest || dep.request,
            loaders: [],
            resource: resolved,
            parser: {
              parse(source, { module }) {
                console.log('parse ', module.context, module.request);
                module.buildMeta.exportsType = 'default';
                // module.buildMeta.defaultObject = "redirect-warn";
                module.buildInfo.content = JSON.stringify(source);
              },
            },
            generator: {
              // getSize(module) {
              //   return 17 + module.buildInfo.content.length;
              // },
              /** @type {import('webpack/lib/Generator')['generate']} */
              generate(module, dependencyTemplates, runtimeTemplate, type) {
                // console.log('generate ', module.buildInfo.content);
                return new RawSource(
                  `module.exports = ${module.buildInfo.content}`,
                );
              },
            },
            // resolveOptions: {
            //   settings: {},
            // },
            settings: {},
          };
          // mod.settings = {};

          // const mod = new RawModule(
          //   `export default ${JSON.stringify(this.output)};`,
          //   null,
          //   `sw:${request}`,
          // );

          callback(null, mod);
        };
      });

      /*
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
      */

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
