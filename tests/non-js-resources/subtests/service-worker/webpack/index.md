---
result: pass
---

Webpack does not automatically handle Service Worker, but it does expose the necessary asset metadata during compilation for plugins to be able to embed hashed assets URLs. While it's not possible to use Webpack's own `DefinePlugin` to embed this metadata into modules, plugins can "embed" asset information by prepending variable declarations to generated scripts.

This example uses [auto-sw-plugin], a specialized predecessor of worker-plugin developed for [Squoosh]. The plugin automatically detects `navigator.serviceWorker.register()` usage, compiles the Service Worker script using Webpack, and embeds an Array of asset URLs available to the Service Worker as a `BUILD_ASSETS` global.

[auto-sw-plugin]: https://github.com/GoogleChromeLabs/squoosh/blob/master/config/auto-sw-plugin.js
[squoosh]: https://squoosh.app
