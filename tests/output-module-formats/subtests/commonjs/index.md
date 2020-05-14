---
title: CommonJS
importance: 1
shortDesc: 'Can CommonJS bundles be generated?'
---

# Introduction

Prior to the introduction of ECMAScript Modules, the most widely-used module format in JavaScript was [CommonJS]. The majority of modules on npm are published as CommonJS due to its [longstanding support in Node.js][node], so it's important that build tools can [consume CommonJS modules](/importing-modules/commonjs) for compatibility reasons. The same is true for JavaScript _produced_ by build tools: many applications need to run in environments like Node.js, which often requires generating bundles in the CommonJS format.

# The Test

This test checks to see if each build tool is capable of generating JavaScript bundles that use the [CommonJS] format. It bundles an entry module that depends on a `utils` module and a third dynamically-imported `exclaim` module. The dynamic import can be approximated in CommonJS using an inline `require()` call.

**index.js**

```js
import { logCaps } from './utils.js';

async function main() {
  const { exclaim } = await import('./exclaim.js');
  logCaps(exclaim('This is index'));
}
main();
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}
```

**exclaim.js**

```js
export function exclaim(msg) {
  return msg + '!';
}
```

The result of bundling `index.js` should be two JavaScript bundles: one containing the code from `index.js` and `utils.js`, and another with the contents of `exclaim.js`. The `main()` function in the first bundle should now contain a dynamic `require()` call that loads and executes the second bundle.

[commonjs]: http://wiki.commonjs.org/wiki/Modules/1.1.1
[node]: https://nodejs.org/api/modules.html
