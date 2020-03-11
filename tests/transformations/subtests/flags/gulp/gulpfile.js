const { src, dest } = require('gulp');
const preProc = require('gulp-pre-proc');

function flags() {
  return src('src/*.js')
    .pipe(
      preProc({
        removeTag: { tag: 'DEBUG', pathTest: ['src', /\.js$/] },
      }),
    )
    .pipe(dest('build/'));
}

exports.default = flags;
