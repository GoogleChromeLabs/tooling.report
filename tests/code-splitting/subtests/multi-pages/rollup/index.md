---
result: pass
---

Rollup accepts multiple entry modules specified as an Array or Object, and produces a corresponding output bundle for each, splitting common code into other chunks by default.

Rollup aims to create as few chunks as possible, but it will never duplicate module definitions in a single build.
