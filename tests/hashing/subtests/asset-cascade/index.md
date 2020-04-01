---
title: Asset hash cascading
importance: 1
---

Hashed URLs are useful for non-JavaScript assets, but it's often necessary to expose those hashed asset URLs to JavaScript. When the contents of an asset are changed - an image updated or text content changed - it's hashed URL changes. If there's a JavaScript bundle referencing that asset's URL, it's important that the bundle's hashed URL is also updated, since it must now be compiled with the updated hash of its asset "dependency".

<!-- TODO: diagram -->

**index.js**

```js
import txtUrl from './some-asset.txt';
console.log(txtUrl);
```

**some-asset.txt**

```js
This is an asset.
```

Bundling the above should produce two files with hashes in their names, like `bundle.12345.js` and `some-asset.54321.txt`. Now, if we modify the contents of `some-asset.txt` (perhaps by replacing the "." with "!"), the generated output should be two _new_ files with new hashes.
