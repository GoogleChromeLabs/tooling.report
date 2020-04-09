---
title: Dynamic import
importance: 1
shortDesc: 'Can split points be created using dynamic import?'
---

Can you force a code split using dynamic import? This puts the developer in control over the split point, and load time. This can be used to prioritise 'first interaction' script over other script.

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

The result should be two scripts: One for 'index', one for 'utils'.
