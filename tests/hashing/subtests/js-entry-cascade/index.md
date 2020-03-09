---
title: JS entry-point hashing cascade
importance: 1
---

**index.js**

```js
import { logCaps } from './utils.js';
logCaps('This is index');
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

Assuming `index.js` and `profile.js` are entry points, and the above is code-split into three files, does changing the contents of `utils.js` (which changes the file name hash) also change the hashes of `index.js` and `profile.js`?
