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
import { promises as fsp } from 'fs';
import { parse as parsePath, resolve as resolvePath, dirname } from 'path';

import postHTML from 'posthtml';
import postHTMLURLS from 'posthtml-urls';

const prefix = 'html:';
const deleteMe = 'DELETE_ME';
const assetRe = new RegExp('/fake/path/to/asset/([^/]+)/', 'g');

export default function() {
  let emittedHTMLIds;

  return {
    name: 'html',
    buildStart() {
      emittedHTMLIds = [];
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

      const htmlResult = await postHTML()
        .use(
          postHTMLURLS({
            eachURL: async url => {
              const match = /^(chunk|asset):(.+)/.exec(url);
              if (!match) return;
              const [type, relativePath] = match.slice(1);
              const fullPath = resolvePath(dirname(realId), relativePath);
              const fileId = await (async () => {
                if (type === 'chunk') {
                  return this.emitFile({
                    type: 'chunk',
                    id: fullPath,
                  });
                }
                const source = await fsp.readFile(fullPath);
                const parsedPath = parsePath(relativePath);

                return this.emitFile({
                  type: 'asset',
                  name: parsedPath.base,
                  source,
                });
              })();

              return `/fake/path/to/asset/${fileId}/`;
            },
          }),
        )
        .process(file);

      const fileId = this.emitFile({
        type: 'asset',
        source: htmlResult.html,
        fileName: parsedPath.base,
      });

      emittedHTMLIds.push(fileId);

      return deleteMe;
    },
    async generateBundle(options, bundle) {
      const htmlAssets = emittedHTMLIds.map(id => this.getFileName(id));

      for (const htmlAsset of htmlAssets) {
        bundle[htmlAsset].source = bundle[htmlAsset].source.replace(
          assetRe,
          (match, p1) => {
            return '/' + this.getFileName(p1);
          },
        );
      }

      for (const [key, item] of Object.entries(bundle)) {
        if (item.code && item.code.startsWith(deleteMe)) {
          delete bundle[key];
        }
      }
    },
  };
}
