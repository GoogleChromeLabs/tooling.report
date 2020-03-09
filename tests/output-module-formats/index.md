---
title: Output module formats
importance: 1
---

If you're targeting Node.js, [CommonJS](https://nodejs.org/api/modules.html) is still the best format. Although, [ECMAScript modules are coming soon](https://nodejs.org/api/esm.html).

If you're targeting modern browsers, [ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) are best. However, [older browsers may not support it](https://caniuse.com/#feat=es6-module). Even in newer browsers, there may be contexts where it isn't supported, such as workers and service workers. In those cases you need a custom module format that works in the browser.
