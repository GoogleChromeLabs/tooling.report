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
import { githubLink, renderIssueLinksForTest } from '../../utils.js';
import pageStyles from 'css-bundle:./styles.css';
import bundleURL, { imports } from 'client-bundle:client/test/index.ts';
import analyticsBundleURL from 'client-bundle:client/analytics/index.js';
import HeadMeta from '../../components/HeadMeta';
import Logo from '../../components/Logo';
import Footer from '../../components/Footer';
import HeaderLinkList from '../../components/HeaderLinkList';
import TestCrumbs from '../../components/TestCrumbs';
import TestCard from '../../components/TestCard';
import TestResultSnippet from '../../components/TestResultSnippet';
import { LabcoatHero, WalkerHero } from '../../components/Heroes';
import {
  $resultSet,
  $resultCard,
  $results,
  $testResultList,
  $detailPage,
  $explainerPost,
} from './detail.css';
import { $collectionPage, $contribCard, $testCardList } from './collection.css';
import { $heroImage, $heroText } from './styles.css';

interface Props {
  test: Test;
}

const TestPage: FunctionalComponent<Props> = ({ test }: Props) => {
  return (
    <html lang="en">
      <head>
        <title>{`Tooling.Report: ${test.meta.title}`}</title>
        <meta name="description" content="Tests page" />
        <HeadMeta />
        <link rel="stylesheet" href={pageStyles} />
        <script type="module" src={bundleURL} />
        {imports.map(v => (
          <link rel="preload" as="script" href={v} crossOrigin="" />
        ))}
        <script type="module" async src={analyticsBundleURL}></script>
      </head>
      <body>
        <header>
          <section>
            <Logo />
            <TestCrumbs test={test} />
            <div>
              <div class={$heroText}>
                <small>feature</small>
                <h2>{test.meta.title}</h2>
                <p>TODO: use a description from front matter</p>
                <HeaderLinkList home={false} />
              </div>
              <div class={$heroImage}>
                {test.subTests ? <LabcoatHero /> : <WalkerHero />}
              </div>
            </div>
          </section>
        </header>

        {test.subTests && (
          <main class={$collectionPage}>
            <section>
              <h3>Capabilities & Verification</h3>
              <p>
                Below is a list of related features, capabilities and tests to{' '}
                {test.meta.title}. Each test has a detail page outlining the
                what, why and how of the test.
              </p>
            </section>

            <section>
              <ul class={$testCardList}>
                {Object.entries(test.subTests).map(([path, test]) => (
                  <TestCard link={path + '/'} test={test} />
                ))}
                <li>
                  <a
                    class={$contribCard}
                    href="https://github.com/GoogleChromeLabs/tooling.report/blob/master/CONTRIBUTING.md"
                  >
                    +
                  </a>
                </li>
              </ul>
            </section>
          </main>
        )}

        {!test.subTests && (
          <main class={$detailPage}>
            <ul class={$testResultList}>
              {Object.entries(test.results).map(([subject, result]) => (
                <TestResultSnippet name={subject} result={result.meta.result} />
              ))}
            </ul>

            <section class={$explainerPost}>
              <h1>The Test</h1>
              <article
                dangerouslySetInnerHTML={{ __html: test.html }}
              ></article>
            </section>

            <section class={$resultSet}>
              <h1>Conclusion</h1>
              <article>
                {Object.entries(test.results).map(([subject, result]) => (
                  <details>
                    <summary id={subject}>
                      <b>{subject}</b>:{' '}
                      {result.meta.result === 'pass'
                        ? 'pass'
                        : result.meta.result === 'fail'
                        ? 'fail'
                        : 'so-so'}
                      <a href={githubLink(result.repositoryPath)}>Source</a>
                    </summary>
                    <div class={$resultCard}>
                      <div
                        class={$results}
                        dangerouslySetInnerHTML={{ __html: result.html }}
                      ></div>
                      {renderIssueLinksForTest(test, subject as BuildTool)}
                    </div>
                  </details>
                ))}
              </article>
            </section>
          </main>
        )}
        <Footer />
      </body>
    </html>
  );
};

export default TestPage;
