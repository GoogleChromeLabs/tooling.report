---
result: pass
---

This example uses a custom Parcel [Transformer](https://parceljs.org/plugin-system/transformer/) plugin to convert the binary file to Base64 and inline it into a JavaScript module along with a helper to decode it at runtime. The helper is in a separate file, so it is not duplicated and can be code split.

As an alternative implementation, one could use an [Optimizer](https://parceljs.org/plugin-system/optimizer/) plugin instead, which would allow the file to be processed through the whole transforming, bundling, and optimizing phases before being inlined back into the original bundle. An example of that is in the [documentation](https://parceljs.org/features/bundle-inlining/#under-the-hood).
