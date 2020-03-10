---
result: pass
---

Plugin authors can use Rollup's [`emitFile` method](https://rollupjs.org/guide/en/#thisemitfileemittedfile-emittedchunk--emittedasset--string) to add assets into the graph, and this will de-dupe for files with the same content.

As long as the plugins are using `emitFile` rather than rolling their own, assets will not be duped.
