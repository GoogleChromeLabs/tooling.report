---
result: pass
---

In Gulp, calculation of file hashes is typically performed as the last step, after minification. As long as hashing is the last transform in the chain, hashes are calculated on final bundle/file contents.
