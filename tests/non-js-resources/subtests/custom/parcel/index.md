---
result: pass
---

A custom [Transformer](https://v2.parceljs.org/plugin-system/transformer/) plugin can be used to wrap the binary data in a custom JavaScript class. The binary data is converted to a Base64 string to be inlined into a generated module. In the generated module, the Base64 string is passed through a function that converts it back to binary, then passed to our `CustomType` constructor and exported. The helper function and `CustomType` class are imported from a file on disk, enabling them to be inlined or deduped like any other module.
