---
title: Splitting modules between dynamic imports
importance: 1
shortDesc: 'Can modules be split along their exports used by different bundles?'
---

# The Test

This test checks to see if exports from a common module can be separated when they are used exclusively by different consuming modules. In this particular variation, an entry module and a lazily-loaded module each use one of the exported objects from a third common module.

**index.js**

```js
import { foo } from './objects.js';
console.log(foo);
import('./lazy.js');
```

**lazy.js**

```js
import { bar } from './objects.js';
console.log(bar);
```

**objects.js**

```js
export const foo = { name: 'foo' };
export const bar = { name: 'bar' };
```

In this example, `index.js` only uses `foo` from `objects.js`, whereas `lazy.js` only uses `bar`.

There are a few possible outputs that could be considered ideal:

- inline `foo` into the generated bundle for `index.js`, and `bar` into the bundle for `lazy.js`
- split `objects.js` into separate bundles for `foo` and `bar`, used by the bundles for `index.js` and `lazy.js`
