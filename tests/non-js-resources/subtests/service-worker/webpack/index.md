---
result: pass
---

Webpack does not automatically handle Service Worker, but it does expose the necessary asset metadata during compilation for plugins to be able to embed hashed assets URLs. While it's not possible to use Webpack's own `DefinePlugin` to embed this metadata into modules, plugins can "embed" asset information by prepending variable declarations to generated scripts.

This example uses a custom Webpack plugin that bundles a Service Worker using a [Child Compiler], inlining global constants that contain a version hash and list of URLs for the Service Worker to cache.

[child compiler]: https://webpack.js.org/api/compilation-object/#createchildcompiler
