---
title: ECMAScript modules
importance: 1
shortDesc: 'Can ECMAScript modules bundles be generated?'
---

# Introduction

[ECMAScript modules] are supported in all modern browsers, representing more than 90% of web traffic. ECMAScript modules are a fast, lightweight way to load scripts without the need for a custom loader. Modules are also always executed asynchronously and in strict mode, improving performance and helping surface otherwise hidden errors.

In addition to widespread browser support, ECMASCript Modules are [supported in Node.js 12+](https://nodejs.org/api/esm.html). This makes them a great choice for portable JavaScript that needs to be able to run in any environment.

# The Test

This test bundles two entry modules, `index.js` and `profile.js`. Each depends on a method imported from a shared `utils.js` module, and `index.js` dynamically imports a fourth module which should create a [split point](/code-splitting/dynamic-import).

**index.js**

```js
import { logCaps } from './utils.js';

async function main() {
  const { exclaim } = await import('./exclaim.js');
  logCaps(exclaim('This is index'));
}
main();
```

**profile.js**

```js
import { logCaps } from './utils.js';
logCaps('This is profile!');
```

**exclaim.js**

```js
export function exclaim(msg) {
  return msg + '!';
}
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}
```

The output of this test should be four bundles in ECMAScript Modules format. Two entry bundles corresponding to the two entry modules, a code-splitted `utils.js` module, and a fourth bundle containing `exclaim.js` that is loaded via dynamic `import()`.

[ecmascript modules]: https://exploringjs.com/es6/ch_modules.html#sec_basics-of-es6-modules
