---
result: pass
---

[arraybuffer-loader] is an off-the-shelf loader that encodes imported files as Base64, then exports the decoded contents as an ArrayBuffer. This can also be achieved by chaining together `url-loader`'s `base64` option and a quick base64-to-arraybuffer implementation. Since that's basically what arraybuffer-loader does, we'll use the one that was already built.

One important caveat with arraybuffer-loader: it's designed to output code that runs in both the browser and Node.js.

As a result, Webpack 4 actually inlines a complete polyfill for Node.js' `Buffer` implementation even though that codepath never gets executed in the browser. To prevent this, it's important to set Webpack's `node.Buffer` configuration option to `false`.

Webpack 5 doesn't automatically include polyfills for Node.js features anymore, so this is no longer needed.

[arraybuffer-loader]: https://github.com/pine/arraybuffer-loader
