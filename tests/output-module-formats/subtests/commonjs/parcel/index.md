---
result: pass
---

Parcel can build for different "targets", which are defined in `package.json`. Configuring a target with either `{ "context": "node" }` or `{ "outputFormat": "commonjs" }` will produce CommonJS output that uses `require()` and `module.exports` to load code-splitted bundles.
