---
title: URL
importance: 1
shortDesc: 'Import a binary file as an asset URL'
---

# Introduction

Binary files are often large, and representing them as text can be inefficient. When an application imports a large binary file, it often makes more sense to load that data from a URL rather than [inlining it into the JavaScript bundle](/non-js-resources/binary/arraybuffer).

# The Test

This test bundles a JavaScript module that imports a large binary file, expecting the result of the import to be a URL. That URL should be usable for loading the binary data using `fetch(url)` or some other method.

**index.js**

```js
import binURL from './binary.bin';
fetch(binURL).then(async r => {
  console.log(await r.arraybuffer());
});
```

**binary.bin**

```
<binary data>
```

The built result should be a copy of `binary.bin` with a [hashed URL](/hashing/), and a JavaScript bundle that passes the hashed URL of `binary.bin` to `fetch()`.
