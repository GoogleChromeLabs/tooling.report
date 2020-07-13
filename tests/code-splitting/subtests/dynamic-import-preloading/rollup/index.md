---
result: fail
---

Rollup starts loading the dependency of a dynamically loaded module only after module has been loaded.

In other words, it would start loading the dependency of an asynchronous module only after it has been discovered while executing that module.
