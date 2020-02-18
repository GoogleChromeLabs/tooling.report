---
title: Between new worker type
---

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

This is similar to the 'between-workers' test. However, some bundlers solve workers on a case-by-case basis, and take a long time to catch up with new worker types, or new worker arguments. This tests a lower-level capability: Can you make an entry point and get its URL?
