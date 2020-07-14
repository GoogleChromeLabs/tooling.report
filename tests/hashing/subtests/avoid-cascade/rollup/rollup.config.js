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
import assetPlugin from './lib/asset-plugin';
import importMapPlugin from './lib/import-map-plugin';

export default {
  input: ['src/index.js', 'src/profile.js'],
  output: {
    dir: 'build',
    format: 'system',
    chunkFileNames: '[name].js',
  },
  plugins: [
    assetPlugin(),
    importMapPlugin(),
    {
      generateBundle(outputOpts, bundle) {
        // Generate HTML
        for (const name of ['index', 'profile']) {
          this.emitFile({
            type: 'asset',
            fileName: name + '.html',
            source: `<!DOCTYPE html><h1>${name} page</h1>
  <script src="https://unpkg.com/systemjs@6.3.3/dist/s.min.js"></script>
  <script type="systemjs-importmap">${bundle['import-map.json'].source}</script>
  <script type="module">System.import('./${name}.js');</script>
  <ul>
  <li><a href="./">Index</a></li>
  <li><a href="profile.html">Profile</a></li>
  </ul>`,
          });
        }
      },
    },
  ],
};
