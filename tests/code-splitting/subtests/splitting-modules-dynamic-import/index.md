---
title: Splitting modules between dynamic imports
importance: 1
---

Can the build tool split a single module when used in different split points created via dynamic import?

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

Ideally this should inline `foo` and `bar` into the generated bundles for `index.js` and `lazy.js` respectively.
