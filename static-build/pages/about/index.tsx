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
import pageStyles from 'css-bundle:./styles.css';
import HeadMeta from 'static-build/components/HeadMeta';
import Logo from 'static-build/components/Logo';
import Footer from 'static-build/components/Footer';
import HeaderLinkList from 'static-build/components/HeaderLinkList';
import { WalkerHero } from 'static-build/components/Heroes';
import FirstParagraphOnly from 'static-build/components/FirstParagraphOnly';
import BreadCrumbs from 'static-build/components/BreadCrumbs';

import { $heroText, $heroImage, $aboutContent } from './styles.css';
import { $contentContainer } from 'static-build/shared/styles/sizing.css';
import { html as README } from 'md:../../../README.md';
import { html as ABOUT } from 'md:../../../ABOUT.md';

interface Props {}

const AboutPage: FunctionalComponent<Props> = () => {
  return (
    <html lang="en">
      <head>
        <HeadMeta
          titleParts={['About']}
          description="Information about the tooling.report website - what is tooling.report?"
        />
        <link rel="stylesheet" href={pageStyles} />
      </head>
      <body>
        <header>
          <section>
            <Logo />
            <BreadCrumbs crumbs={[{ title: 'About' }]} />
            <div>
              <div class={$heroText}>
                <div>
                  <FirstParagraphOnly content={README} />
                </div>
                <HeaderLinkList home={false} />
              </div>
              <div class={$heroImage}>
                <WalkerHero />
              </div>
            </div>
          </section>
        </header>
        <main>
          <div
            class={`${$contentContainer} ${$aboutContent}`}
            dangerouslySetInnerHTML={{ __html: ABOUT }}
          />
        </main>
        <Footer />
      </body>
    </html>
  );
};

export default AboutPage;
