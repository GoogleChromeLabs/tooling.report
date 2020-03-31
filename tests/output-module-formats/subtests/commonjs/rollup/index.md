---
result: pass
---

Rollup produces bundles that are idiomatic CommonJS modules when `output.format` is set to `cjs`. Code-splitted bundles, such as those resulting from the use of Dynamic Import, are loaded via `require()`. The generated bundles are also usable from a non-Rollup context, since exports can be accessed directly.
