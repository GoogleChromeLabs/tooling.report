---
result: pass
issue:
  - url: https://github.com/parcel-bundler/parcel/issues/4320
    fixedSince: 2.0.0-beta.1
    status: closed
  - url: https://github.com/parcel-bundler/parcel/issues/4869
    status: closed
---

Parcel supports this out-of-the box via an [import with a special scheme](<https://parceljs.org/features/bundle-inlining/#inlining-as-a-data-url), `data-url:`.

This only works with JavaScript imports. If you try and use it in HTML: `<img src="data-url:./img.png">`, the src is replaced with an internal identifier. However, this isn't required to pass the test.
