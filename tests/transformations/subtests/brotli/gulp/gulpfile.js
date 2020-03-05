const { src, dest } = require('gulp');
const gulpBrotli = require('gulp-brotli');

function js() {
  return src('src/*.txt')
    .pipe(gulpBrotli.compress())
    .pipe(dest('build/'));
}

exports.default = js;
