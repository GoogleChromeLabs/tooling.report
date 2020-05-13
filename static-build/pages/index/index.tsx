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
} from './styles.css';

import analyticsBundleURL from 'client-bundle:client/analytics/index.js';
import config from 'consts:config';
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
        <title>Home | Score Overview</title>
        <meta name="description" content={config.metaDescription} />
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
          <section id="summary">
            <a href="#summary">
              <h3 class={$sectionHeader}>Summary</h3>
            </a>
            <div class={$sidebarLayout}>
              <aside>
                <small>Results at the highest level</small>
              </aside>
              <div>{renderSummary(tests)}</div>
            </div>
          </section>

          <ToolNav />

          <section id="legend">
            <div class={$sidebarLayout}>
              <aside></aside>
              <div>
                <Legend />
              </div>
            </div>
          </section>

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
