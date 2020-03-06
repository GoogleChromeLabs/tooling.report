---
result: pass
---

One of Webpack's core principles is that bundled modules are loaded using a small runtime, which acts as a module and registry and loader depending on the configuration. The generally recommended approach of configuring Webpack to produce a standalone runtime script.

The runtime script is a natural place to embed bundle hash information, since it already contains the mappings required for translating bundle identifiers into URLs. This centralized hash disambiguation allows dependency bundles to be updated with new hashed URLs, without requiring their dependent bundles to be updated with those hash values. The result is something like an [Import Map], and it's enabled by default in Webpack. With a few configuration changes, it's relatively easy to ensure hash changes don't cascade between bundles.

[import map]: https://wicg.github.io/import-maps/
