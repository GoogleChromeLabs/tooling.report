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
const path = require('path');
const fs = require('fs');
const staticModule = require('static-module');
const { Readable } = require('stream');

module.exports = function(file, opts) {
  return staticModule({
    'custom-type': {
      create(customFilePath) {
        const readable = new Readable();
        readable._read = () => {};
        const filePath = path.resolve(path.dirname(file), customFilePath);
        console.log(filePath);

        fs.promises
          .readFile(filePath)
          .then(source => {
            const base64Str = JSON.stringify(source.toString('base64'));
            const helperPath = path.relative(
              path.dirname(file),
              path.join(__dirname, 'helpers.js'),
            );
            readable.push(
              [
                `(() => {`,
                `  const helpers = require('${helperPath}');`,
                `  return new CustomType(helpers.base64ToBuffer(${base64Str}));`,
                `})()`,
              ].join('\n'),
            );
            readable.push(null);
          })
          .catch(err => {
            readable.destroy(err);
          });

        return readable;
      },
    },
  });
};
