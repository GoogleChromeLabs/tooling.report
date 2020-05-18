---
title: Avoiding hashing for a particular resource
importance: 1
shortDesc: 'Can URL hashing be selectively disabled?'
---

# Introduction

Including content hashes in URLs is beneficial for effective caching, however there are certain resources that should not have hashed URLs. Files like `robots.txt`, `index.html` and Service Workers can't have hashes in their URLs, because their URLs must always remain the same.

# The Test

This test builds multiple resources with configuration to control URL hashing for each. It assesses whether a build tool can selectively hash URLs for specific assets, entry bundles and code-splitted bundles.

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

Bundling both entries modules should produce 6 files. The 3 files with "hashed" in their names should generate hashed URLs, whereas the 3 files with "unhashed" in their names should generate URLs with no hashes.
