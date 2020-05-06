---
result: pass
---

Parcel can build for different “targets”, which are defined in `package.json`. Per target you can set the `outputFormat`, which can be set to `esmodule`. Chunks will be saved as ES modules, but it will only use dynamic import if your browser support list only contains browsers that support dynamic import. Otherwise, it will use `<script>`-based loading instead.
