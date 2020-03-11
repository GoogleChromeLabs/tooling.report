const { src, dest } = require('gulp');
const browserify = require('browserify');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');

function moduleSplitting() {
  return src('src/*.js', { read: false })
    .pipe(
      tap(function(file) {
        file.contents = browserify(file.path).bundle();
      }),
    )
    .pipe(buffer())
    .pipe(dest('build'));
}

exports.default = moduleSplitting;
