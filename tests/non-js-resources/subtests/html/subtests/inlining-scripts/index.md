---
title: Inlining scripts
importance: 1
---

Imagine you had an 'index' page and a 'profile' page. Each has their own root script, but the two make use of a common library.

**index.js**

```js
import { logCaps } from './utils.js';
import { exclaim } from './exclaim.js';
logCaps(exclaim('This is index'));
import('./lazy.js');
```

**exclaim.js**

```js
export function exclaim(msg) {
  return msg + '!';
}
```

**profile.js**

```js
import { logCaps } from './utils.js';
logCaps('This is profile');
import('./lazy.js');
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}
```

**lazy.js**

```js
console.log('Totally lazy');
```

Can HTML files be output where `index.html` contains, inlinined, all static imports (but not dynamic imports). Whereas `profile.html` will continue to use external scripts. Both pages must reference the same `lazy.js`.
