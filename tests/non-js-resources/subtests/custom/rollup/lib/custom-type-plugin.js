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

const prefix = 'custom-type:';
const customTypeHelpers = `
export function base64ToBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (const i of bytes.keys()) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export class CustomType {
  constructor(buffer) {
    this.buffer = buffer;
  }
}
`;

export default function customTypePlugin() {
  return {
    name: 'custom-type-plugin',
    async resolveId(id, importer) {
      if (id === '\0custom-type-helpers') return id;
      if (!id.startsWith(prefix)) return;
      return (
        prefix + (await this.resolve(id.slice(prefix.length), importer)).id
      );
    },
    async load(id) {
      if (id === '\0custom-type-helpers') return customTypeHelpers;
      if (!id.startsWith(prefix)) return;
      const realId = id.slice(prefix.length);
      const source = await fs.readFile(realId);
      const base64 = source.toString('base64');

      return [
        `import { base64ToBuffer, CustomType } from '\0custom-type-helpers';`,
        `export default new CustomType(base64ToBuffer(${JSON.stringify(
          base64,
        )}));`,
      ].join('\n');
    },
  };
}
