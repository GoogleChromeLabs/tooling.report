---
title: Shared references between chunks
shortDesc: 'Are module exports between bundles live bindings?'
---

# The Test

The exports of an ECMAScript Module are "live" bindings. When importing a value from a module, you have a reference to it that always reflects the current value of that variable in the source module. If that value is changed, it is updated across all modules that import it. This test checks that a value imported by two different modules reflects changes to the the corresponding export in the source module. This can be a difficult case for bundlers, since the shared `num.js` module may be extracted into a separate bundle and its bindings must be reflected in other bundles.

**index.js**

```js
import { num, incrementNum } from './num.js';
incrementNum();
console.log(num);
import('./lazy.js');
```

**lazy.js**

```js
import { num, incrementNum } from './num.js';
incrementNum();
console.log(num);
```

**num.js**

```js
export let num = 0;
export function incrementNum() {
  num++;
}
```

If the test is successful, both `index.js` and `lazy.js` should log values for `num` that reflect the `num` variable in `num.js` having been incremented. The value logged by `index.js` should be `1`, followed by a value of `2` logged by `lazy.js`.
