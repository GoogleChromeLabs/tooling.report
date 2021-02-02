---
result: pass
---

When importing assets using `new URL`, Webpack creates a small intermediary module that exports the hashed asset URL. The intermediary module gets concatenated into bundles alongside any module that imports it. This means that any changes to the hashed URL in a bundle also cause the hashed URL of that bundle to change.
