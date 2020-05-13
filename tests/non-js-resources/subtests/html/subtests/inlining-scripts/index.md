---
title: Inlining scripts
importance: 1
shortDesc: 'Can processed scripts be inlined into HTML?'
---

## Introduction

This test emulates a minimal two-page website, with "index" and "profile" pages. Each page has its own script, but the two depend on a common library.

# The Test

This test emulates a minimal two-page website, with "index" and "profile" pages. Each page has its own script, but the two depend on a common library and also each lazily import a second shared module, creating a [split point](/code-splitting/dynamic-import). Building the pages should bundle and inline the scripts for `index.html`, but preserve the scripts from `profile.html` as well as the lazy-loaded module.

**index.js**

```js
import { logCaps } from './utils.js';
import { exclaim } from './exclaim.js';
logCaps(exclaim('This is index'));
import('./lazy.js');
```

**exclaim.js**

```js
export function exclaim(msg) {
  return msg + '!';
}
```

**profile.js**

```js
import { logCaps } from './utils.js';
logCaps('This is profile');
import('./lazy.js');
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}
```

**lazy.js**

```js
console.log('Totally lazy');
```

The build result should be include two HTML files. `index.html` should contain inlinined bundle for `index.js` and its dependencies. `profile.html` should reference the bundle for `profile.js` as an external script. Both pages should reference the same lazy-loaded bundle for `lazy.js`.
