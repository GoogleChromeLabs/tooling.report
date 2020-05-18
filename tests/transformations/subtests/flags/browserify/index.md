---
result: pass
---

Gulp can be used to preprocess JavaScript files, with AST-aware constant inlining powered by [gulp-envify]. Once constants are inlined, the source can be passed through [gulp-terser] to remove unreachable conditional code and imports.

[gulp-envify]: https://github.com/tomashanacek/gulp-envify
[gulp-terser]: https://github.com/duan602728596/gulp-terser
