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
import { parse as parsePath } from 'path';
import { promisify } from 'util';

import postcss from 'postcss';
import postCSSNested from 'postcss-nested';
import postCSSUrl from 'postcss-url';
import postCSSModules from 'postcss-modules';
import cssNano from 'cssnano';
import camelCase from 'lodash.camelcase';
import glob from 'glob';

const globP = promisify(glob);

const suffix = '.css';
const assetRe = new RegExp('/fake/path/to/asset/([^/]+)/', 'g');

export default function() {
  /** @type {string[]} */
  let emittedCSSIds;
  /** @type {Map<string, string>} */
  let hashToId;
  /** @type {Map<string, string>} */
  let pathToModule;

  return {
    name: 'css',
    async buildStart() {
      emittedCSSIds = [];
      hashToId = new Map();
      pathToModule = new Map();

      const cssPaths = await globP('static-build/**/*.css', {
        nodir: true,
        absolute: true,
      });

      await Promise.all(
        cssPaths.map(async path => {
          this.addWatchFile(path);
          const parsedPath = parsePath(path);
          const file = await fsp.readFile(path);
          let moduleJSON;
          const cssResult = await postcss([
            postCSSNested,
            postCSSModules({
              getJSON(_, json) {
                moduleJSON = json;
              },
            }),
            postCSSUrl({
              url: ({ relativePath, url }) => {
                if (/^https?:\/\//.test(url)) return url;
                const parsedPath = parsePath(relativePath);
                const source = readFileSync(relativePath);
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
            cssNano,
          ]).process(file, {
            from: undefined,
          });

          const cssClassExports = Object.entries(moduleJSON).map(
            ([key, val]) =>
              `export const $${camelCase(key)} = ${JSON.stringify(val)};`,
          );

          const defs = [
            'declare var url: string;',
            'export default url;',
            'export const inline: string;',
            ...Object.keys(moduleJSON).map(
              key => `export const $${camelCase(key)}: string;`,
            ),
          ];

          const fileId = this.emitFile({
            type: 'asset',
            source: cssResult.css,
            name: parsedPath.base,
          });

          emittedCSSIds.push(fileId);

          await fsp.writeFile(path + '.d.ts', defs.join('\n'));

          pathToModule.set(
            path,
            [
              `export default import.meta.ROLLUP_FILE_URL_${fileId}`,
              `export const inline = ${JSON.stringify(cssResult.css)}`,
              ...cssClassExports,
            ].join('\n'),
          );
        }),
      );
    },
    async load(id) {
      if (!id.endsWith(suffix)) return;
      if (!pathToModule.has(id)) {
        throw Error(`Cannot find ${id} in pathToModule`);
      }

      return pathToModule.get(id);
    },
    async generateBundle(options, bundle) {
      const cssAssets = emittedCSSIds.map(id => this.getFileName(id));

      for (const cssAsset of cssAssets) {
        bundle[cssAsset].source = bundle[cssAsset].source.replace(
          assetRe,
          (match, p1) => {
            return '/' + this.getFileName(hashToId.get(p1));
          },
        );
      }

      for (const item of Object.values(bundle)) {
        if (item.type === 'asset') continue;
        item.code = item.code.replace(assetRe, (match, p1) => {
          return '/' + this.getFileName(hashToId.get(p1));
        });
      }
    },
  };
}
