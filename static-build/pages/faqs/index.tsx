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

import { h, FunctionalComponent, Fragment } from 'preact';
import pageStyles from 'css-bundle:./styles.css';
import analyticsBundleURL from 'client-bundle:client/analytics/index.js';
import HeadMeta from '../../components/HeadMeta';
import Logo from '../../components/Logo';
import Footer from '../../components/Footer';
import HeaderLinkList from '../../components/HeaderLinkList';
import { WalkerHero } from '../../components/Heroes';

import { $heroText, $heroImage } from './styles.css';
import {
  $breadcrumbs,
  $home,
} from 'static-build/components/TestCrumbs/styles.css';
import {
  $collection,
  $iconbutton,
  $divider,
} from 'static-build/components/TestCrumbs/Crumb/styles.css';

interface Props {
  faqs: FAQItem[];
}

const FAQPage: FunctionalComponent<Props> = ({ faqs }) => {
  return (
    <html>
      <head>
        <title>{`tooling.report: About`}</title>
        <HeadMeta />
        <link rel="stylesheet" href={pageStyles} />
        <script type="module" async src={analyticsBundleURL}></script>
      </head>
      <body>
        <header>
          <section>
            <Logo />
            <nav class={$breadcrumbs} id="breadcrumbs">
              <a href="/" class={`${$home} ${$collection}`}>
                <span class={$iconbutton}>
                  <span>
                    <svg viewBox="0 0 10 10">
                      <path d="M4 8.5v-3h2v3h2.5v-4H10L5 0 0 4.5h1.5v4z" />
                    </svg>
                  </span>
                </span>
                <span>Home</span>
              </a>
              <span class={$divider}>//</span>
              <span class={$collection}>FAQs</span>
            </nav>
            <div>
              <div class={$heroText}>
                <HeaderLinkList />
              </div>
              <div class={$heroImage}>
                <WalkerHero />
              </div>
            </div>
          </section>
        </header>
        <main>
          {faqs
            .sort((a, b) => a.meta.order - b.meta.order)
            .map(item => (
              <Fragment>
                <h2>{item.meta.question}</h2>
                <div dangerouslySetInnerHTML={{ __html: item.html }} />
              </Fragment>
            ))}
        </main>
        <Footer />
      </body>
    </html>
  );
};

export default FAQPage;
