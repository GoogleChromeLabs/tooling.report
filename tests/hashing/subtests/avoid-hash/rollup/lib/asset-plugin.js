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

export default function assetPlugin({ hashChunk = () => true }) {
  return {
    name: 'asset-plugin',
    async resolveId(id, importer) {
      if (!id.startsWith(prefix)) return;
      return prefix + (await this.resolveId(id.slice(prefix.length), importer));
    },
    async load(id) {
      if (!id.startsWith(prefix)) return;
      const realId = id.slice(prefix.length);
      const emitOpts = {
        type: 'asset',
        source: await fs.readFile(realId),
      };

      emitOpts[hashChunk(realId) ? 'name' : 'fileName'] = basename(realId);

      return `export default import.meta.ROLLUP_FILE_URL_${this.emitFile(
        emitOpts,
      )}`;
    },
  };
}
