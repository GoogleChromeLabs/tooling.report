---
result: pass
---

[css-loader] processes imported CSS files, which can then be passed through [extract-loader] to obtain the stylesheet text as a String. With webpack module type `asset/source` this string can be embedded as raw content in the bundle.

[css-loader]: https://webpack.js.org/loaders/css-loader/
[extract-loader]: https://github.com/peerigon/extract-loader
