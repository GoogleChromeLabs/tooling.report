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
import { basename, relative } from 'path';
import { createHash } from 'crypto';

const swFilePrefix = 'sw:';

export default function serviceWorkerPlugin({
  filterAssets = () => true,
} = {}) {
  let emittedIds;

  return {
    name: 'service-worker',
    buildStart() {
      emittedIds = [];
    },
    async resolveId(id, importer) {
      if (!id.startsWith(swFilePrefix)) return;

      const realId = id.slice(swFilePrefix.length);
      const result = await this.resolve(realId, importer);

      if (!result) throw Error(`Cannot find ${realId} from ${importer}`);

      return swFilePrefix + result.id;
    },
    load(id) {
      if (!id.startsWith(swFilePrefix)) return;

      const realId = id.slice(swFilePrefix.length);
      const fileId = this.emitFile({
        type: 'chunk',
        id: realId,
        fileName: basename(realId),
      });

      emittedIds.push(fileId);
      this.addWatchFile(realId);

      return `export default import.meta.ROLLUP_FILE_URL_${fileId};`;
    },
    generateBundle(_, bundle) {
      const bundleItems = Object.values(bundle);

      for (const swId of emittedIds) {
        const swChunk = bundle[this.getFileName(swId)];
        const swPath = relative(process.cwd(), swChunk.facadeModuleId);
        const toCacheInSW = bundleItems.filter(
          item => item !== swChunk && filterAssets(item, swPath),
        );

        const versionHash = createHash('sha1');
        versionHash.update(swChunk.code);

        for (const item of toCacheInSW) {
          versionHash.update(item.code || item.source);
        }

        const version = versionHash.digest('hex');
        const fileNames = toCacheInSW.map(item => item.fileName);

        swChunk.code =
          `const VERSION = ${JSON.stringify(version)};\n` +
          `const ASSETS = ${JSON.stringify(fileNames)};\n` +
          swChunk.code;
      }
    },
  };
}
