const { src, dest } = require('gulp');
const babel = require('gulp-babel');

function transpile() {
  return src('src/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(dest('build/'));
}

exports.default = transpile;
