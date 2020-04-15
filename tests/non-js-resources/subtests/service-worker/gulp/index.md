---
result: pass
---

Gulp allows build steps to happen in series if necessary. In this case, all files except the service worker are processed first, including using [gulp-rev-all](https://www.npmjs.com/package/gulp-rev-all) to hash assets and output a `rev-manifest.json`. Then the service worker is processed, and content from the `rev-manifest.json`, and calculated hash version, can be injected into the script.
