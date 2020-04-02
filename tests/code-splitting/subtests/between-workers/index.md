---
title: Between workers
importance: 1
---

Workers are a great way to avoid janking the UI. However, your worker will often share bits of code with the main thread, and other workers. Can the build tool manage this?

**index.js**

```js
import workerURL from 'get-worker-url-somehow';
import { logCaps } from './utils.js';

new Worker(workerURL);
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

The result should be three scripts: One for 'index', one for 'worker', and one for shared things.

Since few browsers support ECMAScript modules in workers, and no browsers support ECMAScript modules in service workers, a custom module format or loader must be used to pass this test.

Additionally, the worker URL must be hashed.
