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
import { h, render } from 'preact';
import TooltipContent from './ToolTipContent';

let shownTooltip: GridTooltip | undefined;

function focusChange(event: Event) {
  if (!shownTooltip) return;
  const target = event.target as HTMLElement;
  if (!('closest' in target)) return;
  if (target.closest('grid-tooltip') === shownTooltip) return;
  shownTooltip.hide();
}

document.addEventListener('click', focusChange);
document.addEventListener('focus', focusChange, { capture: true });

class GridTooltip extends HTMLElement {
  private _tooltipContent = document.createElement('div');

  private _renderContent() {
    if (shownTooltip !== this) {
      this._tooltipContent.textContent = '';
      return;
    }

    render(
      <TooltipContent
        content={this.getAttribute('content')!}
        category={this.getAttribute('category')!}
        result={this.getAttribute('result')!}
        name={this.getAttribute('testname')!}
        tool={this.getAttribute('tool') as BuildTool}
        link={this.getAttribute('href')!}
      />,
      this._tooltipContent,
    );
  }

  constructor() {
    super();
    this.addEventListener('click', () => this.show());
    this.addEventListener('mousedown', () => this.show());
  }

  connectedCallback() {
    if (!this.contains(this._tooltipContent)) {
      this.append(this._tooltipContent);
    }
  }

  show() {
    if (shownTooltip === this) return;
    if (shownTooltip) {
      shownTooltip.hide();
    }
    shownTooltip = this;
    this._renderContent();
  }

  hide() {
    if (shownTooltip !== this) return;
    shownTooltip = undefined;
    this._renderContent();
  }
}

customElements.define('grid-tooltip', GridTooltip);
