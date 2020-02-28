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
import { createHash } from 'crypto';

function removeAssetHash(fileName) {
  const noHashFilename = fileName.replace(/-[a-f0-9]+(\.[^.]+)$/, '$1');
  if (fileName === noHashFilename) {
    console.warn(`Skipping ${fileName} - couldn't find hash in filename`);
  }
  return noHashFilename;
}

export default function importMapPlugin() {
  let assetsToMap;
  return {
    name: 'import-map-plugin',
    buildStart() {
      assetsToMap = new Set();
    },
    resolveFileUrl({ fileName }) {
      assetsToMap.add(fileName);
      return `System.resolve('./${removeAssetHash(fileName)}')`;
    },
    generateBundle(outputOpts, bundle) {
      const importMap = { imports: {} };

      const assets = Object.values(bundle).filter(b =>
        assetsToMap.has(b.fileName),
      );
      const chunks = Object.values(bundle).filter(b => b.type === 'chunk');

      for (const asset of assets) {
        const noHashFilename = removeAssetHash(asset.fileName);
        importMap.imports['./' + noHashFilename] = './' + asset.fileName;
        this.emitFile({
          type: 'asset',
          source: asset.source,
          fileName: noHashFilename,
        });
      }

      for (const chunk of chunks) {
        const hash = createHash('md5');
        hash.update(chunk.code);
        const hashedFilename = chunk.fileName.replace(
          /\.js$/,
          `-${hash.digest('hex').slice(0, 8)}.js`,
        );
        importMap.imports['./' + chunk.fileName] = './' + hashedFilename;

        this.emitFile({
          type: 'asset',
          source: chunk.code,
          fileName: hashedFilename,
        });
      }

      this.emitFile({
        type: 'asset',
        source: JSON.stringify(importMap),
        fileName: 'import-map.json',
      });
    },
  };
}
