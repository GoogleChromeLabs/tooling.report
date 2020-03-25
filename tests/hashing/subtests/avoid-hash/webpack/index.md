---
result: partial
issue:
  - https://github.com/webpack/webpack/issues/9542
---

The generated filenames for assets handled by [file-loader] can be configured on a per-file basis by supplying a function for file-loader's `name` option, which accepts the resource path and returns a filename template to use for generating its output location. The same is true for entry modules, which can have be optionally hashed by supplying a function for `output.filename`.

In Webpack 4, hashing can't be conditionally applied to code-splitted bundles, because `output.chunkFilename` does not accept a function. While a custom "chunk name" can be specified in a special comment within `import()` statements, the filename template where hashing is controlled cannot be customized per-bundle. This [has been addressed in Webpack 5](https://github.com/webpack/webpack/issues/9542), which supports specifying a function for `output.chunkFilename` just like `output.filename`. It's worth noting that control over hashing of dependency bundles is the least important of these tests.

[file-loader]: https://webpack.js.org/loaders/file-loader/
