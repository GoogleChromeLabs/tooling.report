---
result: pass
---

Webpack does not perform automatic code splitting by default.

Setting the `optimization.splitChunks.chunks` configuration option to `"all"` enables the generation of shared bundles for common dependencies. While this works in many applications, it's important to understand that `splitChunks` does not automatically create bundles for all shared dependencies by default. Instead, a set of [threshold conditions] are used to determine when common dependencies should be extracted into a shared bundle. The [`optimization.splitChunks.minSize` option](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunksminsize) can be used to change the size threshold, which defaults to 30k.

If the code splits, Webpack _will not load dependencies by default_. Webpack currently assumes entry bundles have no dependencies, which means our shared bundles would need to be explicitly loaded on a page. There are many ecosystem tools available to generate the necessary `<script>` tags, including [HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/), which is used in this test.

Another solution involves [`runtimeChunk`](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk). Webpack relies on a runtime module loader and registry, and the `optimization.runtimeChunk` option provides a way to control where that code should be generated. Setting it to `"single"` produces a `runtime.js` bundle that, when added to the page before the entry bundle, will load any shared bundles on which it depends.

[threshold conditions]: https://webpack.js.org/plugins/split-chunks-plugin/#defaults
