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

import { sep } from 'path';

import { JSDOM } from 'jsdom';

import * as config from '../config.js';

const validResults = new Set(['pass', 'fail', 'partial']);
export default async function validateMarkdownData(id, data) {
  if (!id.startsWith('tests/')) return;

  if ('result' in data && !validResults.has(data.result)) {
    throw Error(
      `Result must be one of ${[...validResults].join(', ')}. Found "${
        data.result
      }" in ${id}`,
    );
  }
  if (typeof data.issue === 'string') {
    data.issue = [data.issue];
  }
  const hasIssueAttached = 'issue' in data && data.issue.length > 0;
  if (!hasIssueAttached && data.result !== 'pass') {
    this.warn(`Non-passing test ${id} does not have issues attached.`);
  }

  const isTestResultFile = config.testSubjects.includes(
    id.split(sep).slice(-2, -1)[0],
  );
  if (isTestResultFile) {
    await augmentGitHubIssueData(data);
  }
}

async function augmentGitHubIssueData(data) {
  const hasIssueAttached = 'issue' in data && data.issue.length > 0;
  if (!hasIssueAttached) {
    return;
  }
  data.issue = await Promise.all(
    data.issue.map(async issue => {
      const { window } = await JSDOM.fromURL(issue);
      const title = window.document
        .querySelector('.js-issue-title')
        .textContent.trim();
      const status = window.document.querySelector('.State').textContent.trim();
      return {
        title,
        status,
        issue,
      };
    }),
  );
}
