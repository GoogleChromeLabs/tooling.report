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
import { h, FunctionalComponent } from 'preact';
import { $resultItem, $toolIcon, $toolName, $toolBadge } from './styles.css';
import * as toolImages from 'shared/utils/tool-images';

interface Props {
  name: string;
  result: string;
}

const TestResultSnippet: FunctionalComponent<Props> = ({
  name,
  result,
}: Props) => {
  return (
    <li class={$resultItem}>
      <a href={`#${name}`} title={`Explain the ${result}`} class={$toolName}>
        {name}
      </a>
      <figure>
        <a href={`#${name}`} class={$toolIcon}>
          <img
            src={toolImages[name as BuildTool]}
            alt={`${name}`}
          />
        </a>
      </figure>
      <div data-result={result} class={$toolBadge}>
        {result}
      </div>
    </li>
  );
};

export default TestResultSnippet;
