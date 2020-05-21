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
import {
  $datagrid,
  $dotContainer,
} from 'shared/components/DataGrid/styles.css';
import { $tooltip, $toolTipArrow } from 'shared/components/ToolTip/styles.css';

const dataGrids = document.querySelectorAll('.' + $datagrid) as NodeListOf<
  HTMLElement
>;

function focusClosest(el: HTMLElement): void {
  const focusable = el.closest('button, [tabindex]') as HTMLElement | null;
  if (focusable) {
    // This needs to be wrapped in raf to get back the default browser action.
    requestAnimationFrame(() => focusable.focus());
  }
}

// Safari & Firefox don't focus on click, so we do that ourselves.
function pointerDown(event: PointerEvent): void {
  // We only focus on pointerdown for mouse devices
  if (event.pointerType === 'mouse') {
    focusClosest(event.target as HTMLElement);
  }
}

function pointerUp(event: PointerEvent): void {
  // Whereas for touch, we only want to hear about pointer ups that
  // weren't cancelled (as in, scrolling didn't happen)
  if (event.pointerType !== 'mouse') {
    event.preventDefault();
    focusClosest(event.target as HTMLElement);
  }
}

function tooltipFocus(event: Event): void {
  const target = event.target as HTMLElement;
  const dotContainer = target.closest('.' + $dotContainer);
  if (!dotContainer) return;

  const tooltip = dotContainer.querySelector('.' + $tooltip) as HTMLElement;
  const tooltipArrow = dotContainer.querySelector(
    '.' + $toolTipArrow,
  ) as HTMLElement;
  const gapOffset = 16;

  tooltip.style.left = '0';

  const bounds = tooltip.getBoundingClientRect();
  const innerWidth = window.innerWidth;
  console.log(innerWidth, bounds);

  if (bounds.right + gapOffset > innerWidth) {
    const leftOffset = bounds.right - innerWidth + gapOffset;
    tooltip.style.left = `${leftOffset * -1}px`;

    // In a previous build the tooltip arrow sat outside the tooltip so this wasn't necessary.
    // However, in Safari stable, the use of focus-within caused like a 500ms delay to
    // tooltips appearing. It's fixed in TP, so in future, we can move the arrow back
    // outside the tooltip.
    tooltipArrow.style.left = `${leftOffset}px`;
  }
}

for (const dataGrid of dataGrids) {
  dataGrid.addEventListener('focus', tooltipFocus, { capture: true });
  dataGrid.addEventListener('pointerdown', pointerDown);
  dataGrid.addEventListener('pointerup', pointerUp);
}
