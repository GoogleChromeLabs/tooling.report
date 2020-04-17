---
result: pass
---

Using [gulp-rev-all], all assets passed through Gulp are transformed to replace any source file locations with their corresponding hashed final URLs. Assets must be passed through Gulp directly, rather than stylesheet subresources being automatically discovered.

[gulp-rev-all]: https://github.com/smysnk/gulp-rev-all
