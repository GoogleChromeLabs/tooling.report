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
import rollup from 'rollup';

const prefix = 'client-bundle:';
const entryPathPlaceholder = 'ENTRY_PATH_PLACEHOLDER';
const entryPathPlaceholderRe = /ENTRY_PATH_PLACEHOLDER\d+/;
const importsPlaceholder = 'IMPORTS_PLACEHOLDER';
const importsPlaceholderRe = /IMPORTS_PLACEHOLDER\d+/;

export function getDependencies(clientOutput, item) {
  const crawlDependencies = new Set([item.fileName]);

  for (const fileName of crawlDependencies) {
    const chunk = clientOutput.find(v => v.fileName === fileName);

    for (const dep of chunk.imports) {
      crawlDependencies.add(dep);
    }
  }

  // Don't add self as dependency
  crawlDependencies.delete(item.fileName);

  return [...crawlDependencies];
}

export default function(inputOptions, outputOptions, resolveFileUrl) {
  let cache;
  let entryPoints;
  let exportCounter;
  let copiedOutputOptions;

  return {
    name: 'client-bundle',
    buildStart() {
      entryPoints = [];
      exportCounter = 0;
    },
    outputOptions(outputOptions) {
      copiedOutputOptions = { assetFileNames: outputOptions.assetFileNames };
    },
    async resolveId(id, importer) {
      if (!id.startsWith(prefix)) return null;

      const realId = id.slice(prefix.length);
      const resolveResult = await this.resolve(realId, importer);
      // Add an additional .js to the end so it ends up with .js at the end in the _virtual folder.
      if (resolveResult) {
        return prefix + resolveResult.id + '.js';
      }
      // This Rollup couldn't resolve it, but maybe the inner one can.
      return id + '.js';
    },
    load(id) {
      if (!id.startsWith(prefix)) return;

      const realId = id.slice(prefix.length, -'.js'.length);
      entryPoints.push(realId);

      exportCounter++;

      return [
        `export default ${entryPathPlaceholder + exportCounter};`,
        `export const imports = ${importsPlaceholder + exportCounter};`,
      ].join('\n');
    },
    async generateBundle(options, bundle) {
      if (entryPoints.length === 0) return;

      const clientBundle = await rollup.rollup({
        ...inputOptions,
        cache,
        input: entryPoints,
      });

      cache = clientBundle.cache;

      const { output: clientOutput } = await clientBundle.generate({
        ...copiedOutputOptions,
        ...outputOptions,
      });

      // Replace references to client bundles
      for (const entryPoint of entryPoints) {
        const clientEntry = clientOutput.find(
          item => item.facadeModuleId === entryPoint,
        );
        const bundleEntry = Object.values(bundle).find(
          item => item.facadeModuleId === prefix + entryPoint + '.js',
        );

        bundleEntry.code = bundleEntry.code.replace(
          entryPathPlaceholderRe,
          resolveFileUrl({
            fileName: clientEntry.fileName,
            moduleId: bundleEntry.facadeModuleId,
            format: options.format,
          }),
        );

        const dependencies = getDependencies(clientOutput, clientEntry);

        bundleEntry.code = bundleEntry.code.replace(
          importsPlaceholderRe,
          '[' +
            dependencies
              .map(item => {
                const entry = clientOutput.find(v => v.fileName === item);

                return resolveFileUrl({
                  fileName: entry.fileName,
                  moduleId: bundleEntry.facadeModuleId,
                  format: options.format,
                });
              })
              .join(',') +
            ']',
        );
      }

      // Copy everything from the client bundle into the main bundle
      for (const clientEntry of clientOutput) {
        // Skip if the file already exists
        if (clientEntry.fileName in bundle) continue;

        this.emitFile({
          type: 'asset',
          source: clientEntry.code || clientEntry.source,
          fileName: clientEntry.fileName,
        });
      }
    },
  };
}
