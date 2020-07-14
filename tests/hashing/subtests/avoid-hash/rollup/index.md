---
result: pass
issue:
  - url: https://github.com/rollup/rollup/issues/2585
    fixedSince: '2.20.0'
    status: closed
---

Rollup lets you specify naming patterns for [entry points](https://rollupjs.org/guide/en/#outputentryfilenames), [chunks](https://rollupjs.org/guide/en/#outputchunkfilenames), and [assets](https://rollupjs.org/guide/en/#outputassetfilenames). These can be functions, allowing you to provide different patterns for different files, including skipping hashing.

Plugins can also bypass hashing for emitted chunks and files by using the `fileName` options of the [`emitFile` method][https://rollupjs.org/guide/en/#thisemitfileemittedfile-emittedchunk--emittedasset--string] method.
