---
result: pass
---

Webpack's [`"asset/resource"` module type ](https://webpack.js.org/guides/asset-modules/#resource-assets) allows referencing any file via `new URL`. This adds the referenced asset to the dependency graph and emits it to disk, replacing `new URL` references with the corresponding generated asset URLs.
