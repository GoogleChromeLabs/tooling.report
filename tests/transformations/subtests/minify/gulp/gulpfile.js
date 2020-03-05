const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');

function js() {
  return src('src/*.js')
    .pipe(uglify())
    .pipe(dest('build/'));
}

exports.default = js;
