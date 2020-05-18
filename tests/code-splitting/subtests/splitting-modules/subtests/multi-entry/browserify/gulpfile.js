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
const browserify = require('browserify');
const source = require('vinyl-source-stream');

function factorbundle() {
  const files = ['./src/entry1.js', './src/entry2.js', './src/entry3.js'];
  return browserify(files)
    .plugin('factor-bundle', {
      outputs: ['./build/entry1.js', './build/entry2.js', './build/entry3.js'],
    })
    .bundle()
    .pipe(source('common.js'))
    .pipe(dest('build/'));
}

exports.default = factorbundle;
