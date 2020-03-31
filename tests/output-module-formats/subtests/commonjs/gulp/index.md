---
result: partial
---

Browserify expects source files to be CommonJS modules, though its default output is a custom registry. Setting the `node` option to `true` instructs Browserify to produce CommonJS bundles. While Browserify doesn't support Code Splitting, the `node` target does use `require()` to load external modules.
