---
title: Splitting modules between multiple entries
importance: 1
shortDesc: 'Can modules be split along their exports used by each entry bundle?'
---

# The Test

This test checks to see if exports from a common module can be separated when they are used exclusively by different [entry modules], avoiding a bundle being loaded that contains unused exports. In this particular variation, three entry modules each use one of two exported objects from a common module.

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

In this example, `entry-1.js` uses `foo` from `objects.js`, whereas `entry-2.js` and `entry-3.js` use `bar`.

Ideally this should result in 4 generated bundles: a bundle for `entry-1` with `foo` inlined, and bundles for `entry-2` and `entry-3` that reference a separate bundle containing only `bar`.

[entry modules]: /code-splitting/multi-entry/
