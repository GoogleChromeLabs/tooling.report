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
import { basename } from 'path';
import { promises as fsp } from 'fs';

export default function addAssetsPlugin() {
  return {
    name: 'add-assets',
    // Adding some items to the build.
    // In reality this would be done by more involved plugins, but
    // it's irrelevant to this test.
    async buildStart() {
      const hashableAssets = ['src/image.png', 'src/styles.css'];
      const nonhashableAssets = ['src/index.html'];

      await Promise.all([
        ...hashableAssets.map(async asset =>
          this.emitFile({
            type: 'asset',
            source: await fsp.readFile(asset),
            name: basename(asset),
          }),
        ),
        ...nonhashableAssets.map(async asset =>
          this.emitFile({
            type: 'asset',
            source: await fsp.readFile(asset),
            fileName: basename(asset),
          }),
        ),
      ]);
    },
  };
}
