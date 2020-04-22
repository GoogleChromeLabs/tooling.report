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
import bundleURL, { imports } from 'client-bundle:client/about/index.ts';
import HeadMeta from '../../components/HeadMeta';
import Logo from '../../components/Logo';
import Footer from '../../components/Footer';
import HeaderLinkList from '../../components/HeaderLinkList';
import { WalkerHero } from '../../components/Heroes';
import FirstParagraphOnly from 'static-build/components/FirstParagraphOnly';

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

import { html as README } from 'md:../../../README.md';
import { html as ABOUT } from 'md:../../../ABOUT.md';

interface Props {}

const AboutPage: FunctionalComponent<Props> = () => {
  return (
    <html>
      <head>
        <title>{`tooling.report: About`}</title>
        <HeadMeta />
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
              <span class={$collection}>About</span>
            </nav>
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
        <main dangerouslySetInnerHTML={{ __html: ABOUT }} />
        <Footer />
      </body>
    </html>
  );
};

export default AboutPage;
