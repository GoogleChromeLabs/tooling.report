---
result: pass
---

Webpack was one of the first bundlers to use [Dynamic Imports] as a signal for creating code-splitting boundaries.

Unlike [multiple entries](/code-splitting/multi-entry), split points created using [Dynamic Imports] consistently result in a separate bundle being created without customizing `optimization.splitChunks`.

[dynamic imports]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports
