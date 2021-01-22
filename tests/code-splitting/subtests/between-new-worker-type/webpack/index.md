---
result: partial
---

It's possible to extend webpack's integrated Web Worker support to new or custom Worker types, as long as `importScripts()` is supported.

This makes it possible to bundle code for use in new worker-like environments like Worklets. Code splitting between the "host" and "child" sets of bundles is also supported. Currently, bundles are loaded using `importScripts()`, which means code splitting cannot be used with [Module Workers] or Worklets.

[module workers]: https://web.dev/module-workers
