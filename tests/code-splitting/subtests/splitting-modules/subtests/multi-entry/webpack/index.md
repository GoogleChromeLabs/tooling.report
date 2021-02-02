---
result: pass
---

Webpack optimizes modules separately for each runtime. In projects that do not require `runtimeChunk: "single"`, each entry is optimized to remove unreachable exports for that entry. It is important to note that configurations without `runtimeChunk: "single"` may [duplicate modules](https://bundlers.tooling.report/code-splitting/multi-entry/#webpack) used by multiple entries.
