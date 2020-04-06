---
result: partial
issue: https://github.com/parcel-bundler/parcel/issues/4320
---

Parcel supports importing CSS stylesheets as Strings using `@parcel/transformer-inline-string`. The resulting CSS is minified and inlined into the JavaScript bundle.

The test gets a partial pass as `@parcel/transformer-inline-string` is currently completely undocumented.
