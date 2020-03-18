---
result: pass
---

[CompressionWebpackPlugin] or [BrotliPlugin] can both be used to generate brotli-compressed versions of output files at build time. Both plugins use Node's native brotli support when available, however CompressionWebpackPlugin exhibits better performance since it uses the asynchronous `brotliCompress()` interface.

[compressionwebpackplugin]: https://webpack.js.org/plugins/compression-webpack-plugin/
[brotliplugin]: https://github.com/mynameiswhm/brotli-webpack-plugin
