---
title: Preloading script dependencies
shortDesc: 'Can preloads be generated for scripts?'
---

# Introduction

Creating [split points](/code-splitting/dynamic-import/) using dynamic imports makes it possible to progressively load parts of the code for an application as-needed. The ability to preload code-splitted bundles can improve performance by increasing the likelihood that bundles are available by the time they are needed. However, this is not always optimal: preloading scripts that are loaded conditionally or that may never be needed incurs an unnecessary cost.

# The Test

This test simulates a three-page website with `index` `profile` and `help` pages, each having their own corresponding script. The page scripts depend on two common utility modules, and each build tool is configured to preserve these modules in their own bundles as runtime dependencies. Finally, the script for the `index` page lazy-loads a module using dynamic import after a 10 second delay, and the resulting code-splitted bundle should not be preloaded.

**index.js**

```js
import { logCaps, strongEm } from './utils.js';
logCaps(strongEm('This is index'));

setTimeout(async () => {
  const { exclaim } = import('./index-exclaim.js');
  logCaps(exclaim('This is still index'));
}, 10000);
```

**index-exclaim.js**

```js
export function exclaim(msg) {
  return msg + '!';
}
```

**profile.js**

```js
import { em } from './more-utils.js';
console.log(em('This is profile'));
```

**help.js**

```js
import { logCaps, strongEm } from './utils.js';
logCaps(strongEm('This is help'));
```

**utils.js**

```js
import { em } from './more-utils.js';

export function logCaps(msg) {
  console.log(msg.toUpperCase());
}

export function strongEm(msg) {
  return '===' + em(msg) + '===';
}
```

**more-utils.js**

```js
export function em(msg) {
  return '***' + msg + '***';
}
```

The result of this test should be 3 HTML pages: `index.html`, `profile.html` and `help.html`. Each page should load its respective script: `index.js`, `profile.js`, and `help.js`.

In order to pass the test, each page should contain `<link rel="preload">` tags for the scripts it immediately needs, but _not_ for its lazy-loaded dependencies. For example, `index.html` should preload the `index.<hash>.js` and `utils.<hash>.js` bundles, but not the `index-exclaim.<hash>.js` bundle.
