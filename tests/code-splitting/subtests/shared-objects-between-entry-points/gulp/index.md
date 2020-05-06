---
result: partial
---

Browserify's [factor-bundle] plugin supports extracting shared modules into a common bundle, alongside the bundles for each entry module.

There are two important caveats to consider when using [factor-bundle]: only a single "common" bundle can be generated for all entry bundles, and it can't be used with [tinyify]/[browser-pack-flat]. This means Browserify users must currently choose between having optimized "scope-collapsed" bundles with duplication, or multiple "scope-preserved" bundles without duplication.

[factor-bundle]: https://github.com/browserify/factor-bundle
[tinyify]: https://github.com/browserify/tinyify
[browser-pack-flat]: https://github.com/goto-bus-stop/browser-pack-flat
