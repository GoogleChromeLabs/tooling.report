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
import Logo from '../../components/Logo/index';
import Footer from '../../components/Footer/index';
import LinkList from '../../components/LinkList/index';

interface Props {
  test: Test;
}

const TestPage: FunctionalComponent<Props> = ({ test }: Props) => {
  return (
    <html>
      <head>
        <title>Tooling.Report: {test.meta.title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={sharedStyles} />
        <link rel="stylesheet" href={pageStyles} />
        {/* TODO: favicon */}
      </head>
      <body>
        <header>
          <Logo />
          <section>
            <small>feature</small>
            <h2>{test.meta.title}</h2>
            <p>TODO: use a description from front matter</p>
            <LinkList
              links={[
                { title: 'FAQ', href: '#' },
                { title: 'Contribute', href: '#' },
                { title: 'Have an issue?', href: '#' },
              ]}
            />
          </section>
        </header>
        <main>
          {test.subTests && (
            <section>
              <h3>Capabilities & Verification</h3>
              <p>
                Below is a list of related features, capabilities and tests to{' '}
                {test.meta.title}. Each test has a detail page outlining the
                what, why and how of the test.
              </p>
            </section>
          )}

          {test.results && (
            <article>
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
              <div dangerouslySetInnerHTML={{ __html: test.html }}></div>
            </article>
          )}

          {test.subTests && (
            <section>
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
