---
result: pass
---

Rollup produces bundles that are idiomatic CommonJS modules when `output.format` is set to `cjs`. Code-splitted bundles, such as those resulting from the use of Dynamic Import, are loaded via `require()`. Unlike other bundlers, the generated output is clean CommonJS, and doesn't require a particular loader.
