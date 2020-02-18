---
title: Service worker
---

Although the service worker _is_ a JavaScript dependency, it needs to contain information about the overall build, so it can pass particular files to `cache.addAll`.

To pass this test, the service worker needs to be aware of the final URL of:

- All script.
- All CSS.
- All fonts included in the CSS.
