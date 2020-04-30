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
import { JSX, Fragment, h } from 'preact';

const faqs: { [title: string]: JSX.Element } = {
  [`Do the tooling authors know about tooling.report?`]: (
    <Fragment>
      <p>
        Yes! We contacted the teams before this tooling.report went public to
        make sure that we are representing their tool accurately and fairly. Our
        goal is to spark collaboration rather than drive a wedge between them.
        We are all on Team Web after all.
      </p>
    </Fragment>
  ),
  [`What is life?`]: (
    <Fragment>
      <ol>
        <li>…without love?</li>
        <li>42</li>
        <li>???</li>
        <li>Profit!</li>
      </ol>
    </Fragment>
  ),
  [`What encoding does tooling.report use?`]: (
    <Fragment>
      <p>
        I mean that question barely makes sense. But I guess the answer is
        UTF-8.
      </p>
    </Fragment>
  ),
};

export default faqs;
