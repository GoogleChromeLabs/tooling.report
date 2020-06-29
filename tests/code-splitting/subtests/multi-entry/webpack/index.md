---
result: partial
---

When you opt-in to code splitting, Webpack may duplicate modules between chunks depending on [heuristics]. If this happens, then you can end up with multiple instances of the same module, each with their own state that can easily get out of sync.

However, you can set [`optimization.runtimeChunk`][runtimechunk] to `"single"`. This moves Webpack's runtime module loader into its own bundle rather than being inlined into each entry, creating a global registry that allows code-splitted modules to be shared between entries. This doesn't prevent Webpack from copying module code between entry points, but it prevents it creating two instances of the same module at runtime.

The [`optimization.splitChunks.minSize` option](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunksminsize) can be used to change the size threshold for creating a chunk, which defaults to 30k. To achieve full shared dependencies, the bundle size threshold can be effectively disabled by setting `optimization.splitChunks.minSize` to `0`.

This test is a "partial" pass, since `runtimeChunk:"single"` is required to ensure correct module instantiation, but it is disabled by default and not documented in [Webpack's code splitting guide](https://webpack.js.org/guides/code-splitting/).

[heuristics]: https://webpack.js.org/plugins/split-chunks-plugin/#defaults
[runtimechunk]: https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
