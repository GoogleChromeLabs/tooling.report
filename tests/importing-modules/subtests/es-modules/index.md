---
title: ECMAScript modules
shortDesc: 'Can ECMAScript modules be bundled?'
---

# Introduction

Modern browser-focused JavaScript tends to use [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), which are also supported in [Node.js 12+](https://nodejs.org/api/esm.html). Unlike CommonJS or UMD, JavaScript Modules have a specific syntax that is more restrictive and designed to enable static analysis. This allows bundlers to more reliably parse and extract information about module exports and their usage, which can then be used to optimize bundles by removing unused exports - a process commonly referred to as tree-shaking.

# The Test

This test bundles two ECMAScript Modules: one entry module, and a dependency it imports.

**index.js**

```js
import esm from './esm.js';
console.log(esm);
```

**esm.js**

```js
export default 'my string';
```

In order to pass the test, the result of bundling these modules should be a single JavaScript file, where `'my string'` is logged.

Ideally, the string export from `esm.js` can be inlined where it is used in `index.js`, removing the module's representation from the bundle entirely, and stripping away any module loading runtime. The contents of the bundle should essentially be `console.log('my string')`, although this optimization may require a minifier.
