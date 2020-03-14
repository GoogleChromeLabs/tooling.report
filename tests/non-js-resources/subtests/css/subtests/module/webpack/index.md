---
result: pass
---

Webpack's [css-loader] includes comprehensive options for compiling CSS Modules. When combined with [mini-css-extract-plugin], CSS imports are preprocessed to namespace classNames, the CSS is extracted into one or more files configurable via `splitChunks`, and local-to-namespaced className mappings are produced as the result of the import.

CSS Modules className mapping objects often end up being included in full in bundles, rather than the prefixed classNames being inlined where they are used. With the `esModules` option is set to `true` for both `css-loader` and `MiniCSSExtractPlugin.loader`, these objects can be optimized away in certain cases by increasing the number of Terser compression passes to 2 ([proposed](https://github.com/webpack-contrib/terser-webpack-plugin/pull/225) as a revised default for Webpack's production mode).

It is also possible to achieve aggressive inlining by importing CSS Modules classNames as named imports, either using [constant-locals-loader](https://www.npmjs.com/package/constant-locals-loader) or a new [proposed option](https://github.com/webpack-contrib/mini-css-extract-plugin/pull/509) for mini-css-extract-plugin.

[css-loader]: https://webpack.js.org/loaders/css-loader/
[mini-css-extract-plugin]: https://github.com/webpack-contrib/mini-css-extract-plugin
