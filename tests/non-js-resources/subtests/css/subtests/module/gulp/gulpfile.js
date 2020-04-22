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
const mkdirp = require('mkdirp');
const cssnano = require('cssnano');

function dataURL() {
  mkdirp.sync('build');

  return src('src/*.js', { read: false })
    .pipe(
      tap(function(file) {
        file.contents = browserify(file.path)
          .plugin(require('css-modulesify'), {
            rootDir: __dirname,
            output: './build/styles.css',
            after: [cssnano()],
          })
          .bundle();
      }),
    )
    .pipe(dest('build'));
}

exports.default = dataURL;
