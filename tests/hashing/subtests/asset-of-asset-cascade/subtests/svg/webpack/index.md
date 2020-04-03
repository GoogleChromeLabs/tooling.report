---
result: partial
issue: https://github.com/webpack/webpack.js.org/issues/3672
---

There are a few different ways to write a Webpack loader that bring new asset types into the dependency graph. The simplest is to convert the resource into a JavaScript module that exports it as a String with interleaved `require()` or `import` statements for the asset's dependencies. This often requires re-extracting the string back to its raw form in order to write it to disk, so it can be cleaner to instead use the [loadModule() API](https://webpack.js.org/api/loaders/#thisloadmodule) to bring dependencies into the graph and evaluate them as part of processing the asset.

An undocumented API (`module.buildInfo.assets`) is required to get the generated module's hashed URL, so this is a 'partial' pass.
