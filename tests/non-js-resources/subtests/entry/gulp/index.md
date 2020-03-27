---
result: pass
---

One of the pros of using Gulp is that you can define the input and output files and order in which tasks will run. This prevents you from ever being locked in to any specific entry point.

This test uses `gulp-rev` to hash CSS and JS files, then uses `gulp-rev-collector` to replace the references in the index.html file.

(Note: If you are using Browserify to bundle your JavaScirpt, you would run it before `rev()` in the `scriptHash` function.)
