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
import { promises as fs } from 'fs';
import { basename } from 'path';

const prefix = 'asset-url:';

export default function assetPlugin() {
  /** @type {Map<string, Buffer>} */
  let assetIdToSourceBuffer;

  return {
    name: 'asset-plugin',
    buildStart() {
      assetIdToSourceBuffer = new Map();
    },
    augmentChunkHash(info) {
      // Get the sources for all assets imported by this chunk.
      const buffers = Object.keys(info.modules)
        .map(moduleId => assetIdToSourceBuffer.get(moduleId))
        .filter(Boolean);

      if (buffers.length === 0) return;

      for (const moduleId of Object.keys(info.modules)) {
        const buffer = assetIdToSourceBuffer.get(moduleId);
        if (buffer) buffers.push(buffer);
      }

      const combinedBuffer =
        buffers.length === 1 ? buffers[0] : Buffer.concat(buffers);

      return combinedBuffer;
    },
    async resolveId(id, importer) {
      if (!id.startsWith(prefix)) return;
      return (
        prefix + (await this.resolve(id.slice(prefix.length), importer)).id
      );
    },
    async load(id) {
      if (!id.startsWith(prefix)) return;
      const realId = id.slice(prefix.length);
      const source = await fs.readFile(realId);
      assetIdToSourceBuffer.set(id, source);

      return `export default import.meta.ROLLUP_FILE_URL_${this.emitFile({
        type: 'asset',
        source,
        name: basename(realId),
      })}`;
    },
  };
}
