---
title: Hash ignores parent directories
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

If the `src` folder is renamed, output hashing should remain the same.

If paths external to the project influence hashing, then minor changes to your CI set-up can invalidate caching on all your files.
