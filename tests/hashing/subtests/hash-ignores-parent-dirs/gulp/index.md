---
result: pass
---

Gulp-based hashing solutions like [gulp-rev-all] generally calculate a file's hash using its contents. As long as hashing is performed last, the generated URLs are based on final source only and not affected by parent directories.

[gulp-rev-all]: https://github.com/smysnk/gulp-rev-all
