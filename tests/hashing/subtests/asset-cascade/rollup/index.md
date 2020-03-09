---
result: fail
---

The hash of the entry JS does not change. [Ticket](https://github.com/rollup/rollup/issues/3415).

Plugin authors can work around this using [`augmentChunkHash`](https://rollupjs.org/guide/en/#augmentchunkhash) in some cases, so the tests provided here pass. However, it seems like a considerable footgun that this isn't taken care of automatically, so this test is marked as 'fail'.
