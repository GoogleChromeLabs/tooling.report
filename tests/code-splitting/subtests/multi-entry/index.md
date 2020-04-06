---
title: Multiple entry points
importance: 1
shortDesc: 'Does the library split out a shared bundle?'
---

Imagine you had an "index" page and a "profile" page, each with their own script. Both scripts happen to make use of a large common library. Instead of being bundled into each page's script, the library should be split out into a bundle shared by both.

This reduces total JavaScript size and enables the common code to to be loaded from the cache.

**index.js**

```js
import { logCaps } from './utils.js';
import { exclaim } from './exclaim.js';
logCaps(exclaim('This is index'));
```

**profile.js**

```js
import { logCaps } from './utils.js';
logCaps('This is profile');
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

The result should be three scripts: One for "index", one for "profile", and one for the `logCaps` function they both need.
