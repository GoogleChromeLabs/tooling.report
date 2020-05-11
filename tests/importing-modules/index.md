---
title: Importing modules
importance: 1
---

Modern JavaScript provides an official syntax for defining and importing modules. Along with this syntax, there are also a number of userland module systems in widespread use, including [CommonJS], [AMD] and [SystemJS]. The varied nature of JavaScript usage means build tools are responsible for reconciling these module formats and enabling cross-compatibility when multiple module formats are used in a single application.

Applications are often composed of a mix of ECMAScript and CommonJS modules, many of which are third-party code installed from package registries like [npm]. At present, the majority of modules available on npm are published as CommonJS due to its historical support in runtimes like Node.js, however the ecosystem is gradually shifting to prefer ECMAScript Modules with CommonJS used as a fallback.

[commonjs]: https://nodejs.org/api/modules.html
[amd]: https://github.com/amdjs/amdjs-api/blob/master/AMD.md
[systemjs]: https://github.com/systemjs/systemjs
[npm]: https://www.npmjs.com
