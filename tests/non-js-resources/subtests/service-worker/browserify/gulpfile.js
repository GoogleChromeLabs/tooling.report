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
const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');
const { src, dest, series } = require('gulp');
const browserify = require('browserify');
const RevAll = require('gulp-rev-all');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const through2 = require('through2');

function hashAssets() {
  return src('src/**', { ignore: 'src/sw.js' })
    .pipe(
      RevAll.revision({
        includeFilesInManifest: ['.js', '.css', '.png'],
      }),
    )
    .pipe(dest('build/'))
    .pipe(RevAll.manifestFile())
    .pipe(dest('build/'));
}

async function sw() {
  const manifest = JSON.parse(
    fs.readFileSync('build/rev-manifest.json', { encoding: 'utf8' }),
  );
  const versionHash = createHash('md5');

  await Promise.all(
    Object.values(manifest).map(async filePath => {
      const file = await fs.promises.readFile(path.join('build', filePath));
      versionHash.update(file);
    }),
  );

  return src('src/sw.js', { read: false })
    .pipe(
      tap(function(file) {
        file.contents = browserify(file.path).bundle();
      }),
    )
    .pipe(buffer())
    .pipe(
      through2.obj(function(file, enc, callback) {
        versionHash.update(file.contents);
        file.contents = Buffer.from(
          file.contents
            .toString('utf8')
            .replace(
              /CACHE_VERSION/g,
              JSON.stringify(versionHash.digest('hex')),
            )
            .replace(/ASSETS_TO_CACHE/g, JSON.stringify(manifest)),
        );
        this.push(file);
        callback();
      }),
    )
    .pipe(dest('build'));
}
exports.default = series(hashAssets, sw);
