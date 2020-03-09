---
title: Multiple entry points
importance: 1
---

Imagine you had an 'index' page and a 'profile' page. Each has their own root script, but the two make use of a common library.

**index.js**

```js
import { logCaps } from './utils.js';
import { exclaim } from './exclaim.js';
logCaps(exclaim('This is index'));
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
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}
```

The result should be three scripts: One for 'index', one for 'profile', and one for shared things.
