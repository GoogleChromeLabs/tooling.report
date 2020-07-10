---
result: partial
issue:
  - url: https://github.com/parcel-bundler/parcel/issues/4320
    fixedSince: 2.0.0-beta.1
    status: closed
---

Parcel supports this out-of-the box via an [import with a special scheme](<https://v2.parceljs.org/configuration/plugin-configuration/#predefined-(offical)-named-pipelines>), `data-url:`.

However, this only works in JavaScript imports. If you try and use it in HTML: `<img src="data-url:./img.png">`, the src is replaced with an internal identifier.
