---
title: Flags
importance: 1
---

Applications often make use of flags, which are values set at build-time. Evaluating these values prior to bundling enables many useful optimizations. For example, flags can make certain code paths unreachable, allowing modules to be pruned from the dependency tree.

**index.js**

```js
if (IS_SERVER) {
  console.log('This is running on the server');
} else {
  console.log('This is running on the client');
}
```

To pass the test, `IS_SERVER` must evaluate to `true`/`false`, and the if statement must be eliminated from the output code, leaving only the relevant log.
