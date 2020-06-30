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
import { $contentContainer } from 'static-build/shared/styles/sizing.css';
import { $faqContent } from './styles.css';
import analyticsBundleURL from 'client-bundle:client/analytics/index.js';
import HeadMeta from 'static-build/components/HeadMeta';
import Logo from 'static-build/components/Logo';
import Footer from 'static-build/components/Footer';
import HeaderLinkList from 'static-build/components/HeaderLinkList';
import { WalkerHero } from 'static-build/components/Heroes';
import BreadCrumbs from 'static-build/components/BreadCrumbs';
import Title from 'static-build/components/Title';
import faqs from 'faqs:';

import { $heroText, $heroImage } from './styles.css';

interface Props {}

const FAQPage: FunctionalComponent<Props> = () => {
  return (
    <html lang="en">
      <head>
        <Title parts={['FAQs']} />
        <meta
          name="description"
          content="Frequently asked questions we have about this site"
        />
        <HeadMeta />
        <link rel="stylesheet" href={pageStyles} />
        <script type="module" async src={analyticsBundleURL}></script>
      </head>
      <body>
        <header>
          <section>
            <Logo />
            <BreadCrumbs crumbs={[{ title: 'FAQs' }]} />
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
          <div class={`${$contentContainer} ${$faqContent}`}>
            {faqs.map(({ title, html }) => (
              <Fragment>
                <h2>{title}</h2>
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </Fragment>
            ))}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
};

export default FAQPage;
