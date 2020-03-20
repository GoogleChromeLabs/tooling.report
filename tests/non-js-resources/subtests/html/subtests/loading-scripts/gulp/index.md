---
result: pass
---

First, `buildScripts` task runs JS build with browserify, add hash, then produce manifest file, then `replaceHTML` task uses `gulp-rev-collector` plugin to replace src in respective HTML based on the manifest.
