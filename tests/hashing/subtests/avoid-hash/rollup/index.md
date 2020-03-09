---
result: fail
---

You can bypass hashing using Rollup's [`emitFile` method](https://rollupjs.org/guide/en/#thisemitfileemittedfile-emittedchunk--emittedasset--string), but writing a plugin just to do that feels like a lot of effort for a simple thing. Also, it doesn't appear possible to differ the hashing of entry points. [Ticket](https://github.com/rollup/rollup/issues/2585).
