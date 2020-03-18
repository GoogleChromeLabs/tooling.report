---
result: pass
---

Webpack uses the [Node.js module resolution algorithm] to resolve dependencies, which means it supports resolving dependencies from `node_modules` out-of-the-box. It also respects the widely adopted `"module"` field in `package.json` files by default, giving it precedence over the `"main"` field when defined.

Webpack does not currently support [Package Exports] or [Conditional Exports].

[node.js module resolution algorithm]: https://nodejs.org/api/modules.html#modules_all_together
[package exports]: https://nodejs.org/api/esm.html#esm_package_exports
[conditional exports]: https://nodejs.org/api/esm.html#esm_conditional_exports
