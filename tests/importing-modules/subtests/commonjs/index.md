---
title: CommonJS
importance: 1
shortDesc: 'Can CommonJS modules be bundled?'
---

## Introduction

Prior to the introduction of ECMAScript Modules, the most widely-used module format in JavaScript was [CommonJS](https://nodejs.org/api/modules.html). The majority of modules available on npm are published as CommonJS due to its wide support in runtimes like Node.js, though it is increasingly treated as a fallback for ECMAScript Modules. Many modules are designed to be used both in the browser and Node.js, so build tools generally need to be able to account for CommonJS modules being used somewhere in an application.

# The Test

This test bundles two CommonJS modules: an entry module, and a second module it imports and uses.

**index.js**

```js
const cjs = require('./cjs');
console.log(cjs);
```

**cjs.js**

```js
module.exports = 'my string';
```

In order to pass the test, the result of bundling these modules should be a single JavaScript file. Ideally, the string exported from `cjs.js` should be inlined and the now-empty module's closure removed from the bundle.
