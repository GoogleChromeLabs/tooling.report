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

const prefix = 'html:';
const assetRe = new RegExp('/fake/path/to/asset/([^/]+)/');

function getDependencies(bundle, entryFile) {
  const fileNames = new Set([entryFile]);

  for (const fileName of fileNames) {
    for (const dependency of bundle[fileName].imports) {
      fileNames.add(dependency);
    }
  }

  fileNames.delete(entryFile);
  return [...fileNames];
}

export default function() {
  let emittedHTMLIds;
  let htmlEntries;

  async function loadHTML(id, rollupContext) {
    const parsedPath = parsePath(id);
    rollupContext.addWatchFile(id);
    const file = await fsp.readFile(id);

    const htmlResult = await postHTML()
      .use(tree => {
        const scriptNodes = [];
        tree.match({ tag: 'script', attrs: { src: true } }, node => {
          scriptNodes.push(node);
          return node;
        });

        for (const scriptNode of scriptNodes) {
          const fullPath = resolvePath(dirname(id), scriptNode.attrs.src);
          const fileId = rollupContext.emitFile({
            type: 'chunk',
            id: fullPath,
          });
          scriptNode.attrs.src = `/fake/path/to/asset/${fileId}/`;
        }
        return tree;
      })
      .process(file);

    const fileId = rollupContext.emitFile({
      type: 'asset',
      source: htmlResult.html,
      fileName: parsedPath.base,
    });

    emittedHTMLIds.push(fileId);
  }

  return {
    name: 'html',
    options(opts) {
      // Remove HTML entries from input so Rollup doesn't handle them itself.
      const inputs = Array.isArray(opts.input) ? opts.input : [opts.input];
      htmlEntries = inputs.filter(id => id.startsWith(prefix));
      opts.input = inputs.filter(id => !id.startsWith(prefix));
      emittedHTMLIds = [];
    },
    async buildStart() {
      await Promise.all(
        htmlEntries.map(htmlEntry =>
          loadHTML(htmlEntry.slice(prefix.length), this),
        ),
      );
    },
    async generateBundle(_, bundle) {
      const htmlAssets = emittedHTMLIds.map(id => this.getFileName(id));

      for (const htmlAsset of htmlAssets) {
        bundle[htmlAsset].source = (
          await postHTML()
            .use(async tree => {
              const parentMap = new WeakMap();
              const scriptNodes = [];
              tree.walk(node => {
                if (node.tag === 'script') {
                  scriptNodes.push(node);
                  return node;
                }
                if (!node.content) return;
                for (const item of node.content) {
                  if (typeof item !== 'object') continue;
                  parentMap.set(item, node);
                }
                return node;
              });

              for (const node of scriptNodes) {
                const parent = parentMap.get(node);
                const match = assetRe.exec(node.attrs.src);
                if (!match) continue;
                const id = match[1];
                const fileName = this.getFileName(id);
                node.attrs.src = fileName;
                const index = parent.content.indexOf(node);
                const dependencies = getDependencies(bundle, fileName);
                parent.content.splice(
                  index,
                  0,
                  ...dependencies.map(fileName => ({
                    tag: 'link',
                    attrs: { rel: 'preload', href: fileName, as: 'script' },
                  })),
                );
              }

              return tree;
            })
            .process(bundle[htmlAsset].source)
        ).html;
      }
    },
  };
}
