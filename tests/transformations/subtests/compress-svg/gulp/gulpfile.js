const { src, dest } = require('gulp');
const svgmin = require('gulp-svgmin');

function compressSvg() {
  return src('src/*.svg')
    .pipe(svgmin())
    .pipe(dest('build/'));
}

exports.default = compressSvg;
