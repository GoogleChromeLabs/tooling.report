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
const { src, dest } = require('gulp');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const browserify = require('browserify');
const merge = require('merge-stream');
const source = require('vinyl-source-stream');

function buildCommonjs() {
  const common = source('common.js');
  const entries = src('src/index.js', { read: false }).pipe(
    tap(file => {
      const name = path.basename(file.path);
      file.contents = source(name);
      browserify(file.path, { node: true })
        .plugin('factor-bundle', { outputs: [file.contents] })
        .bundle()
        .pipe(common)
        .pipe(buffer());
    }),
  );
  return merge(entries, common).pipe(dest('build/'));
}

exports.default = buildCommonjs;
