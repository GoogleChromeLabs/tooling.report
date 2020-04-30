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
import HeadMeta from 'static-build/components/HeadMeta';
import Logo from 'static-build/components/Logo';
import Footer from 'static-build/components/Footer';
import HeaderLinkList from 'static-build/components/HeaderLinkList';
import { WalkerHero } from 'static-build/components/Heroes';
import BreadCrumbs from 'static-build/components/BreadCrumbs';

import { $heroText, $heroImage } from './styles.css';

interface Props {
  faqs: FAQItem[];
}

const FAQPage: FunctionalComponent<Props> = ({ faqs }) => {
  return (
    <html lang="en">
      <head>
        <title>{`tooling.report: About`}</title>
        <meta name="description" content="FAQs" />
        <HeadMeta />
        <link rel="stylesheet" href={pageStyles} />
        <script type="module" async src={analyticsBundleURL}></script>
      </head>
      <body>
        <header>
          <section>
            <Logo />
            <BreadCrumbs
              crumbs={[{ selected: 0, options: [{ title: 'FAQs' }] }]}
            />
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
