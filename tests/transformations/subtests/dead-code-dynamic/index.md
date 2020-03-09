---
title: Dead code elimination
importance: 1
---

**index.js**

```js
(async function() {
  const { logCaps } = await import('./utils.js');
  logCaps('This is index');
})();
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}

export function thisIsNeverCalled(msg) {
  return msg + '!';
}
```

Once _production_ built, `thisIsNeverCalled` should not appear in the result.
