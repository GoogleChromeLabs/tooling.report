---
title: JS import() hashing cascade
importance: 1
shortDesc: 'Do code-splitted bundle changes update the parent hash?'
---

# Introduction

[Code Splitting](/code-splitting), often using dynamic import, can be used to asynchronously load dependencies without blocking execution. This commonly used to implement lazy loading or move low priority work into idle time. Split points created this way have a parent-child relationship, where the parent bundle needs to be able to reference the code-splitted bundle so it can be loaded at runtime.

# The Test

This test bundles a single entry module that uses dynamic import to lazy-load a second module, creating a split point. The resulting two bundles both have hashed URLs that change when their contents change.

**index.js**

```js
(async function() {
  const { logCaps } = await import('./utils.js');
  logCaps('This is index');
})();
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}
```

Building once produces two JavaScript bundles: an `index.<hash>.js` entry bundle and a `utils.<hash>.js` code-splitted bundle. Modifying the contents of `utils.js` and rebuilding will update the hashed URL for the code-splitted bundle. This means the entry bundle's reference to the code-splitted bundle must be updated with its new hash, which results in the entry bundle also receiving a new hash.
