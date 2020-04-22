---
result: partial
issue: https://github.com/parcel-bundler/parcel/issues/4480
---

If you install [postcss-modules](https://www.npmjs.com/package/postcss-modules), then CSS files ending `.module.css` will be loaded as CSS modules. However, this isn't documented.

If you reference a CSS module in HTML, `<link rel="stylesheet" href="styles.module.css">`, then the build fails.
