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

const { src, dest, series } = require('gulp');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');

function hashFont() {
  return src('src/*.ttf')
    .pipe(rev())
    .pipe(dest('build/'))
    .pipe(rev.manifest())
    .pipe(dest('build/'));
}

function replaceHTML() {
  return src(['build/*.json', 'src/*.html'])
    .pipe(
      revCollector({
        replaceReved: true,
      }),
    )
    .pipe(dest('build/'));
}

exports.default = series(hashFont, replaceHTML);
