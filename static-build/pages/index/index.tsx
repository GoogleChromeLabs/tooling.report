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

import { renderIssueLinksForTest } from '../../utils.js';

import config from 'consts:config';
import sharedStyles from 'css-bundle:static-build/shared/styles/index.css';
import pageStyles from 'css-bundle:./styles.css';
import {
  $topSticky,
  $sidebarLayout,
  $summaryList,
  $connect,
} from './styles.css';
import bundleURL, { imports } from 'client-bundle:client/home/index.ts';
import { calculateScore, calculateScoreTotals } from 'static-build/utils';
import Logo from '../../components/Logo';
import GithubFAB from '../../components/GithubFAB';
import Footer from '../../components/Footer';
import LinkList from '../../components/LinkList';
import Lamp from '../../components/Lamp';
import { BenchHero } from '../../components/Heroes';
import SummaryCard from '../../components/SummaryCard';
import ToolNav from '../../components/ToolNav/index';

import gulp from 'asset-url:../../img/gulp.svg';
import rollup from 'asset-url:../../img/rollup.svg';
import webpack from 'asset-url:../../img/webpack.svg';
import parcel from 'asset-url:../../img/parcel.svg';
const toolImages = { gulp, rollup, webpack, parcel };

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
    <div>
      <h4>{test.meta.title}</h4>
      <ul>
        {config.testSubjects.map(subject => {
          const { score, possible } = calculateScore(test, subject);
          return (
            <li>
              {subject}: {score}/{possible}
              {renderIssueLinksForTest(test, subject)}
            </li>
          );
        })}
      </ul>
      <p>
        <a href={basePath}>More details</a>
      </p>
      {results && <ul>{results}</ul>}
      {test.subTests && (
        <section>{renderTests(test.subTests, basePath)}</section>
      )}
    </div>
  );
}

function renderTests(tests: Tests, basePath = '/'): JSX.Element[] {
  return Object.entries(tests).map(([testDir, test]) =>
    renderTest(test, `${basePath}${testDir}/`),
  );
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
    <html>
      <head>
        <title>Tooling.Report</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* TODO: favicon */}
        <link rel="stylesheet" href={sharedStyles} />
        <link rel="stylesheet" href={pageStyles} />
        <script type="module" src={bundleURL} />
        {imports.map(v => (
          <link rel="preload" as="script" href={v} crossOrigin="" />
        ))}
      </head>
      <body>
        <header>
          <section>
            <Logo />
            <div>
              <div>
                <BenchHero />
              </div>
              <div>
                <h2>What is Tooling Report?</h2>
                <p>
                  A quick and easy way to figure out what the best tool for your
                  next project is, if it’s worth your time to migrate from one
                  tool to another and how to adopt a best practice into your
                  existing code base.
                </p>
                <LinkList
                  links={[
                    { title: 'FAQ', href: '#' },
                    { title: 'Contribute', href: '#' },
                    { title: 'Have an issue?', href: '#' },
                  ]}
                />
              </div>
            </div>
          </section>
        </header>
        <main>
          <GithubFAB />
          <section id="getting-started">
            <div class={$sidebarLayout}>
              <aside></aside>
              <div>
                <h3>Getting Started</h3>
                <p>
                  Expand or reduce the scope of your comparison using the below
                  checklist. You can always come back and reconfigure it later.{' '}
                </p>
                <div>
                  <p>Use the (+) button to submit or request a build tool!</p>
                </div>
              </div>
            </div>
          </section>

          <section id="summary">
            <div class={$sidebarLayout}>
              <aside>
                <h3>Summary</h3>
                <small>Results at the highest level</small>
              </aside>
              <div>{renderSummary(tests)}</div>
            </div>
          </section>

          <section id="overview">
            <div class={$sidebarLayout}>
              <aside>
                <h3>Overview</h3>
                <ul>
                  <li>section 1</li>
                  <li>section 2</li>
                  <li>...</li>
                </ul>
              </aside>
              <div>{renderSummary(tests)}</div>
            </div>
          </section>

          <ToolNav />

          <section id="configuration">
            <div class={$sidebarLayout}>
              <aside>
                <h3 class={$topSticky}>Configuration</h3>
                <ul>
                  <li>section 1</li>
                  <li>section 2</li>
                  <li>...</li>
                </ul>
              </aside>
              <div>{renderTests(tests)}</div>
            </div>
          </section>

          <section id="todo:next-in-array">
            <div class={$sidebarLayout}>
              <aside>
                <h3 class={$topSticky}>Configuration</h3>
                <ul>
                  <li>section 1</li>
                  <li>section 2</li>
                  <li>...</li>
                </ul>
              </aside>
              <div>{renderTests(tests)}</div>
            </div>
          </section>

          <section class={$connect}>
            <div>
              <Lamp />
            </div>
            <div>
              <h2>Questions or Concerns?</h2>
              <p>
                We want to hear from you, let us know how to make this better.
                Open up a Github issue and we’ll track it there. Thanks!
              </p>
              <LinkList links={[{ title: 'Open a Github Issue', href: '#' }]} />
            </div>
          </section>
        </main>
        <Footer />
      </body>
    </html>
  );
};

export default IndexPage;
