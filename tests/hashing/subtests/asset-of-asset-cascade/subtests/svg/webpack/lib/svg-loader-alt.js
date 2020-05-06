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
/**
 * Loads an SVG as a JavaScript module with its subresources as require()'s:
 * @example
 * {
 *   test: /\.svg$/,
 *   use: ['file-loader', 'extract-loader', './lib/svg-loader-alt']
 * }
 */
module.exports = function svgLoader(content) {
  this.cacheable(true);

  const pieces = [];
  const tokenizer = /(\shref=)(['"])(.*?)\2/g;
  let offset = 0;
  let match;
  while ((match = tokenizer.exec(content))) {
    const before = content.substring(offset, match.index + match[1].length + 1);
    pieces.push(JSON.stringify(before));
    // todo: entity decoding
    let resource = match[3];
    if (resource.indexOf('/') === -1) resource = './' + resource;
    pieces.push(`require(${JSON.stringify(resource)})`);
    offset = tokenizer.lastIndex - 1;
  }
  pieces.push(JSON.stringify(content.substring(offset)));

  return `module.exports = ${pieces.join('+')}`;
};
