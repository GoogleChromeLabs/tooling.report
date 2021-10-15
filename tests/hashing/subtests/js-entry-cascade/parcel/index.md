---
result: pass
issue:
  - url: https://github.com/parcel-bundler/parcel/issues/4303
    status: closed
    fixedSince: parcel@2.0.0-nightly.146
---

Parcel inlines `<script src>` for static dependencies, which avoids the hash cascade.
