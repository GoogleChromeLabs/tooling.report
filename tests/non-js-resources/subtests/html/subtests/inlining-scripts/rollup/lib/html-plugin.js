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
import rollup from 'rollup';
import { promises as fsp } from 'fs';
import { parse as parsePath, resolve as resolvePath, dirname } from 'path';

import postHTML from 'posthtml';

const prefix = 'html:';
const assetRe = new RegExp('/fake/path/to/asset/([^/]+)/');

// https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements
const replaceInlineScript = {
  '<!--': '<\\!--',
  '<script': '<\\script',
  '</script': '<\\/script',
};

function filterInlineScript(str) {
  return str.replace(
    /<!--|<script|<\/script/g,
    found => replaceInlineScript[found],
  );
}

export default function() {
  let emittedHTMLIds;
  let htmlEntries;
  let bundlePromises;

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
          const match = /^(chunk(?:-inline)?):(.+)/.exec(scriptNode.attrs.src);
          if (!match) return;
          const [type, relativePath] = match.slice(1);
          const fullPath = resolvePath(dirname(id), relativePath);
          const fileName = relativePath.slice(2);
          if (type === 'chunk-inline') {
            bundlePromises.set(
              fileName,
              rollup.rollup({
                input: fullPath,
              }),
            );
            scriptNode.attrs.src = fileName;
            scriptNode.attrs['data-x-to-inline'] = true;
          } else {
            const fileId = rollupContext.emitFile({
              type: 'chunk',
              id: fullPath,
            });
            scriptNode.attrs.src = `/fake/path/to/asset/${fileId}/`;
          }
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
      bundlePromises = new Map();
    },
    async buildStart(opts) {
      await Promise.all(
        htmlEntries.map(htmlEntry =>
          loadHTML(htmlEntry.slice(prefix.length), this),
        ),
      );
    },
    async generateBundle(options, bundle) {
      const htmlAssets = emittedHTMLIds.map(id => this.getFileName(id));

      for (const htmlAsset of htmlAssets) {
        bundle[htmlAsset].source = (
          await postHTML()
            .use(async tree => {
              const scriptNodes = [];
              tree.match({ tag: 'script', attrs: { src: true } }, node => {
                scriptNodes.push(node);
                return node;
              });

              for (const node of scriptNodes) {
                if ('data-x-to-inline' in node.attrs) {
                  const clientBundle = await bundlePromises.get(node.attrs.src);
                  const { output } = await clientBundle.generate({
                    format: 'esm',
                  });
                  const index = output.findIndex(
                    chunk => chunk.fileName === node.attrs.src,
                  );
                  const chunk = output[index];
                  for (const [i, chunk] of output.entries()) {
                    if (i === index) continue;
                    bundle[chunk.fileName] = chunk;
                  }
                  delete node.attrs.src;
                  node.content = filterInlineScript(chunk.code);
                  continue;
                }
                const match = assetRe.exec(node.attrs.src);
                if (!match) continue;
                const id = match[1];
                const fileName = this.getFileName(id);
                node.attrs.src = fileName;
              }

              return tree;
            })
            .process(bundle[htmlAsset].source)
        ).html;
      }
    },
  };
}
