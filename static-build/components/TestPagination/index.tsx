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
  $metaData,
  $prevLinkData,
  $nextLinkData,
  $nav,
  $svgLeft,
  $svgRight,
  $svgHolder,
  $container,
} from './styles.css';

interface Props {
  prevTest: PaginationData;
  nextTest: PaginationData;
}

const TestPagination: FunctionalComponent<Props> = ({
  prevTest,
  nextTest,
}: Props) => {
  return (
    <div class={$nav}>
      <div>
        <a href={prevTest.link}>
          <div class={$container}>
            <div class={$svgHolder}>
              <svg class={$svgLeft} viewBox="0 0 9 5">
                <path d="M4.6 2.7L9 0v2.1L4.7 5.3h-.2L0 2.1V0z" />
              </svg>
            </div>
            <div class={$prevLinkData}>
              <div>{prevTest.meta.title}</div>
              <div class={$metaData}>{prevTest.meta.shortDesc}</div>
            </div>
          </div>
        </a>
      </div>
      <div>
        {nextTest.link && (
          <a href={nextTest.link}>
            <div class={$container}>
              <div class={$nextLinkData}>
                <div>{nextTest.meta.title}</div>
                <div class={$metaData}>{nextTest.meta.shortDesc}</div>
              </div>
              <div class={$svgHolder}>
                <svg class={$svgRight} viewBox="0 0 9 5">
                  <path d="M4.6 2.7L9 0v2.1L4.7 5.3h-.2L0 2.1V0z" />
                </svg>
              </div>
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default TestPagination;
