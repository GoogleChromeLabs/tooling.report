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
import matter from 'gray-matter';
import marked from 'marked';
import { relative, sep } from 'path';
import Prism from 'prismjs';

const prefix = 'md:';

/**
 * @typedef {Object} PluginOptions
 * @prop {(path: string, metaData: any) => void} [metadataValidator] - Validate metadata.
 */

/**
 * @param {PluginOptions} Options
 */
export default function markdownPlugin({ metadataProcessor } = {}) {
  const renderer = new marked.Renderer();
  renderer.code = (code, infostring, escaped) => {
    // We don’t have syntax highlighting for shell, but we use it in our
    // README.md. This is a workaround so that rendering teh README.md
    // succeeds and we can rip out the first paragraph.
    if (infostring === 'sh') {
      infostring = '';
    }
    if (!infostring || infostring.length <= 0) {
      return `
        <pre class="language-text"><code class="language-text">${code}</code></pre>`;
    }
    if (!(infostring in Prism.languages)) {
      throw Error(`Unsupported language "${infostring}"`);
    }
    return `
      <pre class="language-${infostring}"><code class="language-${infostring}">${Prism.highlight(
      code,
      Prism.languages[infostring],
      infostring,
    )}</code></pre>
    `;
  };

  return {
    name: 'markdown-plugin',
    async resolveId(id, importer) {
      if (!id.startsWith(prefix)) return;
      const realId = id.slice(prefix.length);
      const resolved = await this.resolve(realId, importer);
      if (!resolved) {
        throw Error(`Cannot find ${realId}`);
      }
      // Add an additional .js to the end so it ends up with .js at the end in the _virtual folder.
      return prefix + resolved.id + '.js';
    },
    async load(id) {
      if (!id.startsWith(prefix)) return;

      const realId = id.slice(prefix.length, -'.js'.length);
      this.addWatchFile(realId);
      const source = await fs.readFile(realId);
      const { content, data } = matter(source);

      if (metadataProcessor) {
        // Normalised realtive path for the validator
        const relativePath = relative(process.cwd(), realId)
          .split(sep)
          .join('/');
        await metadataProcessor(relativePath, data, this);
      }

      const html = marked(content, { renderer });

      return `
        export const html = ${JSON.stringify(html)};
        export const meta = ${JSON.stringify(data)};
      `;
    },
  };
}
