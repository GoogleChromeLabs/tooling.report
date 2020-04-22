---
title: JS entry-point hashing cascade
importance: 1
---

When bundling a multi-page application, pages often have different "entry" modules - `/` loads an `index.js` module, `/profile` loads a `profile.js` module, etc. Dependency modules that are shared by these entries can be extracted into shared bundles via [Code Splitting](/code-splitting/). When adopting hashed URLs for effective caching, it's important that any changes to shared bundles update the entry bundles to reference the newly hashed URLs.

**index.js**

```js
import { logCaps } from './utils.js';
logCaps('This is index');
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

Assuming `index.js` and `profile.js` are entry points, and the above is code-split into three files, does changing the contents of `utils.js` (which changes the file name hash) also change the hashes of `index.js` and `profile.js`?

**Note:** Some tools place hashed URLs in a centralized registry rather than in bundles. For these, hash changes only need to be propagated to that registry.
