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
import { $tooltip } from 'shared/components/ToolTip/styles.css';

const dataGrids = document.querySelectorAll('.' + $datagrid) as NodeListOf<
  HTMLElement
>;

function focusClosest(el: HTMLElement): void {
  const focusable = el.closest('button, [tabindex]') as HTMLElement | null;
  if (focusable) {
    focusable.focus();
    //requestAnimationFrame(() => focusable.focus());
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
    focusClosest(event.target as HTMLElement);
  }
}

function tooltipFocus(event: Event): void {
  const target = event.target as HTMLElement;
  const dotContainer = target.closest('.' + $dotContainer);
  if (!dotContainer) return;

  const tooltip = dotContainer.querySelector('.' + $tooltip) as HTMLElement;
  const gapOffset = 16;

  const bounds = tooltip.getBoundingClientRect();
  const leftOffset = bounds.width - (window.innerWidth - bounds.x);

  if (leftOffset >= gapOffset) {
    tooltip.style.left = `-${leftOffset + gapOffset}px`;
  }
}

for (const dataGrid of dataGrids) {
  dataGrid.addEventListener('focus', tooltipFocus, { capture: true });
  dataGrid.addEventListener('pointerdown', pointerDown);
  dataGrid.addEventListener('pointerup', pointerUp);
}
