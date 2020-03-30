---
result: pass
---

Webpack defaults to production mode as of version 4, which enables optimizations including minification. It's recommended to explicitly indicate which mode Webpack should run in to ensure consistency via the command line `-p` and `-d` flags, or by setting the `mode` configuration option to `"production"` or `"development"`. By default, Webpack minifies code using [Terser] with a set of conservative defaults, avoiding some optimizations that would break commonly used syntax.

One area where Webpack's output minification could be improved is that Terser's scope analysis cannot cross the module boundaries present in Webpack bundles, which includes the runtime. This means that, while a bundle may not actually use parts of a module or Webpack's runtime, Terser cannot infer this and the code is not removed. The impact of this on Webpack's runtime code is primarily a fixed cost since there is only one runtime, however the impact on bundled modules is less clear.

[terser]: https://terser.org
