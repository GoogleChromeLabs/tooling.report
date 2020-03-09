---
result: pass
---

Rollup plugins are simple to write. In this case, a module was generated that exports the file as a base64 string, wrapped in a function that converts base64 to an array buffer. The function that does the conversion is in a virtual module, so it isn't duplicated, and can be code-split.
