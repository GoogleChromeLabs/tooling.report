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
import { h } from 'preact';
import { $toolNav, $tool } from './styles.css';
import config from 'consts:config';
import * as toolImages from 'shared/utils/tool-images';

function ToolNav() {
  return (
    <div className={$toolNav}>
      {config.testSubjects.map(tool => (
        <figure class={$tool}>
          <img
            height="40"
            width="40"
            src={toolImages[tool]}
            alt={`${tool} logo`}
          />
          <figcaption>{tool}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default ToolNav;
