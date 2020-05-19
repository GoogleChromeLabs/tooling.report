---
result: pass
---

Browseriy supports "importing" assets as hashed asset URLs through the [urify-emitter] transform. The generated bundles include hashed asset URLs, so when these are passed through [gulp-rev-all] to apply content-based hashing, any changes to an asset URL cause the corresponding JavaScript bundle's hash to change.

[urify-emitter]: https://github.com/mattdesl/urify-emitter
[gulp-rev-all]: https://github.com/smysnk/gulp-rev-all
