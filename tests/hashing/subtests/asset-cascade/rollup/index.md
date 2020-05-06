---
result: fail
issue: https://github.com/rollup/rollup/issues/3415
---

When an asset is updated and its hashed URL changes, the hash of the JavaScript bundle that references it is not automatically updated.

Plugin authors can work around this using [`augmentChunkHash`](https://rollupjs.org/guide/en/#augmentchunkhash) in some cases, so the tests provided here pass. However, it seems like a considerable footgun that this isn't taken care of automatically, so this test is marked as 'fail'.
