---
title: Output module formats
importance: 1
shortDesc: 'Generate bundles in popular module formats'
---

When building JavaScript for Node.js, bundles must be made available in the [CommonJS](https://nodejs.org/api/modules.html) format. As of Node 12, [ECMAScript Modules](https://nodejs.org/api/esm.html) are also supported alongside CommonJS, with the appropriate format being selected based on [Export Maps]. Code destined for Node should be packaged in both formats to provide flexibility and version compatibility.

If you're targeting modern browsers, [ECMAScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) are best, however [older browsers may not support it](https://caniuse.com/#feat=es6-module). Even in newer browsers, support for modules isn't available in some contexts: Web Workers only support modules in Chrome, and no browsers support modules in service workers. In these cases, a custom module format implementation must be used to ensure browser support.

[export maps]: https://nodejs.org/api/esm.html#esm_package_entry_points
