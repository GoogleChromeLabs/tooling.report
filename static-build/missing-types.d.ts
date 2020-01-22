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

type TestResultKey = 'rollup' | 'webpack' | 'parcel' | 'gulp';

interface TestMeta {
  title: string;
}

interface ResultMeta {
  result: number;
}

interface Test {
  meta: TestMeta;
  html: string;
  subTests?: Tests;
  results: TestResults;
}

interface Tests {
  [testName: string]: Test;
}

interface TestResult {
  meta: ResultMeta;
  html: string;
}

type TestResults = Record<TestResultKey, TestResult>;

declare module 'test-data:' {
  const value: Tests;
  export default value;
}
