const { src, dest } = require('gulp');
const browserify = require('browserify');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const source = require('vinyl-source-stream');

function multiBundles() {
  const files = ['./src/index.js', './src/profile.js'];
  return browserify(files)
    .plugin('factor-bundle', {
      outputs: ['./build/index.js', './build/profile.js'],
    })
    .bundle()
    .pipe(source('shared.js'))
    .pipe(dest('build/'));
}

exports.default = multiBundles;
