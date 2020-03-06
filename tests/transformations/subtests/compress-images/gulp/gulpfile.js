const { src, dest } = require('gulp');
const smushit = require('gulp-smushit');

function compressImages() {
  return src('src/*.{jpg,png}')
    .pipe(smushit())
    .pipe(dest('build/'));
}

exports.default = compressImages;
