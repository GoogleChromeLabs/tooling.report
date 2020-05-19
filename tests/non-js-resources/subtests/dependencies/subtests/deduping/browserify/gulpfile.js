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
const RevAll = require('gulp-rev-all');
const browserify = require('browserify');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');

function bundle() {
  return src('src/index.js', { read: false })
    .pipe(
      tap(function(file) {
        file.contents = browserify(file.path)
          .plugin('urify-emitter', {
            output: 'build',
            base: '.',
          })
          .transform('browserify-css', {
            output: 'build/styles.css',
            rootDir: 'src',
            processRelativeUrl(url) {
              return './' + url;
            },
            autoInject: false,
          })
          .bundle();
      }),
    )
    .pipe(buffer())
    .pipe(dest('build/'));
}

function hash() {
  return src('build/**')
    .pipe(
      // can't seem to get this to pick up the `styles.css` file from build, so never never gets versioned assets.
      RevAll.revision({
        hashLength: 32,
        dontRenameFile: ['index.js', 'styles.css'],
        dontUpdateReference: ['index.js', 'styles.css'],
        transformFilename(file, hash) {
          return hash + require('path').extname(file.basename);
        },
      }),
    )
    .pipe(dest('build/'));
}

exports.default = series(bundle, hash);
