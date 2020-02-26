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
/// <reference path="../missing-types.d.ts" />

declare module 'client-bundle:*' {
  const value: string;
  export default value;
  export const imports: string[];
}

declare module 'css:*' {
  const value: string;
  export default value;
  export const inline: string;
}

declare module 'test-data:' {
  const value: Tests;
  export default value;
}

declare module 'consts:config' {
  const value: {
    testSubjects: string[];
    githubRepository: string;
    pageDesc: string;
  };
  export default value;
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
}

type TestResults = Record<TestResultKey, TestResult>;
type TestResultKey = 'rollup' | 'webpack' | 'parcel' | 'gulp';

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
}
