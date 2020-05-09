---
title: Avoid cascading hash changes
importance: 1
shortDesc: 'Can a map be used to centralized bundle hashes?'
---

## Introduction

When using [hashed URLs](/hashing) for long-term caching, hashes can be collected into a centralized mapping (like an [Import Map]) to reduce the scope of cache invalidation. This is a tradeoff: the mapping itself is an uncacheable resource, but this allows individual resource URLs to change without invalidating the URLs of every resource that references them.

This is most beneficial for JavaScript bundles, where each bundle is often referenced from at least one other bundle. Adopting a mapping technique for hashed bundled URLs makes it possible to push new versions of dependencies without having to push new versions of everything that references them.

# The Test

This test simulates a multi-page application, with two entry modules representing pages, a shared dependency, a code-splitted bundle, and a text file. Each tool is configured to centralize bundle hashes, which generally requires embedding a module loader capable of performing URL hash resolution at runtime.

**index.js**

```js
import { logCaps } from './utils.js';
import { exclaim } from './exclaim.js';
logCaps(exclaim('This is index'));
import('./lazy.js').then(({ str }) => logCaps(str));
```

**profile.js**

```js
import txtURL from './some-asset.txt';
import { logCaps } from './utils.js';
logCaps('This is profile');
fetch(txtURL).then(async response => console.log(await response.text()));
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

**lazy.js**

```js
export const str = 'This is a string';
```

**some-asset.txt**

```
This is an asset!
```

The build produces four JavaScript bundles and a text file, all with hashed URLs. There should be bundles for the `index.<hash>.js` and `profile.<hash>.js` "routes", another for their `logCaps()` dependency, and a fourth for `lazy.js`. To pass this test, all hashes should be collected in a map file or module loader, and no hashes should appear in any of the bundles.

[import map]: https://github.com/WICG/import-maps
