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
import marked from 'marked';
import { join } from 'path';
import { createRenderer } from './markdown-renderer';

const moduleId = 'faqs:';
const splitPoint = '§§§TOP-LEVEL-HEADING:';
const renderer = createRenderer();

renderer.heading = function(text, level) {
  // We're going to split on top-level headings.
  if (level === 1) return splitPoint + text + '\n';
  // Make h2s into h3s etc.
  // That makes it the right level for the rest of our HTML.
  const adjustedLevel = level + 1;
  return `<h${adjustedLevel}>${text}</h${adjustedLevel}>`;
};

export default function faqPlugin() {
  return {
    name: 'faq-plugin',
    async resolveId(id) {
      if (id === moduleId) return moduleId;
    },
    async load(id) {
      if (id !== moduleId) return;

      const path = join('faqs', 'index.md');
      this.addWatchFile(path);
      const source = await fs.readFile(path, { encoding: 'utf8' });

      const html = marked(source, { renderer });

      const faqs = html.split(splitPoint).map(faqItem => {
        const firstBreak = faqItem.indexOf('\n');
        return {
          title: faqItem.slice(0, firstBreak),
          html: faqItem.slice(firstBreak),
        };
      });

      return `export default ${JSON.stringify(faqs)};`;
    },
  };
}
