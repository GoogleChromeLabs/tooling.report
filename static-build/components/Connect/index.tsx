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
import Lamp from '../../components/Lamp';
import { $connect, $decoration, $message, $callout } from './styles.css';

function Connect() {
  return (
    <section class={$callout}>
      <div class={$connect}>
        <div class={$decoration}>
          <Lamp />
        </div>
        <div class={$message}>
          <h2>
            Questions <span>or</span> Concerns?
          </h2>
          <p>
            We want to hear from you, let us know how to make this better. Open
            up a Github issue and we’ll track it there. Thanks!
          </p>
          <a href={`${config.githubRepository}issues/new`}>
            Open a Github Issue
          </a>
        </div>
      </div>
    </section>
  );
}

export default Connect;
