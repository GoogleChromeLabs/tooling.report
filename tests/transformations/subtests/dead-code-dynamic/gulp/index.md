---
result: fail
issue: 'N/A'
---

(This test uses Browserify) `tinyify` is a browserify plugin that runs various optimizations which includes dead code elimination; however, it does not eliminate dead code from dynamically imported module this is because Browserify does not support dynamic require.
