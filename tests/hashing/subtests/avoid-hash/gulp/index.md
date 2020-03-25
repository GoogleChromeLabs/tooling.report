---
result: pass
---

Since separate Gulp tasks can be defined for individual source files, it's possible to separately control the URL hashing for each. In this case `index.html` is not passed through the hashing task, so its URL is not hashed.
