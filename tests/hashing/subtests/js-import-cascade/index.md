---
title: JS import() hashing cascade
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
```

Does changing the contents of `utils.js` (which changes the file name hash) also change the hash of `index.js`?
