---
result: fail
issue: https://github.com/browserify/browserify/issues/1186
---

Browserify is targeted at CommonJS and polyfills `require()` in a browser’s context. It does not support the JavaScript module syntax unless Babel is used to compile JavaScript modules to CommonJS before Browserify processes them.
