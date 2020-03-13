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
import { promises as fsp, readFileSync } from 'fs';
import { createHash } from 'crypto';
import { parse as parsePath, resolve as resolvePath, dirname } from 'path';

import postcss from 'postcss';
import postCSSUrl from 'postcss-url';

const prefix = 'css:';
const assetRe = new RegExp('/fake/path/to/asset/([^/]+)/', 'g');

export default function() {
  let emittedCSSIds;
  let hashToId;

  return {
    name: 'css',
    buildStart() {
      emittedCSSIds = [];
      hashToId = new Map();
    },
    async resolveId(id, importer) {
      if (!id.startsWith(prefix)) return null;

      const realId = id.slice(prefix.length);
      const resolveResult = await this.resolve(realId, importer);
      if (!resolveResult) {
        throw Error(`Cannot resolve ${realId} from ${importer}`);
      }
      return prefix + resolveResult.id;
    },
    async load(id) {
      if (!id.startsWith(prefix)) return;

      const realId = id.slice(prefix.length);
      const parsedPath = parsePath(realId);
      this.addWatchFile(realId);
      const file = await fsp.readFile(realId);

      const cssResult = await postcss([
        postCSSUrl({
          url: ({ relativePath, url }) => {
            if (/^https?:\/\//.test(url)) return url;
            const parsedPath = parsePath(relativePath);
            const source = readFileSync(
              resolvePath(dirname(realId), relativePath),
            );
            const fileId = this.emitFile({
              type: 'asset',
              name: parsedPath.base,
              source,
            });
            const hash = createHash('md5');
            hash.update(source);
            const md5 = hash.digest('hex');
            hashToId.set(md5, fileId);
            return `/fake/path/to/asset/${md5}/`;
          },
        }),
      ]).process(file, {
        from: undefined,
      });

      const fileId = this.emitFile({
        type: 'asset',
        source: cssResult.css,
        name: parsedPath.base,
      });

      emittedCSSIds.push(fileId);

      return `export default import.meta.ROLLUP_FILE_URL_${fileId};`;
    },
    generateBundle(options, bundle) {
      const cssAssets = emittedCSSIds.map(id => this.getFileName(id));

      for (const cssAsset of cssAssets) {
        bundle[cssAsset].source = bundle[cssAsset].source.replace(
          assetRe,
          (match, p1) => {
            return '/' + this.getFileName(hashToId.get(p1));
          },
        );
      }
    },
  };
}
