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
  $sectionHashtag,
  $sectionTitle,
  $hero,
  $overviewHeader,
  $overviewGrid,
  $heroImage,
  $overview,
  $consumeGap,
  $gettingStarted,
  $webdev,
} from './styles.css';
import { $well } from '../../shared/styles/well.css';

import bundleURL, { imports } from 'client-bundle:client/index/index.ts';
import analyticsBundleURL from 'client-bundle:client/analytics/index.js';
import HeadMeta from '../../components/HeadMeta';
import Logo from '../../components/Logo';
import GithubFAB from '../../components/GithubFAB';
import Footer from '../../components/Footer';
import HeaderLinkList from '../../components/HeaderLinkList';
import { BenchHero } from '../../components/Heroes';
import SummaryCard from '../../components/SummaryCard';
import ToolNav from '../../components/ToolNav';
import DataGrid from 'shared/components/DataGrid';
import Legend from 'shared/components/DataGrid/Legend';
import Connect from '../../components/Connect';
import FirstParagraphOnly from 'static-build/components/FirstParagraphOnly';
import * as toolImages from 'shared/utils/tool-images';
import { html as README } from 'md:../../../README.md';
import config from 'consts:config';
import webdevLogoURL from 'asset-url:../../img/webdev.svg';

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
  const scores = calculateScoreTotals(tests);
  const possible = scores[0].possible;

  return (
    <html lang="en">
      <head>
        <title>Home | Score Overview</title>
        <meta name="description" content={config.metaDescription} />
        <HeadMeta />
        <link rel="stylesheet" href={pageStyles} />
        <script type="module" src={bundleURL} />
        {imports.map(v => (
          <link rel="preload" as="script" href={v} crossOrigin="" />
        ))}
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
                <div class={$webdev}>
                  Brought to you by
                  <img src={webdevLogoURL} alt="web.dev" />
                </div>
              </div>
            </div>
          </section>
        </header>
        <main>
          <GithubFAB />

          <section id="getting-started">
            <div class={$sidebarLayout}>
              <div></div>
              <div class={$gettingStarted}>
                <h3>Getting Started</h3>
                <p>
                  This homepage shows the aggregated results from a bespoke
                  suite of build tool tests. A build tool test is a
                  configuration file created to specifically handle a feature.
                  We intend for the capability results and the configuration
                  files to be transparent; to encourage learning & growing
                  together.
                </p>
                <p>
                  Yes,{' '}
                  <b>
                    each of the {possible} feature tests have a hand written
                    config file!
                  </b>{' '}
                  We worked with the build tool authors to ensure fair tests and
                  succinct configuration. It's all in Github.
                </p>
                <p class={$well}>
                  We highly encourage you to{' '}
                  <a href={config.githubContribute}>contribute</a> too!
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
                  Current results as of <time>{config.buildDate}</time>{' '}
                </small>
              </aside>
              <div>{renderSummary(tests)}</div>
            </div>
          </section>

          <section id="data" class={$consumeGap}>
            <div class={$sidebarLayout}>
              <div></div>
              <div class={$gettingStarted}>
                <h3>Information</h3>
                <p>
                  Below you'll get to see how your favorite, or new to be
                  favorite, tool is handling our industry best practice test
                  suite.
                </p>
                <p class={$well}>Each tool scores as follows:</p>
                <Legend />
                <h4>The Tools</h4>
                <p>
                  We chose browserify, parcel, rollup & webpack first out of
                  popularity; to cover the most surface area. We are actively
                  aggregating feedback for the next set of tools and tests.
                </p>
              </div>
            </div>
          </section>

          <ToolNav />

          <section class={`${$overview} ${$overviewGrid}`}>
            <a href="#overview">
              <h2 id="overview" class={`${$overviewHeader} ${$sectionHeader}`}>
                <span class={$sectionHashtag}>#</span>
                Overview
              </h2>
            </a>
            <DataGrid tests={tests} basePath="/" collectionTitle="Overview" />
          </section>

          {Object.entries(tests).map(([testDir, collection]) => {
            const sectionId = collection.meta.title
              .replace(/\s/g, '-')
              .toLowerCase();

            return (
              <section>
                <h3 class={$sectionHeader} id={sectionId}>
                  <a class={$sectionHashtag} href={`#${sectionId}`}>
                    #
                  </a>
                  <a class={$sectionTitle} href={`${testDir}/`}>
                    {collection.meta.title}
                  </a>
                </h3>
                <DataGrid
                  tests={collection.subTests}
                  basePath={`${testDir}/`}
                  collectionTitle={collection.meta.title}
                />
              </section>
            );
          })}
        </main>
        <Connect />
        <Footer />
      </body>
    </html>
  );
};

export default IndexPage;
