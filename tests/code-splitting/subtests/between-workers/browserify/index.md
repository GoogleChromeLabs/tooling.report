---
result: partial
issue: 'N/A'
---

Browserify's module format works in both the main thread and workers.

However, Browserify's code-splitter, [factor-bundle], is limited to creating a single common chunk, and the common chunk needs to be loaded manually, so this will have scaling problems in larger code bases.

[factor-bundle]: https://github.com/browserify/factor-bundle
