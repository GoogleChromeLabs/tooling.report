---
title: Dynamic import
importance: 1
shortDesc: 'Can split points be created using dynamic import?'
---

# Introduction

In Code Splitting, a "split point" refers to an asynchronous module boundary that allows for a dependency to be bundled separately and loaded separately from the parent bundle. Creating split points makes it possible to control when the JavaScript for each part of an application is loaded, which is particularly useful for prioritising "first interaction" code over other scripts.

The most common syntax for denoting split points is [Dynamic Import], the asynchronous version of an [import statement].

# The Test

This test checks to see if it's possible to create a split point using Dynamic Import.

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
```

The result should be two scripts: one for the `index.js` module, and another for `utils.js`. It should be possible to execute the first script before the second is loaded.

[dynamic import]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports
[import statement]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
