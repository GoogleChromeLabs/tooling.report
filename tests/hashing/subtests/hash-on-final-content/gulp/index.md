---
result: pass
---

Hashing solutions for Gulp like [gulp-rev-all] are typically performed as the last step, after minification. As long as hashing is the last transform in the chain, hashes are calculated on final bundle/file contents.

[gulp-rev-all]: https://github.com/smysnk/gulp-rev-all
