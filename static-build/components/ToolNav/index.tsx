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
import { $toolNav, $tool, $toolNavInner, $toolNavContent } from './styles.css';
import { $contentContainer } from 'static-build/shared/styles/sizing.css';
import config from 'consts:config';
import * as toolImages from 'shared/utils/tool-images';
import * as toolHomepages from 'shared/utils/tool-homepages';

function ToolNav() {
  return (
    <div class={$toolNav}>
      <div class={`${$contentContainer} ${$toolNavContent}`}>
        <div class={$toolNavInner}>
          {config.testSubjects.map(tool => (
            <figure class={$tool}>
              <img
                height="40"
                width="40"
                src={toolImages[tool]}
                alt={`${tool} logo`}
              />
              <figcaption>
                <a href={toolHomepages[tool]} rel="noopener" target="_blank">
                  {tool}
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ToolNav;
