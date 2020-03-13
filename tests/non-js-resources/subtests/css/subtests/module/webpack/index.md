---
result: pass
---

Webpack's [css-loader] includes comprehensive options for compiling CSS Modules. When combined with [mini-css-extract-plugin], CSS imports are preprocessed to namespace classNames, the CSS is extracted into one or more files configurable via `splitChunks`, and local-to-namespaced className mappings are produced as the result of the import.

By default, these className mappings are included in Webpack's bundles in full, not subject to code splitting or inlining. However, applying [constant-locals-loader](https://www.npmjs.com/package/constant-locals-loader) to the processed CSS imports enables Webpack to inline classNames where they are used, removing the mappings from bundles entirely. A [PR to mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin/pull/509) proposes supporting this behavior out-of-the-box.

[css-loader]: https://webpack.js.org/loaders/css-loader/
[mini-css-extract-plugin]: https://github.com/webpack-contrib/mini-css-extract-plugin
