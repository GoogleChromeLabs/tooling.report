const { src, dest } = require('gulp');
const browserify = require('browserify');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');

function deadCode() {
  return src('src/*.js', { read: false })
    .pipe(
      tap(function(file) {
        file.contents = browserify(file.path)
          .plugin('tinyify')
          .bundle();
      }),
    )
    .pipe(buffer())
    .pipe(dest('build'));
}

exports.default = deadCode;
