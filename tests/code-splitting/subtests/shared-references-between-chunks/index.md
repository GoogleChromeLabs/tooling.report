---
title: Shared references between chunks
importance: 1
---

When you import a value in ES modules, you have a reference to it. If you update the value, the value is updated across modules that import it.

**index.js**

```js
import num from './num.js';
num++;
console.log(num);
import('./lazy.js');
```

**lazy.js**

```js
import num from './num.js';
num++;
console.log(num);
```

**num.js**

```js
export default 0;
```

The logged output should be:

```
1
2
```
