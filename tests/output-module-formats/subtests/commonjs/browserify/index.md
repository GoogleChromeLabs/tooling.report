---
result: pass
---

Browserify expects source files to be CommonJS modules, though its default output is a custom registry. Setting the `node` option to `true` instructs Browserify to produce CommonJS bundles. These bundles are Browserify-specific, though the `node` target does use `require()` to for code loading.
