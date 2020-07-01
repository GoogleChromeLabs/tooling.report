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
import toolingReportSocial from 'asset-url:static-build/img/tooling-report-social.png';

export default function SocialMeta() {
  return (
    <Fragment>
      <meta property="og:type" content="article" />
      <meta property="og:image" content={toolingReportSocial} />
      <meta property="og:url" content="https://tooling.report" />
      <meta property="og:site_name" content="tooling.report" />
      <meta name="twitter:site" content="@ChromiumDev" />
      <meta name="twitter:creator" content="@ChromiumDev" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:image:alt"
        content="tooling.report logo at top followed by the homepage summary score cards, which offer a high level glimpse into the results."
      />
    </Fragment>
  );
}
