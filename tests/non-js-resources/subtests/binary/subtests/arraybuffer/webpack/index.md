---
result: pass
---

[arraybuffer-loader] is an off-the-shelf loader that encodes imported files as Base64, then exports the decoded contents as an ArrayBuffer. This can also be achieved by chaining together `url-loader`'s `base64` option and a quick base64-to-arraybuffer implementation. Since that's basically what arraybuffer-loader does, we'll use the one that was already built.

[arraybuffer-loader]: https://github.com/pine/arraybuffer-loader
