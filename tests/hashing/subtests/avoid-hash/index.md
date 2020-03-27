---
title: Avoiding hashing for a particular resource
importance: 1
---

Including content hashes in URLs is beneficial for effective caching, however there are certain resources that should not have hashed URLs. Files like `robots.txt`, `index.html` and Service Workers can't have hashes in their URLs, because their URLs must always remain the same.

This test assesses whether a build tool can enable or disable URL hashing for specific assets, entry bundles and code-splitted bundles.

**hashed-entry.js**

```js
import hashedUrl from './hashed-asset.txt';
import unhashedUrl from './unhashed-asset.txt';
console.log(hashedUrl, unhashedUrl);

import('./hashed-chunk.js');
import('./unhashed-chunk.js');
```

**unhashed-entry.js**

```js
console.log('Unhashed entry');
```

**hashed-asset.txt**

```
Hashed asset
```

**unhashed-asset.txt**

```
Unhashed asset
```

**hashed-chunk.js**

```js
console.log('Hashed chunk');
```

**unhashed-chunk.js**

```js
console.log('Unhashed chunk');
```

Bundling both entries modules should produce 6 files. The 3 "hashed"-prefixed files should have hashes, and the 3 "unhashed"-prefixed files should not have hashes.
