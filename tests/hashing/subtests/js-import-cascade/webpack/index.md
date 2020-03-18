---
result: pass
---

Wepback correctly updates the hashes of bundles that include references to child bundles when their hashes change.

When using a [dedicated runtime chunk](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk), hashes are stored there rather than in bundles themselves. In this setup, Webpack correctly updates the hash of the runtime bundle while the hash of the now unchanged entry bundle is preserved.
