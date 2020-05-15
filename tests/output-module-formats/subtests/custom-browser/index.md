---
title: Custom browser-compatible format
importance: 1
shortDesc: 'Can bundles use a custom module loader?'
---

# Introduction

Some older browsers don’t support [ECMAScript modules] or [dynamic import], which are fundamental to code splitting and lazy loading. Despite the decline in usage of these browsers, some developers still have to support them. While it is possible to [polyfill ECMAScript modules] in these browsers to a large extent, doing so can incur performance overhead. In cases where performance and compatibility are paramount, a custom custom format like [AMD] or proprietary loader like [Webpack’s runtime](https://webpack.js.org/api/module-variables/) can be used.

# The Test

This test bundles three JavaScript modules: an entry module with a dependency, and a dynamically imported module that will be [code-splitted](/code-splitting/dynamic-import/). Each build tool is configured to use either its built-in custom module format or the most popular custom module format for that tool.

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

The result should be two bundles: an entry bundle containing the code from `index.js` and `utils.js`, and another containing `exclaim.js`. The second bundle should be dynamically loaded by the custom module format's runtime implementation when `main()` is called.

[ecmascript modules]: https://exploringjs.com/es6/ch_modules.html#sec_basics-of-es6-modules
[dynamic import]: https://github.com/tc39/proposal-dynamic-import
[polyfill ecmascript modules]: https://github.com/rich-harris/shimport
[amd]: https://github.com/amdjs/amdjs-api/blob/master/AMD.md
