---
result: pass
---

Webpack provides two plugins, [DefinePlugin] and [EnvironmentPlugin], both of which inline variables or expressions to during compilation. DefinePlugin allows specifying global constants to be inlined, whereas EnvironmentPlugin accepts a list of environment variables whose value should be inlined anywhere `process.env.*` is used.

[defineplugin]: https://webpack.js.org/plugins/define-plugin/
[environmentplugin]: https://webpack.js.org/plugins/environment-plugin/
