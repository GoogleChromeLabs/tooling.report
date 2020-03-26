---
result: pass
issue:
  - https://github.com/parcel-bundler/parcel/issues/4304
fixed-issue:
  - fixed: parcel@2.0.0-nightly.146
    url: https://github.com/parcel-bundler/parcel/issues/4303
---

When multiple HTML files are passed to Parcel for processing, the scripts in each page have their common dependency modules extracted into shared bundles.
