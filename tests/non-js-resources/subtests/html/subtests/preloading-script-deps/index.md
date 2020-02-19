---
title: Preloading script dependencies
---

**index.js**

```js
import { logCaps, strongEm } from './utils.js';
logCaps(strongEm('This is index'));

setTimeout(async () => {
  const { exclaim } = import('./index-exclaim.js');
  logCaps(exclaim('This is still index'));
}, 10000);
```

**index-exclaim.js**

```js
export function exclaim(msg) {
  return msg + '!';
}
```

**profile.js**

```js
import { em } from './more-utils.js';
console.log(em('This is profile'));
```

**utils.js**

```js
import { em } from './more-utils.js';

export function logCaps(msg) {
  console.log(msg.toUpperCase());
}

export function strongEm(msg) {
  return '===' + em(msg) + '===';
}
```

**more-utils.js**

```js
export function em(msg) {
  return '***' + msg + '***';
}
```

Can HTML be generated that loads 'index', plus a preload for scripts it immediately needs ('utils', 'more-utils'), but not for lazily loaded dependencies ('index-exclaim').
