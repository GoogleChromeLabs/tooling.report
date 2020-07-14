---
result: fail
issue:
  - url: https://github.com/parcel-bundler/website/issues/631
  - url: https://github.com/parcel-bundler/website/issues/630
  - url: https://github.com/parcel-bundler/parcel/issues/4890
---

Parcel lets you set [targets](https://v2.parceljs.org/configuration/package-json/#targets) in your `package.json` to influence how your project is built, including an 'esmodule' setting.

This will change the target browsers to the ones that support ECMAScript modules, but that doesn't include browsers that support dynamic `import()`. By default Parcel will include a polyfill, unless you set the [`browserslist`](https://v2.parceljs.org/configuration/package-json/#engines-%2F-browserslist) to browsers that support `import()`.

However, Parcel will duplicate modules that are imported by multiple entry points. If those modules contain state, which is common for caching, counters, bookkeeping etc, then that state will become out of sync.
