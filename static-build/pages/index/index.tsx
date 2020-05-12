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
import { calculateScoreTotals } from 'static-build/utils';
import pageStyles from 'css-bundle:./styles.css';
import {
  $sidebarLayout,
  $summaryList,
  $sectionHeader,
  $hero,
  $message,
  $heroImage,
  $overview,
  $well,
  $gettingStarted,
} from './styles.css';

import analyticsBundleURL from 'client-bundle:client/analytics/index.js';
import HeadMeta from '../../components/HeadMeta';
import Logo from '../../components/Logo';
import GithubFAB from '../../components/GithubFAB';
import Footer from '../../components/Footer';
import HeaderLinkList from '../../components/HeaderLinkList';
import { BenchHero } from '../../components/Heroes';
import SummaryCard from '../../components/SummaryCard';
import ToolNav from '../../components/ToolNav';
import DataGrid from '../../components/DataGrid';
import Legend from '../../components/DataGrid/Legend';
import Connect from '../../components/Connect';
import FirstParagraphOnly from 'static-build/components/FirstParagraphOnly';

import gulp from 'asset-url:../../img/gulp.svg';
import rollup from 'asset-url:../../img/rollup.svg';
import webpack from 'asset-url:../../img/webpack.svg';
import parcel from 'asset-url:../../img/parcel.svg';

import { html as README } from 'md:../../../README.md';

const toolImages = { gulp, rollup, webpack, parcel };

interface Props {
  tests: Tests;
}

function renderSummary(tests: Tests): JSX.Element {
  const tools = calculateScoreTotals(tests);

  return (
    <ul class={$summaryList}>
      {tools.map(t => (
        <SummaryCard
          name={t.tool}
          total={t.total}
          possible={t.possible}
          image={toolImages[t.tool]}
        />
      ))}
    </ul>
  );
}

const IndexPage: FunctionalComponent<Props> = ({ tests }: Props) => {
  return (
    <html lang="en">
      <head>
        <title>tooling.report</title>
        <meta name="description" content="TODO: site description" />
        <HeadMeta />
        <link rel="stylesheet" href={pageStyles} />
        <script type="module" async src={analyticsBundleURL}></script>
      </head>
      <body>
        <header class={$hero}>
          <section>
            <Logo />
            <div>
              <div class={$heroImage}>
                <BenchHero />
              </div>
              <div>
                <div>
                  <FirstParagraphOnly content={README} />
                </div>
                <HeaderLinkList home={true} />
              </div>
            </div>
          </section>
        </header>
        <main>
          <GithubFAB />

          <section id="getting-started">
            <div class={$sidebarLayout}>
              <aside></aside>
              <div class={$gettingStarted}>
                <h3>Getting Started</h3>
                <p>
                  This homepage shows the aggregated results from a bespoke
                  suite of build tool tests. We intend for the results and the
                  test build tool configurations to be transparent; to encourage
                  learning & growing.
                </p>
                <p>
                  <b>Each build tool had a hand written config file written!</b>{' '}
                  We worked with the build tool authors to ensure fair tests and
                  succinct configs.
                </p>
                <p class={$well}>
                  We highly encourage you to{' '}
                  <a href="https://github.com/GoogleChromeLabs/tooling.report/blob/master/CONTRIBUTING.md">
                    contribute
                  </a>{' '}
                  too!
                </p>
              </div>
            </div>
          </section>

          <section id="summary">
            <a href="#summary">
              <h3 class={$sectionHeader}>Summary</h3>
            </a>
            <div class={$sidebarLayout}>
              <aside>
                <small>
                  Not interested in the details, here's the current score
                </small>
              </aside>
              <div>{renderSummary(tests)}</div>
            </div>
          </section>

          <section id="data">
            <div class={$sidebarLayout}>
              <aside></aside>
              <div class={$gettingStarted}>
                <h3>Scroll n' Tell</h3>
                <p>
                  Below you'll get to see how your favorite tool, or new to be
                  favorite tool, is handling industry best practices for
                  bundling and delivering optimized web experiences.
                </p>
                <p>Each test is scored against the legend below:</p>
                <br />
                <Legend />
                <br />
                <p>You're ready. Keep calm and scroll on.</p>
              </div>
            </div>
          </section>

          <ToolNav />

          <section id="overview" class={$overview}>
            <a href="#overview">
              <h3 class={$sectionHeader}>Overview</h3>
            </a>
            <DataGrid tests={tests} basePath="/" />
          </section>

          {Object.entries(tests).map(([testDir, collection]) => (
            <section id={collection.meta.title}>
              <a href={testDir}>
                <h3 class={$sectionHeader}>{collection.meta.title}</h3>
              </a>
              <DataGrid tests={collection.subTests} basePath={`${testDir}/`} />
            </section>
          ))}
        </main>
        <Connect />
        <Footer />
      </body>
    </html>
  );
};

export default IndexPage;
