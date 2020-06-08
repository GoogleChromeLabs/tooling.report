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
import {
  $testCard,
  $cardTitle,
  $cardTotal,
  $cardTotalCount,
  $dash,
  $subText,
  $testDesc,
  $testCardIcon,
  $iconList,
  $subTestCard,
  $checkbox,
} from './styles.css';
import * as toolImages from 'shared/utils/tool-images';
import checkbox from 'asset-url:./checkbox.svg';

interface Props {
  link: string;
  test: Test;
}

const TestCard: FunctionalComponent<Props> = ({ link, test }: Props) => {
  const data = { totalScore: 0, passing: [] as any, partial: [] as any };

  const transformData = () => {
    (Object.entries(test.results) as [BuildTool, TestResult][]).forEach(
      (tool: [BuildTool, TestResult]) => {
        if (tool[1].meta.result === 'pass') {
          data.totalScore += 1;
          data.passing.push(tool[0]);
        } else if (tool[1].meta.result === 'partial') {
          data.totalScore += 0.5;
          data.partial.push(tool[0]);
        }
      },
    );
  };
  transformData();

  const totalTested = () => {
    return Object.entries(test.results).length;
  };

  const renderPassing = () => {
    if (test.subTests) {
      return (
        <li class={$subTestCard}>
          <a href={link}>
            <h3 class={$cardTitle}>{test.meta.title}</h3>
            {test.meta.shortDesc && (
              <p class={$testDesc}>{test.meta.shortDesc}</p>
            )}
            <div class={$cardTotal}>
              <span class={$cardTotalCount}>
                {Object.entries(test.subTests).length}
              </span>
            </div>
            <p class={$subText}>Sub Tests</p>
          </a>
        </li>
      );
    } else {
      return (
        <li class={$testCard}>
          <a href={link}>
            <span class={$checkbox} title="Marked as read">
              <svg viewBox="0 0 24 24">
                <path class="st0" d="M6 11.1l5.1 5.1L19 7.8" />
              </svg>
            </span>
            <h3 class={$cardTitle}>{test.meta.title}</h3>
            {test.meta.shortDesc && (
              <p class={$testDesc}>{test.meta.shortDesc}</p>
            )}
            <div class={$cardTotal}>
              <span>{data.totalScore}</span>
              <span class={$dash}>/</span>
              <span class={$cardTotalCount}>{totalTested()}</span>
            </div>
            <p class={$subText}>Bundlers Passing</p>
            <div class={$iconList}>
              {data.passing &&
                data.passing.map((tool: BuildTool) => (
                  <figure class={$testCardIcon} data-result="pass">
                    <img src={toolImages[tool]} />
                    <figcaption>{tool}</figcaption>
                  </figure>
                ))}
              {data.partial &&
                data.partial.map((tool: BuildTool) => (
                  <figure class={$testCardIcon} data-result="partial">
                    <img src={toolImages[tool]} />
                    <figcaption>{tool}</figcaption>
                  </figure>
                ))}
            </div>
          </a>
        </li>
      );
    }
  };

  return renderPassing();
};

export default TestCard;
