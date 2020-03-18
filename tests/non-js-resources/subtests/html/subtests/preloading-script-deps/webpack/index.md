---
result: pass
---

[html-webpack-plugin] exposes Webpack's generated assets to a template and set of plugins, which includes information about required bundles for a given entry module. This can be used to inject the necessary preloads or script tags for all dependencies of a page.

While the available chunk metadata passed through templates and plugins does include information on code-splitted bundles (async chunks) required by each entry bundle, no plugins are currently available for injecting only the necessary preloads or script tags to based on this information. At present, it is possible to preload all code-splitted bundles or a subset based on filename matching, not based on actual usage.

[html-webpack-plugin]: https://github.com/jantimon/html-webpack-plugin
