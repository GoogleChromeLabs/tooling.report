---
result: pass
---

Webpack preserves live bindings in modules. This remains true in cases where source modules are intentionally duplicated across bundles, since only a single _instance_ of each module is ever created.
