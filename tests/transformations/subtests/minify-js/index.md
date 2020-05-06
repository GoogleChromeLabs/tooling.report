---
title: Minify JS
importance: 1
---

There should be a way for JavaScript to be minified for production builds.

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
