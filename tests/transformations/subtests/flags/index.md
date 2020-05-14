---
title: Flags
importance: 1
shortDesc: 'Can flags be inlined at build time?'
---

# Introduction

Applications often make use of "flags", which are constant values set at build-time. Evaluating these values prior to bundling enables many useful optimizations. For example, flags can make certain code paths unreachable, allowing modules to be pruned from the dependency tree.

# The Test

This test compiles a single JavaScript module with a conditional statement based on an `IS_SERVER` flag. The method by which this flag value is applied varies between tools, but generally the result is that any usage of the variable is replaced with a Boolean literal value at compile time.

**index.js**

```js
if (IS_SERVER) {
  console.log('This is running on the server');
} else {
  console.log('This is running on the client');
}
```

To pass the test, `IS_SERVER` must evaluate to `true`/`false`, and the if statement must be eliminated from the output code, leaving only the relevant log.
