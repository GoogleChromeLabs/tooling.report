---
result: pass
---

When values are defined at build time using Webpacks' DefinePlugin, any modules imported conditionally based on those values are pruned prior to bundling. This avoids unused modules from being bundled, and can also improve build performance since those modules do not need to be parsed.
