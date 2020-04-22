---
result: fail
issue: 'N/A'
---

Browserify bundles CommnonJS code by statically analyzing synchronous `require()` calls to import modules. Since dynamic require usage and ECMAScript modules are both unsupported, neither can be used to create split points.
