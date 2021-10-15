---
result: pass
---

A custom [Transformer](https://parceljs.org/plugin-system/transformer/) plugin can be used process and expose the binary data as desired. In this example, the binary data is converted to a Base64 string and inlined and then exposed as our own `CustomType`. The helper function and `CustomType` class are imported from a file on disk, enabling them to be inlined or deduped like any other module.
