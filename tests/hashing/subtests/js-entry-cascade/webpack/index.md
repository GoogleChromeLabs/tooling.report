---
result: pass
---

In Webpack, a changed hash for the bundle shared by multiple entries doesn't in turn change those entries' bundle hashes. While this may seem like a bug at first, the entry bundles don't actually contain any reference to the shared dependency bundle, and thus their contents do not change when a shared dependency is updated. This is because Webpack does not include entry dependency bundle references in entry bundles or its runtime bundle loader, but rather assumes the requisite script loading will be handled by a tool like [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin).

Webpack 5 will include a way to specify shared dependencies to load when loading an entry bundle, which may change whether it passes or bypasses this particular test.
