---
title: Preloading script dependencies
importance: 1
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

**help.js**

```js
import { logCaps, strongEm } from './utils.js';
logCaps(strongEm('This is help'));
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

Generate (or use as entry points) 3 HTML pages: `index.html`, `profile.html`, `help.html`, which load `index.js`, `profile.js`, and `html.js` respectively.

Each page should include preloads for the scripts it immediately needs, but not lazy-loaded dependencies.
