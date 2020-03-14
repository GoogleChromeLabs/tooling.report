---
result: pass
---

Although the same approach could be taken here as in the binary test, in this case we'll write a custom loader since we want to tailor the output. The binary data passed to our loader is converted to a Base64 string to be inlined into a generated module. In the generated module, the Base64 string is passed through a function that converts it back to binary, then passed to our `CustomType` constructor and exported. The helper function and `CustomType` class are imported from a file on disk, enabling them to be inlined or deduped like any other module.
