---
result: fail
issue:
  - https://github.com/parcel-bundler/parcel/issues/4319
  - url: https://github.com/parcel-bundler/parcel/issues/4303
    status: closed
    fixedSince: parcel@2.0.0-nightly.146
---

Apart from the issues encountered in `code-splitting/multi-entry`, parcel does split out common dependencies above a certain size threshold, but does not split the dependencies themselves.
