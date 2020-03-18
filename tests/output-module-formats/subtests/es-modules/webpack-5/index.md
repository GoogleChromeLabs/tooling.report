---
result: fail
---

Webpack 5 has an experimental new JavaScript Modules output format, however this format does not leverage the module system for exports or code loading. At present, the new output format removes the enclosing function around Webpack bundles and changes the default minifier configuration to allow mangling of top-level identifiers.

In the future, Webpack could add an output mode that leverages JavaScript Modules for code loading and export sharing, similar to the current CommonJS-based runtime used when compiling for a [Node target](https://webpack.js.org/configuration/target/).
