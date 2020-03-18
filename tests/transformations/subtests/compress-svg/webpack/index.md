---
result: pass
---

Webpack doesn't include any compression or asset optimization by default, but there are numerous plugins and loaders available for doing so. Imported SVG assets can be compressed using [svgo-loader](https://github.com/rpominov/svgo-loader), which combines with [file-loader](https://webpack.js.org/loaders/file-loader/) to allow importing an SVG and getting its compressed hashed asset URL.
