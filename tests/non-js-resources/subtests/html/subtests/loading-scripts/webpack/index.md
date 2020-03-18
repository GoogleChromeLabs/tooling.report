---
result: partial
---

While [html-webpack-plugin] doesn't support ingesting HTML files and passing them through Webpack to compile, it is technically possible to write a loader that accomplishes this. The APIs for doing so are largely undocumented and it requires reaching into the compiler instance from a loader, which is not advised.

[html-webpack-plugin]: https://github.com/jantimon/html-webpack-plugin
