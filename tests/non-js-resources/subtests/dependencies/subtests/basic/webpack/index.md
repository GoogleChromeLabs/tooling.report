---
result: pass
---

Webpack's [css-loader] parses CSS and generates a JavaScript module that exports the CSS stylesheet as a String. Any subresources are converted into dependency imports, which means CSS subresources follow the semantics of JavaScript dependencies.

[css-loader]: https://github.com/webpack-contrib/css-loader
