---
result: pass
---

Webpack calculates hashes based on the final contents of generated bundles. As a result, code changes that don't result in a change to a bundle's contents preserve its same hash and avoid unnecessary invalidation.
