---
title: Shared objects between entry points
---

Can multiple entry points be safely used on a single page?

Sometimes an HTML file contains a single entry point, but sometimes entry points are per-component. Does the build correctly share objects between entry points?

```html
<!DOCTYPE html>
<script src="component-1.js"></script>
<script src="component-2.js"></script>
```

**component-1.js**

```js
import obj from './obj.js';
obj.count++;
console.log('component-1', obj.count);
```

**component-2.js**

```js
import obj from './obj.js';
obj.count++;
console.log('component-2', obj.count);
```

**obj.js**

```js
export default { count: 0 };
```

The logged output should be:

```
component-1 1
component-1 2
```
