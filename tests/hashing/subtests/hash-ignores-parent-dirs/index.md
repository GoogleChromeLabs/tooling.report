---
title: Hash ignores parent directories
importance: 1
shortDesc: 'Are URL hashes resilient to path changes?'
---

## Introduction

Generating hashes for URLs based on file paths can result in unintentional cache invalidation when directory paths change between builds. This is commonly seen in Continuous Integration workflows that perform builds in a different directory on each run, or due to otherwise unrelated configuration changes.

# The Test

This test runs a build twice using the same configuration and source, but with a differing path to the entry module (`src1/index.js`, then `src2/index.js`).

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

The result of both builds should be functionally identical, which means both builds should produce the same hashed URLs.
