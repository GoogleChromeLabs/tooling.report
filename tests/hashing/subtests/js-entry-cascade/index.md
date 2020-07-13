---
title: JS entry-point hashing cascade
shortDesc: 'Do dependency changes update entry bundle hashes?'
---

# Introduction

When bundling a multi-page application, pages often have different "entry" modules - `/` loads an `index.js` module, `/profile` loads a `profile.js` module, etc. Dependency modules that are shared by these entries can be extracted into shared bundles via [Code Splitting](/code-splitting/). When adopting hashed URLs for effective caching, it's important that any changes to shared bundles update the entry bundles to reference the newly hashed URLs.

# The Test

This test simulates a two-page application, with `index.js` and `profile.js` entry modules for each page. A shared `utils.js` module is depended on by both entry modules, and Code Splitting is enabled such that it will be extracted into its own bundle.

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

A build should produce three files: the `index.<hash>.js` and `profile.<hash>.js` entry bundles, and a `utils.<hash>.js` bundle depended on by both. Changing the contents of `utils.js` and re-building results in its hashed URL being updated, which should in turn change the hashed URLs of the two entry bundles.

**Note:** Some tools place hashed URLs in [a centralized mapping](/hashing/avoid-cascade) rather than in bundles. For these, hash changes only need to be propagated to that registry.
