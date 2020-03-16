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
import { testSubjects } from '../config';

const validResults = new Set(['pass', 'fail', 'partial']);
const resultIdEnds = testSubjects.map(t => `/${t}/index.md`);

export default function validateMarkdownData(id, data) {
  if (!id.startsWith('tests/')) return;
  if (!resultIdEnds.some(resultIdEnd => id.endsWith(resultIdEnd))) {
    return;
  }

  if (!('result' in data)) {
    this.warn(`Missing result data in ${id}`);
  }

  if ('result' in data && !validResults.has(data.result)) {
    throw Error(
      `Result must be one of ${[...validResults].join(', ')}. Found "${
        data.result
      }" in ${id}`,
    );
  }
  const hasIssueAttached = 'issue' in data && data.issue.length > 0;
  if (!hasIssueAttached && data.result !== 'pass') {
    this.warn(`Non-passing test ${id} does not have issues attached.`);
  }
}
