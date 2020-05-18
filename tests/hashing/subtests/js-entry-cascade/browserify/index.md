---
result: partial
---

Browserify supports extracting a single bundle for shared dependencies of entry modules using [factor-bundle]. When bundle URLs are hashed using [gulp-hash], changes to shared dependencies also change the hash in the "common" bundle URL. Since [factor-bundle] does not provide a mechanism for loading bundle dependencies in the browser, injecting the required bundles into a page must be done manually. This means there are no references to the hashed URL of the common bundle in any other bundles, so their hashes do not need to be updated when the hash of the common bundle is updated

The result is that Browserify neither passes nor fails this test, since it does not support dependency loading.

[factor-bundle]: https://github.com/browserify/factor-bundle
[gulp-hash]: https://github.com/Dragory/gulp-hash
