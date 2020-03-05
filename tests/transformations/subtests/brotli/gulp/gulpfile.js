const { src, dest } = require('gulp');
const gulpBrotli = require('gulp-brotli');

function brotli() {
  return src('src/*.txt')
    .pipe(gulpBrotli.compress())
    .pipe(dest('build/'));
}

exports.default = brotli;
