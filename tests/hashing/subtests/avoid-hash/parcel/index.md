---
result: pass
issue:
  - url: https://github.com/parcel-bundler/parcel/issues/4553
    status: closed
---

Parcel does not include hashes in the URLs of HTML files and Service Workers by default.

Namer plugins control the naming of bundles and can also be used to selectively overriding names by returning `null` to defer to the default namer.
