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
import { h, FunctionalComponent, JSX } from 'preact';

import cssPath from 'css:./styles.css';
import bundleURL, { imports } from 'client-bundle:client/home/index.ts';

interface Props {
  tests: Tests;
}

function renderTest(test: Test, basePath: string): JSX.Element {
  let results: JSX.Element[] | undefined;

  if (test.results) {
    results = Object.entries(test.results).map(([subject, result]) => (
      <li>
        {subject}:{' '}
        {result.meta.result === 'pass'
          ? 'Pass'
          : result.meta.result === 'fail'
          ? 'Fail'
          : 'So-so'}
      </li>
    ));
  }

  return (
    <article>
      <div>
        <a href={basePath}>
          <h3>{test.meta.title}</h3>
        </a>
      </div>
      {results && <ul>{results}</ul>}
      {test.subTests && (
        <section>{renderTests(test.subTests, basePath)}</section>
      )}
    </article>
  );
}

function renderTests(tests: Tests, basePath = '/'): JSX.Element[] {
  return Object.entries(tests).map(([testDir, test]) =>
    renderTest(test, `${basePath}${testDir}/`),
  );
}

const IndexPage: FunctionalComponent<Props> = ({ tests }: Props) => {
  return (
    <html>
      <head>
        <title>Tooling.Report</title>
        <meta
          name="description"
          content="Measuring Buildtools for your convenience"
        />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* TODO: favicon */}
        <link rel="stylesheet" href={cssPath} />
        <script type="module" src={bundleURL} />
        {imports.map(v => (
          <link rel="preload" as="script" href={v} crossOrigin="" />
        ))}
      </head>
      <body>
        <header>
          <h1>tooling.report</h1>
        </header>
        <main>{renderTests(tests)}</main>
      </body>
    </html>
  );
};

export default IndexPage;
