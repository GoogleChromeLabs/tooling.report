---
result: pass
---

Webpack does not transpile JavaScript by default, however this can be configured via [babel-loader]. It's important to set `@babel/transform-runtime`'s [useESModules option](https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules) to `true` in order to include only necessary polyfills.

[babel-loader]: https://github.com/babel/babel-loader
