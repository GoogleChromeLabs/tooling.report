---
result: partial
issue: https://github.com/rollup/rollup/issues/3700
---

Rollup has a `renderDynamicImport` hook that allows you to take control over how dynamic imports are handled. The plugin in the test case uses this hook to inject `<link rel="preload">` tags for each dependency of the dynamically loaded module. However, the plugin takes a couple of shortcuts when it comes to path handling and cross-browser support, as these details are tough to get right.

There is a community plugin called [rollup-plugin-hoist-import-deps] which aims to do the right thing. It uses `<link rel="preload">` tags to preload the dependencies of a dynamically loaded module. If `<link rel="preload">` is [unsupported][link rel preload], it falls back to `fetch()`, relying on good HTTP caching headers for a performance boost. However, the plugin did not generate working code when used in the test case.

Because it is quite hard to get a plugin like this right (see this [Rollup issue]), this test is scored as a partial pass for Rollup.

[rollup-plugin-hoist-import-deps]: https://npm.im/rollup-plugin-hoist-import-deps
[link rel preload]: https://caniuse.com/#feat=link-rel-preload
[rollup issue]: https://github.com/rollup/rollup/issues/3700
