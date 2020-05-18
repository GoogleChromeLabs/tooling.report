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

const path = require('path');
const { dest } = require('gulp');
const browserify = require('browserify');
const buffer = require('gulp-buffer');
const hash = require('gulp-hash');
const source = require('vinyl-source-stream');
const merge = require('merge-stream');
const globby = require('globby');

function entryCascade() {
  return globby('./src/*.js').then(entries => {
    // create output streams for each entry bundle
    const outputs = entries.map(entry => source(path.basename(entry)));
    const b = browserify(entries)
      .plugin('factor-bundle', { outputs })
      .bundle()
      .pipe(source('common.js'));
    return merge(b, outputs)
      .pipe(buffer())
      .pipe(hash())
      .pipe(dest('dist/'));
  });
}

exports.default = entryCascade;
