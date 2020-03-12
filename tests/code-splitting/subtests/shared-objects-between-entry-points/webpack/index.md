---
result: partial
---

Webpack supports sharing code-splitted modules between entry points, with two important caveats.

Common dependencies are moved into a shared bundle based on [heuristics], and modules that don't satisfy the heurstic are duplicated in the entry bundles that use them. Concretely, Webpack can pass this test when `optimization.splitChunks.minSize` is set to `0`, but not when the value is left at its default. In practise many modules _do_ trigger the heuristic, however it's often difficult to know whether this is happening.

Configuring `splitChunks` can avoid duplicated in entry bundles, however those modules can still be instantiated separately for each entry on the client. To avoid this, always configure Webpack to produce a dedicated "runtime" bootstrapping bundle by setting `optimization.runtimeChunk` to `"single"`.

[heuristics]: https://webpack.js.org/plugins/split-chunks-plugin/#defaults
