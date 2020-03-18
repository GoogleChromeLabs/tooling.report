---
result: pass
---

The generated filenames for assets handled by [file-loader] can be configured on a per-file basis by supplying a function for file-loader's `name` option, which accepts the resource path and returns a filename template to use for generating its output location. The same is true for entry modules, which can have be optionally hashed by supplying a function for `output.filename`.

In Webpack 4, hashing can't be conditionally applied to code-splitted bundles, because the generated filenames are goverened by `output.chunkFilename` which does not accept a function. A custom "chunk name" can be specified in a special comment within the `import()` statement, however the filename template itself cannot be changed on a per-usage basis. This [has been addressed in Webpack 5](https://github.com/webpack/webpack/issues/9542), which will allow supplying a function for `output.chunkFilename` just like `output.filename`.

[file-loader]: https://webpack.js.org/loaders/file-loader/
