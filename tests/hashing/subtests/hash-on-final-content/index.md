---
title: Hash on final file content
importance: 1
---

**index.js**

```js
/* This codez is copyright 2020 */
console.log('Yay');
```

Assuming the result is minified and comments are removed, changing the above comment to `2021` should not change the hash of the output file.
