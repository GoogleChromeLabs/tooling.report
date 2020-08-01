---
title: Asset hash cascading
shortDesc: When JS depends on an asset, and the asset is changed, are the hashes correctly updated?
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

Bundling the above should produce two files with hashes in their names, like `bundle.12345.js` and `some-asset.54321.txt`. When the contents of `some-asset.txt` are changed and the project is rebuilt, the hash must be different in _both_ output files.
