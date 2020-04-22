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

const { dest } = require('gulp');
const path = require('path');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const mkdirp = require('mkdirp');
const Combine = require('ordered-read-streams');

async function betweenWorkers() {
  await mkdirp('build');

  const files = ['./src/index.js', './src/lazy.js'];
  const entryStreams = files.map(filePath => source(path.basename(filePath)));
  const common = browserify(files)
    .plugin(require('esmify'))
    .plugin(require('factor-bundle'), { outputs: entryStreams })
    .bundle()
    .pipe(source('common.js'));

  return new Combine([...entryStreams, common]).pipe(dest('build/'));
}

exports.default = betweenWorkers;
