---
result: pass
---

The standard plugin for handling HTML in Webpack's ecosystem is [html-webpack-plugin]. Rather than the HTML-first approach shown in the [HTML test](/non-js-resources/entry/), html-webpack-plugin allows templating of HTML files based on Webpack's output modules and assets. Each `HtmlWebpackPlugin` instance creates a single HTML file as its output, which means this test requires instantiating multiple plugins that each spawn their own [child compiler].

[html-webpack-plugin]: https://github.com/jantimon/html-webpack-plugin
[child compiler]: https://webpack.js.org/api/compilation-object/#createchildcompiler
