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

const prefix = 'bin:';
const base64ToBuffer = `
export default function base64ToBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (const i of bytes.keys()) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
`;

export default function binaryPlugin() {
  return {
    name: 'binary-plugin',
    async resolveId(id, importer) {
      if (id === '\0base64-to-buffer') return id;
      if (!id.startsWith(prefix)) return;
      return (
        prefix + (await this.resolve(id.slice(prefix.length), importer)).id
      );
    },
    async load(id) {
      if (id === '\0base64-to-buffer') return base64ToBuffer;
      if (!id.startsWith(prefix)) return;
      const realId = id.slice(prefix.length);
      const source = await fs.readFile(realId);
      const base64 = source.toString('base64');

      return `import base64ToBuffer from '\0base64-to-buffer'; export default base64ToBuffer(${JSON.stringify(
        base64,
      )})`;
    },
  };
}
