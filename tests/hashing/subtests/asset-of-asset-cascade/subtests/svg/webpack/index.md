---
result: pass
---

There are a few different ways to write a Webpack loader that bring new asset types into the dependency graph. The simplest is to convert the resource into a JavaScript module that exports it as a String with interleaved `require()` or `import` statements for the asset's dependencies. This often requires re-extracting the string back to its raw form in order to write it to disk, so it can be cleaner to instead use the [loadModule() API](https://webpack.js.org/api/loaders/#thisloadmodule) to bring dependencies into the graph and evaluate them as part of processing the asset. One slightly non-public API required to make this work is reaching into the generated module's asset information exposed under `module.buildInfo.assets` to obtain its hashed URL.
