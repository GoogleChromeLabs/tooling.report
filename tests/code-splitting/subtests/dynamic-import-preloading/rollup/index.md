---
result: pass
issue: https://github.com/rollup/rollup/issues/3700
---

The [rollup-plugin-hoist-import-deps] plugin using `<link rel="preload">` tags to preload the dependencies of a dynamically loaded module. If `<link rel="preload">` is [unsupported][link rel preload], it falls back to `fetch()`, relying on good HTTP caching headers for a performance boost.

The test case contains a more minimal variant of that plugin that shows how you can use the `renderDynamicImport` hook to take control over how dynamic imports are handled. This plugin, however, takes a couple of shortcuts when it comes to paths and cross-browser support for the sake of simplicity and readability.

[rollup-plugin-hoist-import-deps]: https://npm.im/rollup-plugin-hoist-import-deps
[link rel preload]: https://caniuse.com/#feat=link-rel-preload
