---
title: Dead code elimination
importance: 1
---

**index.js**

```js
import { logCaps } from './utils.js';
logCaps(exclaim('This is index'));

function thisIsNeverCalled() {
  console.log(`No, really, it isn't`);
}
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}

export function thisIsNeverCalledEither(msg) {
  return msg + '!';
}
```

Once _production_ built, neither `thisIsNeverCalled` or `thisIsNeverCalledEither` should appear in the result.
