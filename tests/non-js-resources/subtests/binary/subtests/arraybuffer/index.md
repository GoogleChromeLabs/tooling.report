---
title: Array buffer
importance: 1
shortDesc: 'Import a binary file as an array buffer'
---

# The Test

In cases where a small amount of arbitrary binary data needs to be available synchronously within a module, it can be advantageous to inline the data into the JavaScript bundle. This test bundles a module that imports a binary file, expecting an ArrayBuffer as the result of the import.

```js
import buffer from 'import-binary-somehow';
console.log(buffer.byteLength);
```

The build result should be a single JavaScript bundle containing the binary, which should be encoded in an efficient text format like base64.
