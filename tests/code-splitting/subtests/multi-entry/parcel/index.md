---
result: pass
issue: https://github.com/parcel-bundler/parcel/issues/4302
---

Parcel includes `obj.js` only in the first script, other scripts in the same HTML file will access shared module from each other.
