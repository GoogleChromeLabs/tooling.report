---
result: pass
---

Gulp does not differentiate between the file formats used as entry points in a build. Any set of files can be used as the "source" of a build, and stream processing can be applied to any type of file.

This test uses `gulp-rev` to hash CSS and JS files, then uses `gulp-rev-collector` to replace the references in the index.html file.

(Note: If you are using Browserify to bundle your JavaScirpt, you would run it before `rev()` in the `scriptHash` function.)
