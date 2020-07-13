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
import { h } from 'preact';
import config from 'consts:config';
import Logo from '../../components/Logo';
import LinkList from '../../components/LinkList';
import Plant from '../../components/Plant';
import {
  $container,
  $footer,
  $rule,
  $desc,
  $messaging,
  $plant,
} from './styles.css';

import { html as CREDITS } from 'md:../../../CREDITS.md';

const links = [
  { title: 'Terms and Privacy', href: 'https://policies.google.com' },
  {
    title: 'Source on GitHub',
    href: config.githubRepository,
  },
];

function Footer() {
  return (
    <footer class={$footer}>
      <div class={$container}>
        <div class={$messaging}>
          <div>
            <Logo />
            <div class={$desc}>
              <span dangerouslySetInnerHTML={{ __html: CREDITS }} />
            </div>
          </div>
          <div class={$plant}>
            <Plant />
          </div>
        </div>
        <hr class={$rule} />
        <LinkList links={links} />
      </div>
    </footer>
  );
}

export default Footer;
