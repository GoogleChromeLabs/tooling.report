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
/// <reference path="./web-components.d.ts" />

declare module 'asset-url:*' {
  const value: string;
  export default value;
}

declare module 'css-bundle:*' {
  const url: string;
  export default url;
  export const inline: string;
}

interface Tests {
  [testName: string]: Test;
}

interface Test {
  /** Front-matter data from the index.md in the test. */
  meta: TestMeta;
  /** HTML from the index.md in the test. */
  html: string;
  subTests?: Tests;
  results: TestResults;
}

interface TestMeta {
  title: string;
  shortDesc: string;
}

type TestResults = Record<BuildTool, TestResult>;
type BuildTool = 'rollup' | 'webpack' | 'parcel' | 'browserify';

interface TestResult {
  /** Front-matter data from the result markdown file */
  meta: ResultMeta;
  /** HTML from the result markdown file */
  html: string;
  /** Path to the test project in the repository */
  repositoryPath: string;
}

interface ResultMeta {
  result: 'pass' | 'fail' | 'partial';
  issue?: Array<{
    status: 'open' | 'closed';
    url: string;
    fixedSince?: string;
    githubData?: {
      status: string;
      title: string;
    };
  }>;
}

declare module 'consts:config' {
  const value: {
    testSubjects: BuildTool[];
    githubRepository: string;
    githubContribute: string;
    buildDate: string;
    githubDefaultBranch: string;
    origin: string;
  };
  export default value;
}
interface PaginationData {
  link: string;
  meta: TestMeta;
}
