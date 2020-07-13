---
result: pass
---

One of Webpack's core principles is that bundled modules are loaded using a small runtime, which acts as a module and registry and loader depending on the configuration. The generally recommended approach of configuring Webpack to produce a standalone runtime script.

The runtime script is a natural place to embed bundle hash information, since it already contains the mappings required for translating bundle identifiers into URLs. This centralized hash disambiguation allows dependency bundles to be updated with new hashed URLs, without requiring their dependent bundles to be updated with those hash values. The result is something like an [Import Map], and it's enabled by default in Webpack. With a few configuration changes, it's relatively easy to ensure hash changes don't cascade between bundles.

One trade-off of centralizing hash information is that all hashes must be loaded up-front, which can impact page load for larger applications. To address this, webpack uses a two-level hash cascade by default: JS bundle hashes are loaded up-front at initial page load (since this number is small compared to all modules/assets), whereas asset hashes (for things like `file-loader`) are inlined into the chunks that reference the asset. This ensures most hashes are loaded as-needed and don't impact the initial page load.

This default behavior causes a one-level cascade for assets loaded on demand. In some cases it may makes sense to vary from the default behavior, e. g. when only very few assets are used that change very often, or the code portion of a on-demand loaded chunk is very large.

To vary from the default behavior one can use the [`splitChunks.cacheGroups`][splitchunks cachegroups] option to put on-demand-loaded assets into the `runtime` cache group (which avoids the cascade at cost of loading the asset hashes upfront), or into a dedicated cache group (omitting `name`), which would not avoid the cascade, but puts code and assets into separate files (avoiding invalidation of code portion).

Note that initially loaded assets do not case a cascade anyway as initial chunks do not have their hashes in the runtime script.

[import map]: https://wicg.github.io/import-maps/
[splitchunks cachegroups]: https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroups
