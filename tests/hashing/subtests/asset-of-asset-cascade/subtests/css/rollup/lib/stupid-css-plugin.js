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
import { promises as fs, readFileSync } from 'fs';
import { createHash } from 'crypto';
import { resolve, parse as parsePath, relative, dirname } from 'path';

const prefix = 'css:';
const assetRe = new RegExp('/fake/path/to/asset/([^/]+)/', 'g');

export default function stupidCSSPlugin() {
  let emittedCSSIds;
  let hashToId;

  return {
    name: 'stupid-css-plugin',
    buildStart() {
      emittedCSSIds = [];
      hashToId = new Map();
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
      const parsedId = parsePath(realId);
      const css = await fs.readFile(realId, { encoding: 'utf8' });

      const source = css.replace(/url\((['"]?)(.*?)\1\)/g, (_1, _2, path) => {
        const parsedPath = parsePath(path);
        const cssAssetPath = resolve(parsedId.dir, path);
        const source = readFileSync(cssAssetPath);
        const fileId = this.emitFile({
          type: 'asset',
          name: parsedPath.base,
          source,
        });
        const hash = createHash('md5');
        hash.update(source);
        const md5 = hash.digest('hex');
        hashToId.set(md5, fileId);
        return `url("/fake/path/to/asset/${md5}/")`;
      });

      const fileId = this.emitFile({
        type: 'asset',
        source,
        name: parsedId.base,
      });

      emittedCSSIds.push(fileId);

      return `export default import.meta.ROLLUP_FILE_URL_${fileId}`;
    },
    async generateBundle(options, bundle) {
      const cssAssets = emittedCSSIds.map(id => this.getFileName(id));

      for (const cssAsset of cssAssets) {
        bundle[cssAsset].source = bundle[cssAsset].source.replace(
          assetRe,
          (match, p1) =>
            relative(
              dirname(bundle[cssAsset].fileName),
              this.getFileName(hashToId.get(p1)),
            ),
        );
      }
    },
  };
}
