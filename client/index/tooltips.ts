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

const toolTipEvent = (event: MouseEvent) => {
  const dotContainer = (event.target as HTMLElement).closest(
    '.' + $dotContainer,
  );
  if (!dotContainer) return;

  const dotTrigger = event.target as HTMLElement;
  dotTrigger.focus();

  const tooltip = dotContainer.querySelector('.' + $tooltip) as HTMLElement;
  const gapOffset = 16;

  const bounds = tooltip.getBoundingClientRect();
  const leftOffset = bounds.width - (window.outerWidth - bounds.x);
  console.log(bounds, leftOffset);

  if (leftOffset >= gapOffset) {
    tooltip.style.left = `-${leftOffset + gapOffset}px`;
  }
};

for (const dataGrid of dataGrids) {
  dataGrid.addEventListener('mousedown', toolTipEvent, { capture: true });
  dataGrid.addEventListener('click', toolTipEvent, { capture: true });
}
