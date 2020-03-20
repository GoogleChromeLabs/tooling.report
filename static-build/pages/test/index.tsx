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

import { h, FunctionalComponent } from 'preact';
import sharedStyles from 'css-bundle:static-build/shared/styles/index.css';
import { githubLink } from '../../utils.js';
import pageStyles from 'css-bundle:./styles.css';
import Footer from '../../components/Footer/index';

interface Props {
  test: Test;
}

const TestPage: FunctionalComponent<Props> = ({ test }: Props) => {
  return (
    <html>
      <head>
        <title>Buildoff</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={sharedStyles} />
        <link rel="stylesheet" href={pageStyles} />
        {/* TODO: favicon */}
      </head>
      <body>
        <main>
          <h1>{test.meta.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: test.html }}></div>
          {test.results && (
            <section>
              {Object.entries(test.results).map(([subject, result]) => (
                <div>
                  <h1>
                    {subject}:{' '}
                    {result.meta.result === 'pass'
                      ? 'Pass'
                      : result.meta.result === 'fail'
                      ? 'Fail'
                      : 'So-so'}
                  </h1>
                  <div dangerouslySetInnerHTML={{ __html: result.html }}></div>
                  <a href={githubLink(result.repositoryPath)}>
                    Inspect the test
                  </a>
                </div>
              ))}
            </section>
          )}
          {test.subTests && (
            <section>
              <h1>Sub tests:</h1>
              <ul>
                {Object.entries(test.subTests).map(([path, test]) => (
                  <li>
                    <a href={path + '/'}>{test.meta.title}</a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
        <Footer />
      </body>
    </html>
  );
};

export default TestPage;
