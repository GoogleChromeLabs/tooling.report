---
result: partial
---

Webpack supports sharing code-splitted modules between entry points, with two important caveats.

When using multiple entry points, always set [`optimization.runtimeChunk`][runtimechunk] to `"single"`. This moves Webpack's runtime module loader into its own bundle rather than being inlined into each entry, creating a global registry that allows code-splitted modules to be shared between entries.

Common dependencies are moved into shared bundles based on [heuristics], and those that don't meet the criteria are inlined into their entry bundles. Webpack's default code splitting configuration is a reasonable starting point, and it's worth experimenting based on your own application. In this minimal test, we used [`minSize:0`][minsize] to prevent duplication.

[heuristics]: https://webpack.js.org/plugins/split-chunks-plugin/#defaults
[runtimechunk]: https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
[minsize]: https://webpack.js.org/plugins/split-chunks-plugin/#splitchunksminsize
