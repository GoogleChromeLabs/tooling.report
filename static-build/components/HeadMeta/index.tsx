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
import { h, Fragment } from 'preact';
import SocialMeta from './social';
import sharedStyles from 'css-bundle:static-build/shared/styles/index.css';

import icoURL from 'asset-url:../../img/favicon.ico';
import appleIconURL from 'asset-url:../../img/apple-touch-icon.png';
import png32URL from 'asset-url:../../img/favicon-32x32.png';
import png16URL from 'asset-url:../../img/favicon-16x16.png';
import safariURL from 'asset-url:../../img/safari-pinned-tab.svg';

export default function HeadMeta() {
  return (
    <Fragment>
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1"
      />
      <link rel="shortcut icon" href={icoURL} />
      <link rel="apple-touch-icon" sizes="180x180" href={appleIconURL} />
      <link rel="icon" type="image/png" sizes="32x32" href={png32URL} />
      <link rel="icon" type="image/png" sizes="16x16" href={png16URL} />
      <link rel="mask-icon" href={safariURL} />
      <meta name="color-scheme" content="dark light" />
      <SocialMeta />
      <link rel="stylesheet" href={sharedStyles} />
    </Fragment>
  );
}
