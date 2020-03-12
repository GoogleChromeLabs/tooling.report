---
result: pass
---

Webpack's `[contenthash]` hashing is based on the file contents, which means hashes only change when the resulting output can differ. Directory names are not included in the file's contents, so they do not affect its hash.
