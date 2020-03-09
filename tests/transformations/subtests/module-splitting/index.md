---
title: Module Splitting
importance: 1
---

**index.js**

```js
import { logCaps } from './utils.js';
logCaps('This is index');
```

**profile.js**

```js
import { logExclaim } from './utils.js';
logExclaim('This is profile');
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}

export function logExclaim(msg) {
  console.log(msg + '!');
}
```

Although the entry points `index.js` and `profile.js` import from `utils.js`, there's no crossover between what they import. The ideal output is two files, which is `index.js` with the `logCaps` function inlined, and `profile.js` with the `logExclaim` function inlined.
