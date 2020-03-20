---
result: pass
---

Pros of using Gulp is that you can define the input, output, and order of which tasks will run. Which prevents being locked to specific entry point.

This test runs `gulp-rav` to hash CSS and JS, then use `gulp-rav-collector` to replace asset links in index.html file.

(Note: if you are using Browserify to build your JavaScirpt, you would run it before `rav()` call in scriptHash function.)
