const { src, dest } = require('gulp');
const browserify = require('browserify');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const source = require('vinyl-source-stream');

// This test bundles index.js and worker.js
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
function betweenNewWorkers() {
  const files = ['./src/index.js', './src/worker.js'];
  return browserify(files)
    .plugin('factor-bundle', {
      outputs: ['./build/index.js', './build/worker.js'],
    })
    .bundle()
    .pipe(source('common.js'))
    .pipe(dest('build/'));
}

exports.default = betweenNewWorkers;
exports.basicBundle = basicBundle;
