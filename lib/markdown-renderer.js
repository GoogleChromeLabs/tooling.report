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
import { Renderer } from 'marked';
import { escape } from 'marked/src/helpers';
import Prism from 'prismjs';
import 'prismjs/components/prism-shell-session';

export function createRenderer() {
  const renderer = new Renderer();
  renderer.code = (code, infostring) => {
    // Aliasing sh, as that's common on github
    if (infostring === 'sh') {
      infostring = 'shell-session';
    }

    if (!infostring) {
      return `
        <pre class="language-text"><code class="language-text">${escape(
          code,
        )}</code></pre>`;
    }

    if (!(infostring in Prism.languages)) {
      throw Error(`Unsupported language "${infostring}"`);
    }

    return `
      <pre class="language-${infostring}"><code class="language-${infostring}">${Prism.highlight(
      code,
      Prism.languages[infostring],
      infostring,
    )}</code></pre>
    `;
  };
  return renderer;
}
