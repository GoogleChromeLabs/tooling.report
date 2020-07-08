---
title: Compress images
shortDesc: 'Can images be optimized automatically?'
---

# Introduction

It's often useful to be able to "import" images from JavaScript modules, either to obtain a generated asset URL for the image or to inline its contents as a base64-encoded Data URL. Some build tools provide a dedicated "pipeline" for assets like images. In both scenarios, it's important to be able to process the images to minimize their network or bundle size impact.

Tools like [Imagemin] allow easy automated compression of images without having to specify quality settings or parameters.

# The Test

This test builds an application consisting of a JavaScript module that imports an image. Each build tool is configured to apply automated image optimization to image assets, generally using [Imagemin].

**index.js**

```js
import imageUrl from './image.png';
console.log(imageUrl);
```

**image.png**

```
<binary data>
```

The result should be a JavaScript bundle containing the code from `index.js`, and an optimized version of `image.png`. The image size should be reduced compared to its original source version.

[imagemin]: https://github.com/imagemin/imagemin
