---
title: Between new worker type
importance: 1
---

This test is similar to the 'between-workers' test. However, some bundlers solve workers on a case-by-case basis, and take a long time to catch up with new worker types, or new worker arguments. This tests a lower-level capability: If a new worker type comes along, can you use it without having to wait for the a new release of your build tool and still make use of code-splitting?

**index.js**

```js
import workerURL from 'get-worker-url-somehow';
import { logCaps } from './utils.js';

new InterestingNewWorkerType(workerURL);
logCaps('This is index');
```

**worker.js**

```js
import { logCaps } from './utils.js';
logCaps('This is worker');
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}
```

The expected output here is that `utils.js` gets split out into its own chunk.
