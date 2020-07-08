---
title: Minify JS
shortDesc: 'Can JavaScript be minified for production?'
---

# Introduction

Minification is an important optimization step when bundling JavaScript code for production use. Minification reduces the size of code by removing comments and whitespace, inlining small functions and values where they are used, and normalizing control flow to use repeated syntax that compresses well.

# The Test

This test ensures each build tool provides a way to enable minification for a production build.

**index.js**

```js
import { logCaps } from './utils.js';
import { exclaim } from './exclaim.js';
logCaps(exclaim('This is index'));
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

Bundling the above into a single output file should allow minification to be performed on the whole bundled code. In the most ideal scenario, a bundle should be produce that contains only the following code:

```js
console.log('This is index!'.toUpperCase());
```
