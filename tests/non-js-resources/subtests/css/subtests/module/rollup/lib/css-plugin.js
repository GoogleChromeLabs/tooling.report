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
import { parse as parsePath } from 'path';

import postcss from 'postcss';
import postcssModules from 'postcss-modules';
import camelCase from 'lodash.camelcase';

const prefix = 'css:';

export default function() {
  return {
    name: 'css',
    async resolveId(id, importer) {
      if (!id.startsWith(prefix)) return null;

      const realId = id.slice(prefix.length);
      const resolveResult = await this.resolve(realId, importer);
      if (!resolveResult) {
        throw Error(`Cannot resolve ${resolveResult.id}`);
      }
      return prefix + resolveResult.id;
    },
    async load(id) {
      if (!id.startsWith(prefix)) return;

      const realId = id.slice(prefix.length);
      const parsedPath = parsePath(realId);
      this.addWatchFile(realId);
      const file = await fsp.readFile(realId);
      let moduleJSON;

      const cssResult = await postcss([
        postcssModules({
          getJSON(_, json) {
            moduleJSON = json;
          },
        }),
      ]).process(file, {
        from: undefined,
      });

      const exports = Object.entries(moduleJSON).map(
        ([key, val]) =>
          `export const ${camelCase(key)} = ${JSON.stringify(val)};`,
      );

      const fileId = this.emitFile({
        type: 'asset',
        source: cssResult.css,
        name: parsedPath.base,
      });

      return `export default import.meta.ROLLUP_FILE_URL_${fileId};\n${exports.join(
        '\n',
      )}`;
    },
  };
}
