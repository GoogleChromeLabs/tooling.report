---
result: pass
---

Parcel supports the `worklet:` scheme to get a URL to a worklet file. This can be used to build for a new worklet type. It also automatically detects the `CSS.paintWorklet.addModule(new URL('worklet.js', import.meta.url))` syntax for paint worklets, along with standard `new Worker()` and `navigator.serviceWorker.register`.
