---
result: pass
---

Webpack supports CommonJS output by setting the `target` configuration option to `"node"`.

It's worth noting that Webpack's CommonJS output does not directly use `require()` or `module.exports`. Rather, the files are standard Webpack bundles that use `require()` for script loading and `module.exports` in place of the global Webpack registry. From the outside, this appears as standard CommonJS, but any code-splitted or internal modules can only be consumed by Webpack-based entry modules.
