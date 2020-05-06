---
title: Service worker
importance: 1
---

Although the service worker _is_ a JavaScript dependency, it needs to contain information about the output of the build, for example to pass them to [`cache.addAll`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/addAll).

To pass this test, the service worker needs to be aware of the final URL of:

- All scripts.
- All HTML.
- All assets.
- All CSS.
- All fonts included in the CSS.

The cache name should also be versioned based on the content of all cached files, and the service worker itself.
