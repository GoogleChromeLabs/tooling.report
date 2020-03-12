---
result: fail
issue: https://github.com/webpack/webpack/issues/7787
---

Changes to comments change the hash of the file, even though the minified output is identical. Changes in Webpack as well as [terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin/issues/18) are necessary to make this pass.
