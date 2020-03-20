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

const preloadMap = new Map([
  [/\.(ttf|otf|woff|woff2)$/, 'font'],
  [/\.(js|mjs)$/, 'script'],
  [/\.(css)$/, 'style'],
  [/\.(jpg|jpeg|gif|png|webm)$/, 'image'],
]);

function getPreloadAs(fileName) {
  for (const [re, type] of preloadMap) {
    if (re.test(fileName)) return type;
  }
  return 'fetch';
}

function getCrossOrigin(fileName, type) {
  return type === 'font';
}

export default function htmlPlugin({ crossOrigin = getCrossOrigin } = {}) {
  return {
    name: 'html',
    async generateBundle(_, bundle) {
      const preloads = Object.values(bundle)
        .filter(item => item.type === 'asset')
        .map(item => {
          const as = getPreloadAs(item.fileName);
          return `<link rel="preload" href=${JSON.stringify(
            item.fileName,
          )} as=${JSON.stringify(as)} ${
            crossOrigin(item.fileName, as) ? 'crossorigin' : ''
          } />`;
        });
      this.emitFile({
        type: 'asset',
        fileName: 'index.html',
        source: [
          '<!DOCTYPE html>',
          ...preloads,
          '<script type="module" src="index.js"></script>',
        ].join('\n'),
      });
    },
  };
}
