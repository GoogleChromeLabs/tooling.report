---
result: fail
issue: https://github.com/parcel-bundler/parcel/issues/4302
---

Parcel inlines `obj.js` twice, which makes the code behave differently compared to when using native ES modules.
