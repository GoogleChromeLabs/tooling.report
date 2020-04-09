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
import Cache from 'async-disk-cache';

import * as config from '../config.js';

const ghCache = new Cache('ghCache');
const updateCache = !!process.env.UPDATE_CACHE;

const validResults = new Set(['pass', 'fail', 'partial']);
export default async function processMarkdownData(id, data, rollupContext) {
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
  const hasIssueAttached = 'issue' in data && data.issue.length > 0;
  if (isTestResultFile && !('result' in data)) {
    throw Error(`Result is missing in ${id}`);
  }
  if (isTestResultFile && !hasIssueAttached && data.result !== 'pass') {
    rollupContext.warn(`Non-passing test ${id} does not have issues attached.`);
  }

  if (isTestResultFile && hasIssueAttached) {
    await augmentGitHubIssueData(id, data);
    const hasUnexpectedlyClosedIssues = data.issue.some(
      issue =>
        issue.status === 'open' &&
        issue.githubData &&
        (issue.githubData.status === 'closed' ||
          issue.githubData.status === 'merged'),
    );
    if (hasUnexpectedlyClosedIssues) {
      rollupContext.warn(
        `${id} is linking to a closed issue or a merged PR. Please review the test.`,
      );
    }
  }
}

async function getGithubDataForIssue(url) {
  if (!updateCache && (await ghCache.has(url))) {
    const { value } = await ghCache.get(url);
    return JSON.parse(value);
  }
  const [, repo, type, id] = url.match(/([^/]+\/[^/]+)\/(issue|pull)s?\/(\d+)/i) || [];
  const res = await fetch(`https://api.github.com/repos/${repo}/${type}s/${id}`);
  const { title, state: status } = await res.json();
  const githubData = {
    title,
    status,
  };
  await ghCache.set(url, JSON.stringify(githubData));
  return githubData;
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
