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

const defaultOpts = {
  prefix: 'asset-url',
};

export default function assetPlugin(opts) {
  opts = Object.assign({}, defaultOpts, opts);
  const prefix = opts.prefix + ':';
  return {
    name: 'asset-plugin',
    async resolveId(id, importer) {
      if (!id.startsWith(prefix)) {
        return;
      }
      // Add an additional .js to the end so it ends up with .js at the end in the _virtual folder.
      return (
        prefix +
        (await this.resolveId(id.slice(prefix.length), importer)) +
        '.js'
      );
    },
    async load(id) {
      if (!id.startsWith(prefix)) {
        return;
      }

      const realId = id.slice(prefix.length, -'.js'.length);

      const fileId = this.emitFile({
        type: 'asset',
        source: await fs.readFile(realId),
        name: basename(realId),
      });

      return `export default import.meta.ROLLUP_FILE_URL_${fileId}`;
    },
  };
}
