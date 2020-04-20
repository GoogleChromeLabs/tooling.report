---
title: Compress images
importance: 1
---

It's often useful to be able to "import" images from JavaScript modules, either to obtain a generated asset URL for the image or to inline its contents as a base64-encoded Data URL. Some build tools provide a dedicated "pipeline" for assets like images. In both scenarios, it's important to be able to process the images to minimize their network or bundle size impact.

Tools like [Imagemin](https://github.com/imagemin/imagemin) allow easy automated compression of images without having to specify quality settings or parameters.
