---
result: fail
issue:
  - https://github.com/parcel-bundler/parcel/issues/4303
---

Parcel has problems with chunking out common dependencies (see `code-splitting/multi-entry`). Once those are fixed, Parcel correctly recalculates hashes when using ES modules or when using their own module format, uses a module registry that avoids the cache invalidation cascade alltogether.
