---
result: pass
---

Images configured to use the [`asset` module type](https://webpack.js.org/guides/asset-modules/#general-asset-type) can be processed using [image-webpack-loader] or [imagemin-webpack-plugin], both of which use [Imagemin] for optimization. Both solutions can also be applied to images brought into the build via import statements or solutions like [copy-webpack-plugin].

[image-webpack-loader]: https://github.com/tcoopman/image-webpack-loader
[imagemin-webpack-plugin]: https://github.com/Klathmon/imagemin-webpack-plugin
[file-loader]: https://webpack.js.org/loaders/file-loader/
[imagemin]: https://github.com/imagemin/imagemin
[copy-webpack-plugin]: https://webpack.js.org/plugins/copy-webpack-plugin/
