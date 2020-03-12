---
result: pass
---

[rollup-plugin-off-main-thread](https://github.com/surma/rollup-plugin-off-main-thread) allows you to import a JS file as a worker and returns the URL. Rollup makes this simple via its [`emitFile` method](https://rollupjs.org/guide/en/#thisemitfileemittedfile-emittedchunk--emittedasset--string) which lets you create a new chunk dynamically and get its eventual URL. Since workers are just another entry point, this primitive is a perfect and extensible fit.
