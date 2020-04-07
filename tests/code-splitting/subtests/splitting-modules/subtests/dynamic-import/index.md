---
title: Splitting modules between dynamic imports
importance: 1
shortDesc: 'Can modules be split along their exports used by different bundles?'
---

Can the build tool split a single module subsets of its exports are used in code-splitted bundles?

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

In this example, `index.js` needs `foo` from `objects.js`, whereas `lazy.js` needs `bar` from `objects.js`.

There are a few outputs that would be considered ideal:

- inline `foo` and `bar` into the generated bundles for `index.js` and `lazy.js` respectively
- split `objects.js` along export boundaries and inline `foo` and `bar` to `index.js` and `lazy.js` separately
