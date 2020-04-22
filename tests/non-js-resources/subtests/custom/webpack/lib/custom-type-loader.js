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
const { stringifyRequest } = require('loader-utils');

module.exports = function(content) {
  // convert the binary data to Base64:
  const base64 = content.toString('base64');

  // Essentially JSON.stringify(path), but converts the path to be project-relative:
  const helpers = stringifyRequest(this, require.resolve('./helpers'));

  return `
    import { CustomType, base64ToBuffer } from ${helpers};
    export default new CustomType(base64ToBuffer("${base64}"));
  `;
};

// skip parsing
module.exports.raw = true;
