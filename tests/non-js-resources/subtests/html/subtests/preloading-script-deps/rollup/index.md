---
result: pass
---

Rollup's [`generateBundle` hook](https://rollupjs.org/guide/en/#generatebundle) gives you full access to build details before files are written. For script chunks, this includes a list of files imported by that script, which you can use to create preloads.
