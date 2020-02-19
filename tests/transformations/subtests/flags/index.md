---
title: Flags
---

Can a flag be set at build time and used within modules?

**index.js**

```js
if (IS_SERVER) {
  console.log('This is running on the server');
} else {
  console.log('This is running on the client');
}
```

To pass the test, `IS_SERVER` must evaluate to `true`/`false`, and the if statement must be eliminated from the output code, leaving only the relevant log.
