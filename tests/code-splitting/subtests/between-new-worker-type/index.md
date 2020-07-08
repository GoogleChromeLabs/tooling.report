---
title: Between new worker type
shortDesc: 'Can entry bundles be created for other contexts?'
---

# Introduction

There are a number of different scenarios where it's necessary to bundle some code separately for a different JavaScript context. Web Workers are perhaps the most popular case, however the same underlying functionality is necessary in order to bundle code for use in [Service Workers], [Module Workers] and [Worklets]. Since many tools apply special handling to Web Workers, it can take time to catch up with new worker variants.

# The Test

This test checks that it's possible to reuse the underlying functionality of [code splitting between workers](/code-splitting/between-workers) for new or custom context types, without having to wait for a new release of the build tool. Effectively, it tests that it's possible to create an entry point and obtain its bundled URL at runtime.

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

The result of bundling these modules should be two or three files: one bundle for the main thread and one for the worker thread, and ideally a shared bundle for the `logCaps` utility method that can be used by both bundles.

[worklets]: https://developer.mozilla.org/en-US/docs/Web/API/Worklet
[service workers]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[module workers]: https://web.dev/module-workers
