---
result: partial
issue: https://github.com/parcel-bundler/parcel/issues/4314
---

With the `@parcel/transformer-svgo`, Parcel will minify SVGs. However, the resulting SVG in this test case lacks the `viewPort` attribute, which will result in an unintended visual.
