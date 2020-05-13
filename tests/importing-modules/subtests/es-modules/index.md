---
title: ECMAScript modules
importance: 1
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

The result of building the entry module should be a single JavaScript bundle containing the code from both modules. Ideally, the string default export from `esm.js` should be inlined where it is used in `index.js` removing the module's representation from the bundle entirely. Stripping away any module loading runtime and hashing information, the contents of the bundle should essentially be `console.log('my string')`.
