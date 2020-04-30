---
title: CommonJS
importance: 1
---

To ensure compatibility with the Node ecosystem, it's important that build tools are able to output bundle in the [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1.1) module format.

**index.js**

```js
import { logCaps } from './utils.js';

// example dynamic import:
async function main() {
  const { exclaim } = await import('./exclaim.js');
  logCaps(exclaim('This is index'));
}
main();
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

The build should produce two bundles in CommonJS format, one for the entry and one for the code-splitted `exclaim.js` module.
