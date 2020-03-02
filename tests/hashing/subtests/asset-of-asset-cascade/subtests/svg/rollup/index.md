---
result: pass
---

Plugin authors can use Rollup's [`emitFile` method](https://rollupjs.org/guide/en/#thisemitfileemittedfile-emittedchunk--emittedasset--string) to add assets-of-assets into the graph. A placeholder hash (based on the content of the asset-of-asset) can be used to ensure changes to the asset-of-asset impacts the hash of the asset.

Extending this to assets-of-assets-of-assets would be a jump in complexity for the plugin author, although [a simpler model is planned](https://github.com/rollup/rollup/issues/2872#issuecomment-591846400).
