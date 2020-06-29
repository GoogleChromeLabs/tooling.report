---
result: pass
issue:
  - url: https://github.com/parcel-bundler/parcel/issues/4304
  - fixedSince: parcel@2.0.0-nightly.146
    url: https://github.com/parcel-bundler/parcel/issues/4303
    status: closed
---

When multiple HTML files are passed to Parcel for processing, the scripts in each page have their common dependency modules extracted into shared bundles if the shared module is greater than 30kb.

If the shared module is less than 30kb, it's duplicated in each entry point. There's no documented way to configure this threshold.
