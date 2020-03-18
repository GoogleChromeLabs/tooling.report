---
result: pass
---

CSS is generally handled by plugins in Webpack, like [mini-css-extract-plugin] or [extract-loader]. Typically the process involves parsing the CSS and generating `require()` statements for each subresource, then parsing those requires and the JavaScript-wrapped CSS back out in an extraction step. This allows Webpack to handle subresources using the same mechanisms it uses for other file types.

This test passes in Webpack because the `[contenthash]` template field for filenames changes only when the output changes. When a hash is invalidated, the filename is updated and its importer is also updated to reflect this, cascading the hash change upwards.

[mini-css-extract-plugin]: https://webpack.js.org/plugins/mini-css-extract-plugin/
[extract-loader]: https://webpack.js.org/loaders/extract-loader/
