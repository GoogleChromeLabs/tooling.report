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

function test1() {
  return src('src1/**')
    .pipe(RevAll.revision())
    .pipe(dest('build/1'));
}

function test2() {
  return src('src2/**')
    .pipe(RevAll.revision())
    .pipe(dest('build/2'));
}

exports.default = series(test1, test2);
