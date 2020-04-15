---
result: pass
---

Rollup extracts shared dependencies of entry modules into common bundles. Changing a shared dependency updates its bundle's hashed URL, which means any entry bundles that reference that URL are also updated with newly hashed URLs.
