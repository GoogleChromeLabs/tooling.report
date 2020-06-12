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
import config from 'consts:config';
import { githubLink, renderIssueLinksForTest } from '../../utils.js';
import pageStyles from 'css-bundle:./styles.css';
import bundleURL, { imports } from 'client-bundle:client/test/index.ts';
import analyticsBundleURL from 'client-bundle:client/analytics/index.js';
import HeadMeta from '../../components/HeadMeta';
import Logo from '../../components/Logo';
import { GithubIcon } from '../../components/Icons/';
import Footer from '../../components/Footer';
import HeaderLinkList from '../../components/HeaderLinkList';
import TestCrumbs from '../../components/TestCrumbs';
import TestCard from '../../components/TestCard';
import TestResultSnippet from '../../components/TestResultSnippet';
import { LabcoatHero, WalkerHero } from '../../components/Heroes';
import {
  $result,
  $resultSummary,
  $resultsCard,
  $results,
  $testResultList,
  $detailPage,
  $explainerPost,
  $subjectName,
  $gitHubIconPlaceholder,
  $gitHubIcon,
  $resultSummaryInner,
  $subjectContainer,
} from './detail.css';
import {
  $collectionPage,
  $contribCard,
  $testCardList,
  $collectionSummary,
} from './collection.css';
import { $well } from '../../shared/styles/well.css';
import { $heroImage, $heroText } from './styles.css';
import Connect from 'static-build/components/Connect/index.js';
import Dot from 'shared/components/Dot/index.js';

interface Props {
  test: Test;
}

const TestPage: FunctionalComponent<Props> = ({ test }: Props) => {
  return (
    <html lang="en">
      <head>
        <title>{`${test.meta.title}`}</title>
        <meta name="description" content={test.meta.shortDesc} />
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
                <p>{test.meta.shortDesc}</p>
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
            <section class={$collectionSummary}>
              <h3>Why</h3>
              <article
                dangerouslySetInnerHTML={{ __html: test.html }}
              ></article>
              <p class={$well}>
                Use the (+) card below & tell us if we missed a capability!
              </p>
            </section>

            <section>
              <ul class={$testCardList}>
                {Object.entries(test.subTests).map(([path, test]) => (
                  <TestCard link={path + '/'} test={test} />
                ))}
                <li>
                  <a class={$contribCard} href={config.githubContribute}>
                    +
                  </a>
                </li>
              </ul>
            </section>

            <Connect />
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
              <article
                dangerouslySetInnerHTML={{ __html: test.html }}
              ></article>
            </section>

            <section>
              <h1>Conclusion</h1>
              <article>
                {Object.entries(test.results).map(([subject, result]) => {
                  const summaryInner = (
                    <div class={$resultSummaryInner}>
                      <div class={$subjectContainer}>
                        <span class={$subjectName}>{subject}</span>
                        <Dot result={result.meta.result} />
                      </div>
                      <div class={$gitHubIconPlaceholder} />
                    </div>
                  );

                  return (
                    <div class={$result}>
                      {result.html || result.meta.issue ? (
                        <details id={subject}>
                          <summary class={$resultSummary}>
                            {summaryInner}
                          </summary>
                          <div class={$resultsCard}>
                            <div
                              class={$results}
                              dangerouslySetInnerHTML={{
                                __html: result.html || 'NO',
                              }}
                            ></div>
                            {renderIssueLinksForTest(
                              test,
                              subject as BuildTool,
                            )}
                          </div>
                        </details>
                      ) : (
                        <div class={$resultSummary}>{summaryInner}</div>
                      )}
                      {/* This needs to sit outside the <summary>, as links inside <summary> aren't clickable */}
                      <a
                        href={githubLink(result.repositoryPath)}
                        class={$gitHubIcon}
                      >
                        <GithubIcon />
                      </a>
                    </div>
                  );
                })}
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
