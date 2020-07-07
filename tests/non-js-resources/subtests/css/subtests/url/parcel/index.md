---
result: fail
issue:
  - url: https://github.com/parcel-bundler/parcel/issues/4320
    fixedSince: 2.0.0-beta.1
    status: closed
  - url: https://github.com/parcel-bundler/parcel/issues/4856
---

Parcel supports this out-of-the box via an [import with a special scheme](<https://v2.parceljs.org/configuration/plugin-configuration/#predefined-(offical)-named-pipelines>), `url:`.

However, there's a bug in the implementation that causes it to fail with CSS.
