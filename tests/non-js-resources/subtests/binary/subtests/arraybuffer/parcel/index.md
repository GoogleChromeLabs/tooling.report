---
result: partial
issue:
  - url: https://github.com/parcel-bundler/parcel/issues/4405
  - url: https://github.com/parcel-bundler/parcel/issues/4320
---

Parcel 2 [supports `fs.readFileSync`](https://v2.parceljs.org/features/node-emulation/#%F0%9F%93%84-inlining-fs.readfilesync), which inlines the contents of the file as base64 and converts it into a node Buffer.

However, the node Buffer polyfill is over 8.5k (gzipped), so it adds a lot of unnecessary overhead.

It seems likely that Parcel 2's [plugin system](https://v2.parceljs.org/plugin-system/overview/) will provide a solution once it's documented.
