const { dest } = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

function importNodeModules() {
  const b = browserify({
    entries: 'src/index.js',
    debug: true,
  });

  return b
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(dest('build/'));
}

exports.default = importNodeModules;
