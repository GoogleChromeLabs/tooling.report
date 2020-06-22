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
import { h } from 'preact';

import { renderPage, writeFiles } from './utils';
import IndexPage from './pages/index';
import TestPage from './pages/test';
import AboutPage from './pages/about';
import FAQPage from './pages/faqs';
import testData from 'test-data:';

interface Output {
  [outputPath: string]: string;
}
const toOutput: Output = {
  'index.html': renderPage(<IndexPage tests={testData} />),
  'about/index.html': renderPage(<AboutPage />),
  'faqs/index.html': renderPage(<FAQPage />),
};

function addTestPages(tests: Tests, basePath = '') {
  for (const [testPath, test] of Object.entries(tests)) {
    const testBasePath = basePath + testPath + '/';
    toOutput[testBasePath + 'index.html'] = renderPage(
      <TestPage test={test} />,
    );

    if (test.subTests) addTestPages(test.subTests, testBasePath);
  }
}

addTestPages(testData);
writeFiles(toOutput);
