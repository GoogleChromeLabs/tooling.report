---
result: pass
---

Browserify has a [static-module](https://www.npmjs.com/package/static-module) plugin that lets you replace values and function calls with arbitrary script at build time. Browserify will also bundle any `require` calls in this replacement, so you can import helper functions _once_, even if they're used in multiple places.
