---
result: fail
issue: https://github.com/rollup/rollup/issues/2585
---

It is possible to bypass URL hashing in using the the [`emitFile` method][emitfile], however this requires writing a plugin. This is a non-trivial effort, and it's possible the plugin won't interoperate with other plugins that assume output URLs are hashed.

Rollup also does not support hashing entry bundles conditionally or on a per-bundle basis.

[emitfile]: https://rollupjs.org/guide/en/#thisemitfileemittedfile-emittedchunk--emittedasset--string
