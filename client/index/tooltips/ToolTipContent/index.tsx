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
import { h, Component, createRef } from 'preact';
import {
  $tooltip,
  $toolBadge,
  $headerBar,
  $headerMeta,
  $details,
  $toolIcon,
  $toolTipArrow,
} from './styles.css';
import * as toolImages from 'shared/utils/tool-images';

interface Props {
  content: string;
  id: string;
  result: string;
  name: string;
  tool: BuildTool;
  link: string;
  category?: string;
}

export default class TooltipContent extends Component<Props> {
  private _arrowRef = createRef();

  componentDidMount() {
    const tooltip = this.base as HTMLElement;
    const tooltipArrow = this._arrowRef.current!;
    const gapOffset = 16;
    const bounds = tooltip.getBoundingClientRect();
    const innerWidth = window.innerWidth;

    if (bounds.right + gapOffset > innerWidth) {
      const leftOffset = bounds.right - innerWidth + gapOffset;
      tooltip.style.left = `${leftOffset * -1}px`;
      tooltipArrow.style.left = `${leftOffset}px`;
    }
  }
  render({ content, id, result, name, tool, link, category }: Props) {
    return (
      <div role="tooltip" id={id} class={$tooltip}>
        <div class={$headerBar}>
          <div class={$headerMeta}>
            <figure class={$toolIcon}>
              <img src={toolImages[tool]} />
            </figure>
            <span>
              {category && <small>{category}</small>}
              <h2>{name}</h2>
            </span>
          </div>
          <div data-result={result} class={$toolBadge}>
            {result}
          </div>
        </div>
        <div className={$details}>
          {content && <p>{content}</p>}
          <a href={link}>Learn More</a>
        </div>
        <div class={$toolTipArrow} ref={this._arrowRef}></div>
      </div>
    );
  }
}
