---
result: fail
---

In rollup, code-splitted dependency bundle starts loading after the consuming bundle has been loaded.

In other words, it would start loading the dependency of an asynchronous module only after the dependency bundle has been discovered while executing that asynchronous module.
