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

const { src, dest } = require('gulp');
const browserify = require('browserify');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const source = require('vinyl-source-stream');

// This test bundles index.js and worker.js
// demonstrating loading with webworkify works
function basicBundle() {
  return src('src/*.js', { read: false })
    .pipe(
      tap(function(file) {
        file.contents = browserify(file.path).bundle();
      }),
    )
    .pipe(buffer())
    .pipe(dest('build/basic'));
}

// This test bundles same index.js and worker.js using factor-bundle
// creating common.js for shared dependency.
function betweenWorkers() {
  const files = ['./src/index.js', './src/worker.js'];
  return browserify(files)
    .plugin('factor-bundle', {
      outputs: ['./build/index.js', './build/worker.js'],
    })
    .bundle()
    .pipe(source('common.js'))
    .pipe(dest('build/'));
}

exports.default = betweenWorkers;
exports.basicBundle = basicBundle;
