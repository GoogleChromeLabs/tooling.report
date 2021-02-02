---
result: pass
---

Using `new Worker(new URL("./worker", import.meta.url))` will create a worker that is able to share dependencies with the main bundle (and other worker bundles).
