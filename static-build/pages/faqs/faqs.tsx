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
  [`Who is this site for?`]: (
    <Fragment>
      <p>
        This site gives you an overview of the features supported by various
        bundlers.
      </p>
      <p>
        This should help you pick the right build tool for your next project,
        but also act as a guide for how to make the most of your current build
        tool.
      </p>
    </Fragment>
  ),
  [`Which tool is the best?`]: (
    <Fragment>
      <p>It's complicated! 😀</p>
      <p>
        The best tool for you depends on what you need. Some tools are better
        for libraries. Some tools have more, better maintained plugins than
        others. Some work better with non-JavaScript resources like CSS and
        HTML. Some are easier to get started with, whereas others are easier to
        extend and configure.
      </p>
      <p>
        Have a look at the tests relating to features <em>you</em> care about.
      </p>
    </Fragment>
  ),
  [`Were tooling authors involved with this?`]: (
    <Fragment>
      <p>
        This site was built by folks on the Google Chrome developer relations
        team, but tooling authors were given early access and gave feedback.
      </p>
    </Fragment>
  ),
  [`Why this set of tools? How were they chosen?`]: (
    <Fragment>
      <p>
        For our first release, we focused on tools are that are either hugely
        popular, or up-and-coming.
      </p>
      <p>
        For instance,{' '}
        <a href="https://www.npmjs.com/package/browserify">Browserify</a>{' '}
        <em>feels</em> less trendy these days, but the numbers on NPM suggest
        it's more popular than some of the other tools we tested, and that
        number doesn't look like it's going down.
      </p>
      <p>
        Whereas <a href="https://parceljs.org/">Parcel</a> is less established,
        but its popularity is growing, and it already passes a large number of
        our tests.
      </p>
    </Fragment>
  ),
  [`Is this open-source?`]: (
    <Fragment>
      <p>
        Yes! This site, and all our tests, are{' '}
        <a href="https://github.com/GoogleChromeLabs/tooling.report/">
          available on GitHub
        </a>
        .
      </p>
    </Fragment>
  ),
  [`Can I add a new test to this site?`]: (
    <Fragment>
      <p>
        We're interested! We like tests that reflect something useful to
        developers, and things that differ between tools.
      </p>
      <p>
        Before spending time writing tests, please{' '}
        <a href="https://github.com/GoogleChromeLabs/tooling.report/issues">
          file an issue
        </a>{' '}
        proposing the test you'd like to add. Then, we can figure out the right
        kind of test before moving on to writing code.
      </p>
    </Fragment>
  ),
  [`Can I add a new tool to this site?`]: (
    <Fragment>
      <p>
        We're interested! We'd like to focus on tools that have traction with
        developers, but we're also open to new tools that pass a significant
        number of our tests.
      </p>
      <p>
        Please{' '}
        <a href="https://github.com/GoogleChromeLabs/tooling.report/issues">
          file an issue
        </a>{' '}
        proposing the tool before writing tests, so we can avoid duplicate or
        unnecessary effort.
      </p>
    </Fragment>
  ),
};

export default faqs;
