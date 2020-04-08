---
title: Shared references between chunks
importance: 1
shortDesc: 'Are module exports between bundles live bindings?'
---

When you import a value in ES modules, you have a reference to it. If that value is updated, the value is updated across modules that import it.

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

The logged output should be:

```
1
2
```
