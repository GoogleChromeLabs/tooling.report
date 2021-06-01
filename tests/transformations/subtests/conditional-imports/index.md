---
title: Conditional Imports
---

**index.js**

```js
if (IS_SERVER) {
  import('./server.js');
}
```

**server.js**

```js
import { createServer } from 'http';
createServer((req, res) => {
  res.end("Hello");
}).listen(0);
```

When built with `IS_SERVER` defined as `false`, the import for `server.js` must be ignored excluded from bundling.
