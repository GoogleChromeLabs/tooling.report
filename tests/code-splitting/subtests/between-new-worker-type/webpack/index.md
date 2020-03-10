---
result: fail
---

Bundling Web Workers is possible in Webpack using one of the many add-ons like [worker-loader] or [worker-plugin], however there is no documented solution for accessing the underlying behavior: compiling a new entry starting from a given module and returning its bundle URL. There have been [some](https://github.com/webpack-contrib/worker-loader/pull/159) [attempts](https://github.com/webpack-contrib/worker-loader/pull/227) to support this in worker-loader, but at present the only available solution is [worker-plugin/loader]:

```js
import workerUrl from 'worker-plugin/loader!./my-worker';
new Worker(workerUrl);
```

This makes it possible to bundle code for use in new worker-like environments like Worklets, however code splitting between the "host" and "child" sets of bundles is still not supported.

[worker-loader]: https://github.com/webpack-contrib/worker-loader
[worker-plugin]: https://github.com/GoogleChromeLabs/worker-plugin
[worker-plugin/loader]: https://github.com/GoogleChromeLabs/worker-plugin#loader
