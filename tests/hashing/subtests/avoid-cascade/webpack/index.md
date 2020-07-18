---
result: pass
---

One of Webpack's core principles is that bundled modules are loaded using a small runtime, which acts as a module and registry and loader depending on the configuration. The generally recommended approach of configuring Webpack to produce a standalone runtime script.

The runtime script is a natural place to embed bundle hash information, since it already contains the mappings required for translating bundle identifiers into URLs. This centralized hash disambiguation allows dependency bundles to be updated with new hashed URLs, without requiring their dependent bundles to be updated with those hash values. The result is something like an [Import Map], and it's enabled by default in Webpack. With a few configuration changes, it's relatively easy to ensure hash changes don't cascade between bundles.

One trade-off of centralizing hash information is that all hashes must be loaded up-front, which can impact page load for larger applications. To address this, webpack uses a two-level hash cascade by default: JS bundle hashes are loaded up-front at initial page load (since this number is small compared to all modules/assets), whereas asset hashes (for things like `file-loader`) are inlined into the chunks that reference the asset. This ensures most hashes are loaded as-needed and don't impact the initial page load.

In cases where there are very few assets or where chunks containing asset references are very large, it can make sense to opt out of the default one-level cascade behavior using [`splitChunks.cacheGroups`][splitchunks cachegroups]. This can be used to move on-demand-loaded asset hashes into the `runtime` so they are loaded up-front, or into a separate bundle (by omitting `name`) containing the asset hashes and initialization code. It's also worth noting that assets don't cascade when referenced by entry bundles, which are loaded directly without relying on hashes in the runtime.

[import map]: https://wicg.github.io/import-maps/
[splitchunks cachegroups]: https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroups
