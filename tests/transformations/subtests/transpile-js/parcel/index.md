---
result: pass
---

By default, Parcel doesn't transpile. Setting a browserslist config (i.e. in `package.json#browserslist`) will enable transpilation to support the specified browsers (though for await/async, [another Babel plugin has to be specified](https://v2.parceljs.org/languages/babel/#extending-the-default-babel-config)).
