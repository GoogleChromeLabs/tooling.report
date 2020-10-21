---
result: partial
issue: https://github.com/webpack/webpack.js.org/issues/2684
---

Webpack doesn't understand the special destructuring syntax to elimitate dead code:

```js
const { logCaps } = await import('./utils.js');
```

But it allows to manually list the exports that are used via magic comment:

```js
const { logCaps } = await import(/* webpackExports: "logCaps" */ './utils.js');
```
