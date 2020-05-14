---
title: Dead imported code
importance: 1
shortDesc: 'Can dead code elimination be applied to dynamic imports?'
---

# Introduction

Performing [Dead Code Elimination](/transformations/dead-code) on JavaScript bundles when building for production is an important performance optimization that avoids sending unused code to the browser. Exports of a module that are not imported or used by any other module in an application can also be considered dead code and subject to removal. However, this leads to some tricky optimization cases where a module's exports are used in a way that is difficult to statically analyze. Dynamic imports are one of these cases, because the Module record returned by a dynamic import has properties for each export that can be referenced in many different ways, some of which can't be determined at build time.

# The Test

This test bundles two modules - an entry module, and a `utils.js` module it dynamically imports to create a [split point](/code-splitting/dynamic-import). The dynamically imported module has two exports, but only the `logCaps` export is used.

**index.js**

```js
(async function() {
  const { logCaps } = await import('./utils.js');
  logCaps('This is index');
})();
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}

export function thisIsNeverCalled(msg) {
  return msg + '!';
}
```

Once built for _production_, the `thisIsNeverCalled` function from `utils.js` should not be present in the resulting bundle(s).
