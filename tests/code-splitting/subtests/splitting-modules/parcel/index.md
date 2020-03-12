---
result: fail
issue:
  - https://github.com/parcel-bundler/parcel/issues/4319
  - https://github.com/parcel-bundler/parcel/issues/4303
---

Apart from the issues encountered in `code-splitting/multi-entry`, parcel does split out common dependencies above a certain size threshold, but does not split the module itself.
