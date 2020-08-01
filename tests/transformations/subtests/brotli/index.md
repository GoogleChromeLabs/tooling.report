---
title: Brotli
shortDesc: 'Can bundles be pre-compressed with Brotli?'
---

# Introduction

Compressing data sent to the browser is a prerequisite for good loading performance, and implementing compression seldom requires architectural changes. Gzip compression is fast enough that it can be applied to all HTTP responses, but other compression algorithms are capable of further size reduction.

Many hosting providers allow supplying pre-compressed versions of assets. Build tools can generate these compressed versions automatically and using better compression, since computation is done ahead-of-time that would be too slow to do per-request.

# The Test

This test bundles three JavaScript modules, then generates Brotli-compressed versions of the resulting bundle(s) with a `.br` file extension appended.

**index.js**

```js
import { logCaps } from './utils.js';
import { exclaim } from './exclaim.js';
logCaps(exclaim('This is index'));
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}
```

**exclaim.js**

```js
export function exclaim(msg) {
  return msg + '!';
}
```

The result of the test should be one or two JavaScript bundles (depending on the build tool configuration), each with a corresponding Brotli-compressed `*.br` version. Ideally, it should be possible to specify the level of compression to apply.
