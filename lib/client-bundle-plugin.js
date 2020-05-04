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
const entryPathPlaceholderRe = /ENTRY_PATH_PLACEHOLDER\d+\(\)/;
const importsPlaceholder = 'IMPORTS_PLACEHOLDER';
const importsPlaceholderRe = /IMPORTS_PLACEHOLDER\d+\(\)/;

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
  let clientBundle;
  let clientOutput;

  return {
    name: 'client-bundle',
    buildStart() {
      entryPoints = [];
      exportCounter = 0;
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
        // These are fake function calls to work around
        // https://github.com/rollup/rollup/issues/3534
        `export default ${entryPathPlaceholder + exportCounter + '()'};`,
        `export const imports = ${importsPlaceholder + exportCounter + '()'};`,
      ].join('\n');
    },
    async buildEnd(error) {
      // The server build is done, so now we can perform our client build.
      if (error || entryPoints.length === 0) return;
      clientBundle = await rollup.rollup({
        ...inputOptions,
        cache,
        input: entryPoints,
      });

      cache = clientBundle.cache;
    },
    async renderStart(serverOutputOpts) {
      // The server has started generating output, so we can do the same for our client build.
      const copiedOutputOptions = {
        assetFileNames: serverOutputOpts.assetFileNames,
      };
      clientOutput = (
        await clientBundle.generate({
          ...copiedOutputOptions,
          ...outputOptions,
        })
      ).output;
    },
    async renderChunk(code, chunk, outputOptions) {
      // Pick up the placeholder exports we created earlier, and fill in the correct details.
      if (!chunk.facadeModuleId.startsWith(prefix)) return;
      const clientEntry = clientOutput.find(
        item => prefix + item.facadeModuleId + '.js' === chunk.facadeModuleId,
      );

      const dependencies = getDependencies(clientOutput, clientEntry);

      return code
        .replace(
          entryPathPlaceholderRe,
          resolveFileUrl({
            fileName: clientEntry.fileName,
            moduleId: chunk.facadeModuleId,
            format: outputOptions.format,
          }),
        )
        .replace(
          importsPlaceholderRe,
          '[' +
            dependencies
              .map(item => {
                const entry = clientOutput.find(v => v.fileName === item);

                return resolveFileUrl({
                  fileName: entry.fileName,
                  moduleId: chunk.facadeModuleId,
                  format: outputOptions.format,
                });
              })
              .join(',') +
            ']',
        );
    },
    async generateBundle(options, bundle) {
      // Copy everything from the client bundle into the main bundle.
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
