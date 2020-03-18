---
result: pass
---

Webpack's internals and client-side module loader/registry implementation are both based on CommonJS-style `require()` and `module.exports`. As a result, Webpack has extensive support for CommonJS including Node.js-specific extensions like `__dirname` and `module.id`.
