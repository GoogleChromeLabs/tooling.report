---
result: pass
---

This is same as basic-js test. You can pipe Browserify result to gulp-hash in order to add hash to the filename.
This is where Gulp gives us flexibility on when the hashing is done. By applying hasing function on the actual result of each build, we can ensure that when source code changes, hash also change.
