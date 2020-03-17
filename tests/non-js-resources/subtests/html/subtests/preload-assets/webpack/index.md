---
result: pass
---

The standard plugin for handling HTML in Webpack's ecosystem is [html-webpack-plugin], which allows templating of HTML files based on Webpack's output modules and assets. [preload-webpack-plugin] and [resource-hints-webpack-plugin] can be used to inject `<link rel=preload>` for generated assets, and both support customizing the preload `as=""` value by file extension.

[html-webpack-plugin]: https://github.com/jantimon/html-webpack-plugin
[preload-webpack-plugin]: https://github.com/GoogleChromeLabs/preload-webpack-plugin
[resource-hints-webpack-plugin]: https://github.com/jantimon/resource-hints-webpack-plugin
