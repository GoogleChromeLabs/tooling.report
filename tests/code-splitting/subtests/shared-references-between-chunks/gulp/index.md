---
result: pass
---

This uses [esmify] to add support for EcmaScript modules, and [factor-bundle] for code-splitting.

[esmify] doesn't support dynamic import, so two entry points are used for this test.

Note: [factor-bundle] is limited to creating a single common chunk, and the common chunk needs to be loaded manually.

[factor-bundle]: https://github.com/browserify/factor-bundle
[esmify]: https://www.npmjs.com/package/esmify
