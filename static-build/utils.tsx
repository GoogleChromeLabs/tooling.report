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
import { h, JSX } from 'preact';

import { promises as fsp } from 'fs';
import { join as joinPath } from 'path';

import render from 'preact-render-to-string';
import { VNode } from 'preact';

import config from 'consts:config';

export function githubLink(filePath: string, ref: string = 'master') {
  return joinPath(config.githubRepository, 'tree', ref, filePath);
}

export function renderPage(vnode: VNode) {
  return '<!DOCTYPE html>' + render(vnode);
}

interface OutputMap {
  [path: string]: string;
}

export function writeFiles(toOutput: OutputMap) {
  Promise.all(
    Object.entries(toOutput).map(async ([path, content]) => {
      const pathParts = ['.tmp', 'build', 'static', ...path.split('/')];
      await fsp.mkdir(joinPath(...pathParts.slice(0, -1)), { recursive: true });
      const fullPath = joinPath(...pathParts);
      try {
        await fsp.writeFile(fullPath, content, {
          encoding: 'utf8',
        });
      } catch (err) {
        console.error('Failed to write ' + fullPath);
        throw err;
      }
    }),
  ).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

export function calculateScore(
  test: Test,
  tool: BuildTool,
): { score: number; possible: number } {
  let score = 0;
  let possible = 1;
  if (test.results[tool]) {
    switch (test.results[tool].meta.result) {
      case 'pass':
        score = 1;
        break;
      case 'partial':
        score = 0.5;
        break;
      // All other values are value = 0;
    }
  }
  if (typeof test.meta.importance !== 'number') {
    console.warn(
      `No valid \`importance\` defined for "${test.meta.title}". Setting to 0`,
    );
    test.meta.importance = 0;
  }
  score *= test.meta.importance;
  possible *= test.meta.importance;
  if (test.subTests) {
    for (const subtest of Object.values(test.subTests)) {
      const subtestScore = calculateScore(subtest, tool);
      score += subtestScore.score;
      possible += subtestScore.possible;
    }
  }
  return { score, possible };
}

export function calculateScoreTotals(tests: Tests): ToolSummary[] {
  const tools = Object.values(tests).reduce(collectBuildTools, []);

  return tools.map(tool => {
    return Object.values(tests).reduce(
      (score, test) => {
        let sub_score = calculateScore(test, tool);

        score.total += sub_score.score;
        score.possible += sub_score.possible;

        return score;
      },
      {
        tool,
        total: 0,
        possible: 0,
      },
    );
  });
}

const collectBuildTools = (tools: [], test: Test): [] => {
  if (test.results) {
    // for each key (tool) in results, check if we've noticed it
    Object.keys(test.results).forEach(toolkey => {
      if (!tools.includes(toolkey as never)) {
        tools.push(toolkey as never);
      }
    });
  }

  if (test.subTests) {
    // crawl
    Object.values(test.subTests).forEach(subtest => {
      return collectBuildTools(tools, subtest);
    });
  }

  return tools;
};

export function renderIssueLinksForTest(test: Test, tool: BuildTool) {
  const result = test.results[tool];
  if (!result) {
    return;
  }
  let issues = result.meta.issue;
  if (!issues) {
    return;
  }
  if (!Array.isArray(issues)) {
    issues = [issues];
  }
  // TODO: Would be nice to grab the issue titles and stuff
  // https://github.com/GoogleChromeLabs/tooling.report/issues/34
  return (
    <ul class="issues">
      {issues.map(issue => (
        <li>
          <a href={issue}>Issue</a>
        </li>
      ))}
    </ul>
  );
}
