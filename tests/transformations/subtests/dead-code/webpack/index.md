---
result: pass
---

Webpack's Dead Code Elimination is implemented by annotating and removing unused module exports, then relying on [Terser] to perform Dead Code Elimination. As with [minification](/transformations/minify), the preservation of some module boundaries in Webpack bundles can limit the amount of optimization Terser can perform.
