---
title: ECMAScript modules
importance: 1
---

Can the build tool output a bundle as an ECMAScript module? All modern browsers support ESM, and it provides a lightweight way to load scripts, without the need of a custom loader. Also, [ECMAScript modules are coming soon](https://nodejs.org/api/esm.html) to NodeJS.

**index.js** (entry point)

```js
import { logCaps } from './utils.js';

async function main() {
  const { exclaim } = await import('./exclaim.js');
  logCaps(exclaim('This is index'));
}
main();
```

**profile.js** (entry point)

```js
import { logCaps } from './utils.js';
logCaps('This is profile!');
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

The output should contain both entry points, a code-split `utils.js`, and `exclaim.js` which is loaded via `import()`.
