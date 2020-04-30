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
import { resolve, dirname } from 'path';

const prefix = 'faqs:';

export default function faqsPlugin() {
  return {
    name: 'faqs-plugin',
    async resolveId(id, importer) {
      if (!id.startsWith(prefix)) return;
      const realId = id.slice(prefix.length);
      // Don’t use `this.resolve()` as we might want to resolve for a folder
      const resolved = resolve(dirname(importer), realId);
      return prefix + resolved;
    },
    async load(id) {
      if (!id.startsWith(prefix)) return;
      const realId = id.slice(prefix.length);
      const files = await fsp.readdir(realId);
      return (
        `
        const faqs = [];
        export default faqs;
        ` +
        files
          .map((file, i) => {
            const path = resolve(realId, file);
            return `
        import * as faq${i} from "md:${path}";
        faqs.push(faq${i})
      `;
          })
          .join('')
      );
    },
  };
}
