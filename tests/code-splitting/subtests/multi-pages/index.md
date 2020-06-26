---
title: Multiple pages with one entry point
importance: 1
shortDesc: 'Are common entry dependencies extracted into a shared bundle?'
---

# Introduction

The use of multiple entry points in bundlers is often synonymous with multiple pages. As an example, imagine an "index" page and a "profile" page, each with their own script. Both scripts happen to make use of a large common library. Instead of being bundled into each page's script, the library should be split out into a bundle shared by both.

Splitting common code out of entry bundles reduces a site's total JavaScript size, and enables the common code to be loaded from the cache when moving between pages.

# The Test

This test simulates a two page website by bundling two entry modules, `index.js` and `profile.js`. Both entry modules depend on a `utils.js` module.

**index.js**

```js
import { logCaps } from './utils.js';
import { exclaim } from './exclaim.js';
logCaps(exclaim('This is index'));
```

**profile.js**

```js
import { logCaps } from './utils.js';
logCaps('This is profile');
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

The result should be three scripts: One for the "index" page, one for the "profile" page, and one containing the `logCaps()` function they both need.

Some bundlers prefer to duplicate modules to avoid creating an extra chunk unless some condition is met, such as a size threshold. That is acceptable, since these entry points are running in different JavaScript realms (pages, in this case). However, to pass the test, the bundler must at some point perform code splitting, either through configuration, or passing some size threshold.
