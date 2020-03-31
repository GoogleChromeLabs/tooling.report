---
title: Flags
importance: 1
---

Applications often make use of flags, which are essentially values that are inlined into code at build-time. In many cases, it's important that these value are inlined prior to bundling. This is particularly important for conditional flags that affect control flow, since these can determine which modules end up being bundled.

**index.js**

```js
if (IS_SERVER) {
  console.log('This is running on the server');
} else {
  console.log('This is running on the client');
}
```

To pass the test, `IS_SERVER` must evaluate to `true`/`false`, and the if statement must be eliminated from the output code, leaving only the relevant log.
