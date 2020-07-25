---
title: Dynamic import preloading
importance: 1
shortDesc: 'Can lazy-loaded split points be preloaded?'
---

# Introduction

When creating split points [using dynamic import](/code-splitting/dynamic-import/), it is possible to construct a "waterfall" scenario where JavaScript bundles depend on additional bundles discovered once executed. The ability to preload nested dependency bundles is important in these cases, since doing so can allow the dependency bundles to be downloaded and evaluated in parallel.

# The Test

This test checks to see if it's possible to request code-splitted dependency bundles before the consuming bundle has been loaded, either via [preload](https://web.dev/preload-critical-assets/) or async script loading.

**index.js**

```js
setTimeout(async () => {
  const { shout } =
    Math.random() < 0.5
      ? await import('./utilsA.js')
      : await import('./utilsB.js');
  shout('this is index');
}, 6000);
```

**utilsA.js**

```js
import { exclaim } from './exclaim.js';
export function logCaps(msg) {
  if (!msg) return;
  console.log(msg.toUpperCase());
}
export function shout(msg) {
  logCaps(exclaim(msg));
}
```

**utilsB.js**

```js
import { exclaim } from './exclaim.js';
export function logNormal(msg) {
  if (!msg) return;
  console.log(msg);
}
export function shout(msg) {
  logNormal(exclaim(msg));
}
```

**exclaim.js**

```js
export function exclaim(msg) {
  return msg + '!';
}
```

In the above example, we have a contrived A/B testing scenario, where we load modules on-demand whenever our A/B test condition matches. So randomly `index.js` would request to either `utilsA.js` or `utilsB.js`. And both of these on-demand modules have a shared dependency on `exclaim.js`.

The result should be four scripts: one for the `index.js` module, and another for `utilsA.js` and `utilsB.js`, and `exclaim.js`. When `index.js` executes, it requests for either `utilsA.js` chunk or `utilsB.js` chunk depending upon the generated random number at that time, but in the parallel it starts loading `exclaim.js` as well, because `utilsA.js` and `utilsB.js` has dependency on `exclaim.js`.
