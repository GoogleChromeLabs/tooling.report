---
title: Splitting single modules
---

Can the build tool split a single module?

**entry-1.js**

```js
import { foo } from './objects.js';
console.log(foo);
```

**entry-2.js**

```js
import { bar } from './objects.js';
console.log(bar);
```

**entry-3.js**

```js
import { bar } from './objects.js';
console.log(bar, '!');
```

**objects.js**

```js
export const foo = { name: 'foo' };
export const bar = { name: 'bar' };
```

In this example, `entry-1.js` needs `foo` from `objects.js`, whereas `entry-2.js` and `entry-3.js` need `bar` from `objects.js`.

Ideally this should produce 4 output files. `entry-1` should have `foo` inlined. `entry-2` and `entry-3` should reference a split module which contains only `bar`.
