---
result: pass
---

CSS files processed using [css-loader] can be passed through [extract-loader] to obtain the stylesheet text as a string. Setting the module's `type` option to `"asset/resource"` makes it possible to obtain the URL for the stylesheet asset using `new URL('./x.css', import.meta.url)` or `import url from './x.css'`.

[css-loader]: https://webpack.js.org/loaders/css-loader/
[extract-loader]: https://github.com/peerigon/extract-loader
