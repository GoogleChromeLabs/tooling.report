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

import * as config from '../config.js';
import {
  getGithubDataForIssue,
  getContributorsForPath,
} from './github-data.js';

const validResults = new Set(['pass', 'fail', 'partial']);

export default async function markdownProcessor(
  id,
  data,
  content,
  rollupContext,
) {
  if (!id.startsWith('tests/')) return;

  if ('result' in data && !validResults.has(data.result)) {
    throw Error(
      `Result must be one of ${[...validResults].join(', ')}. Found "${
        data.result
      }" in ${id}`,
    );
  }

  if (typeof data.issue === 'string') {
    data.issue = [
      {
        url: data.issue,
      },
    ];
  }

  // If the folder name before `index.md` is one of our test subjects,
  // then this is a test result file.
  const isTestResultFile = config.testSubjects.includes(
    id.split(sep).slice(-2, -1)[0],
  );

  if (isTestResultFile) {
    // Contributor data is for the entire test directory, not just its markdown
    const testDir = id.replace(/\/index\.md$/, '');
    try {
      data.contributors = await getContributorsForPath(testDir);
    } catch (e) {
      console.log(
        `Failed to get contributor data for ${testDir}:\n  ${e.message}`,
      );
    }
  }

  const hasIssueAttached = 'issue' in data && data.issue.length > 0;

  if (isTestResultFile && !('result' in data)) {
    throw Error(`Result is missing: ${id}`);
  }

  if (!isTestResultFile && !('shortDesc' in data)) {
    rollupContext.warn(`Missing shortDesc: ${id}`);
  }

  if (isTestResultFile && content.trim() === '') {
    rollupContext.warn(`Lack of content: ${id}`);
  }

  if (isTestResultFile && !hasIssueAttached && data.result !== 'pass') {
    rollupContext.warn(`Non-passing test with missing issues: ${id}`);
  }

  if (isTestResultFile && hasIssueAttached) {
    await augmentGitHubIssueData(id, data);
    const missingGithubData = data.issue.some(
      issue => issue.status === 'open' && !issue.githubData,
    );
    if (missingGithubData) {
      console.log(data.issue);
      rollupContext.warn(`Missing GitHub data for issue: ${id}`);
    }
    const hasUnexpectedlyClosedIssues = data.issue.some(
      issue =>
        issue.status === 'open' &&
        issue.githubData &&
        (issue.githubData.status === 'closed' ||
          issue.githubData.status === 'merged'),
    );
    if (hasUnexpectedlyClosedIssues) {
      rollupContext.warn(`Failing test links only to closed issues: ${id}`);
    }
  }
}

async function augmentGitHubIssueData(id, data) {
  const hasIssueAttached = 'issue' in data && data.issue.length > 0;
  if (!hasIssueAttached) {
    return;
  }
  data.issue = await Promise.all(
    data.issue.map(async data => {
      if (typeof data === 'string') {
        data = {
          url: data,
        };
      }
      if (!('status' in data)) {
        data.status = 'open';
      }
      try {
        const githubData = await getGithubDataForIssue(data.url);
        return {
          githubData,
          ...data,
        };
      } catch (e) {
        return data;
      }
    }),
  );
}
