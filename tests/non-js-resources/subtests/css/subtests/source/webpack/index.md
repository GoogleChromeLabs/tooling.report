---
result: pass
---

[css-loader] processes imported CSS files, which can then be passed through [extract-loader] to obtain the stylesheet text as a string. Setting the module's `type` option to `"asset/source"` will embed this into the bundle.

[css-loader]: https://webpack.js.org/loaders/css-loader/
[extract-loader]: https://github.com/peerigon/extract-loader
