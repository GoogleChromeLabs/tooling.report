---
title: Asset hash cascading
importance: 1
---

# Introduction

When including hashes in the URLs of non-JavaScript assets, it's often necessary to reference those URLs from JavaScript. When the contents of an asset are changed - an image updated or text content changed - it's hashed URL also changes. If a JavaScript bundle references that asset's URL, it's important that the bundle's hashed URL is also updated, since it must now be compiled with the updated hash of its asset "dependency".

# The Test

This test compiles an asset and a JavaScript module containing a reference to it, both configured to produce hashed URLs. The test is run twice to simulate changing the contents of `some-asset.txt` (replacing the "." with "!").

**index.js**

```js
import txtUrl from './some-asset.txt';
console.log(txtUrl);
```

**some-asset.txt**

```js
This is an asset.
```

Bundling the above should produce two files with hashes in their names, like `bundle.12345.js` and `some-asset.54321.txt`. A second build after changing the contents of `some-asset.txt` should generate two _new_ files with new hashes.
