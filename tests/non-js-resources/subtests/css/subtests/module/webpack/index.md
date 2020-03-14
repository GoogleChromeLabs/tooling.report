---
result: pass
---

Webpack's [css-loader] includes comprehensive options for compiling CSS Modules. When combined with [mini-css-extract-plugin], CSS imports are preprocessed to namespace classNames, the CSS is extracted into one or more files configurable via `splitChunks`, and local-to-namespaced className mappings are produced as the result of the import.

These className mapping objects often end up being included in Webpack's bundles in full rather than the prefixed classNames being inlined at their usage locations. This could be optimized away by [increasing the number of Terser compression passes](https://github.com/webpack-contrib/terser-webpack-plugin/pull/225), or by using named imports for className mappings. The latter can be achieved using [constant-locals-loader](https://www.npmjs.com/package/constant-locals-loader), which has been [proposed as a built-in option](https://github.com/webpack-contrib/mini-css-extract-plugin/pull/509) for mini-css-extract-plugin.

[css-loader]: https://webpack.js.org/loaders/css-loader/
[mini-css-extract-plugin]: https://github.com/webpack-contrib/mini-css-extract-plugin
