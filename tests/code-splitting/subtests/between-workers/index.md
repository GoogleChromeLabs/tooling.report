---
title: Between workers
importance: 1
shortDesc: 'Can bundles be shared between the main thread and workers?'
---

# Introduction

[Web Workers] are great for moving long blocking work and large modules [off the main thread], keeping UI updates fast and smooth. In many cases, code running in a worker will need to rely on some of the same modules as code used on the main thread or in other workers.

# The Test

This test checks to see if it's possible to share modules between Web Workers and the main thread, or between multiple workers. Since few browsers support [ECMAScript modules in workers][module-workers], a custom module format or runtime module loader is necessary in order to pass this test.

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

The result should be three scripts: one for the main thread containing `index.js`, one for the worker containing `worker.js`, and one for the dependencies shared by both (`logCaps()`). As with other bundle URL tests, the worker's URL must be hashed.

[web workers]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
[off the main thread]: https://web.dev/off-main-thread/
[module-workers]: https://web.dev/module-workers/
