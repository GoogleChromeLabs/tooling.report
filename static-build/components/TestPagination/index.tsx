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
  $lighter,
  $linkData1,
  $linkData2,
  $nav,
  $svgLeft,
  $svgRight,
  $svgHolder,
  $container,
} from './styles.css';
interface Props {
  prev: PaginationData;
  next: PaginationData;
}
const TestPagination: FunctionalComponent<Props> = ({ prev, next }: Props) => {
  return (
    <div class={$nav}>
      <div>
        {' '}
        <a href={prev.link}>
          <div class={$container}>
            <div class={$svgHolder}>
              <svg class={$svgLeft} viewBox="0 0 9 5">
                <path d="M4.6 2.7L9 0v2.1L4.7 5.3h-.2L0 2.1V0z" />
              </svg>
            </div>
            <div class={$linkData1}>
              <div>{prev.meta.title}</div>
              <div class={$lighter}>{prev.meta.shortDesc}</div>
            </div>
          </div>
        </a>
      </div>
      <div>
        <a href={next.link}>
          <div class={$container}>
            <div class={$linkData2}>
              <div>{next.meta.title}</div>
              <div class={$lighter}>{next.meta.shortDesc}</div>
            </div>
            <div class={$svgHolder}>
              <svg class={$svgRight} viewBox="0 0 9 5">
                <path d="M4.6 2.7L9 0v2.1L4.7 5.3h-.2L0 2.1V0z" />
              </svg>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default TestPagination;
