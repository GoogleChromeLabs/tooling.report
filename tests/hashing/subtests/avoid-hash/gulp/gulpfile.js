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
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const browserify = require('browserify');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const gulpif = require('gulp-if');

function bundle(file) {
  file.contents = browserify(file.path)
    .plugin('tinyify')
    .plugin('urify-emitter', {
      output: 'build',
      base: '.',
    })
    .bundle();
}

function buildScripts() {
  return (
    src('src/{*.html,*-entry.js}')
      // bundle JS files:
      .pipe(gulpif(file => /\.js$/.test(file.basename), tap(bundle)))
      .pipe(buffer())
      // hash URLs of JS files that start with "hashed":
      .pipe(gulpif(file => /^hashed.*\.js$/.test(file.basename), rev()))
      // update URL references with hashes:
      .pipe(revRewrite())
      .pipe(dest('build'))
  );
}

exports.default = buildScripts;
