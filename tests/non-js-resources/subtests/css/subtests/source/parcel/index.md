---
result: partial
issue:
  - url: https://github.com/parcel-bundler/parcel/issues/4320
    fixedSince: 2.0.0-beta.1
    status: closed
  - url: https://github.com/parcel-bundler/parcel/issues/4855
---

Parcel supports this out-of-the box via an [import with a special scheme](<https://v2.parceljs.org/configuration/plugin-configuration/#predefined-(offical)-named-pipelines>), `bundle-text:`.

However, this creates inline sourcemaps in your code, which will inflate the size of your JavaScript in production. The only way to avoid this is to disable sourcemaps altogether.
