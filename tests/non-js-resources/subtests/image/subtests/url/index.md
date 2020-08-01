---
title: URL
shortDesc: 'Can images be imported as asset URLs?'
---

Import an image and get a URL that can be used in an `<img />`.

# Introduction

Images can be quite large depending on their format, quality and dimensions. For the majority of images that are too large to be [inlined into JavaScript bundles](/non-js-resources/image/data-url/), the most direct way to reference them from JavaScript is by their URL. Like most other [non-JavaScript resources](/non-js-resources/), images imported into the JavaScript module graph have the benefit of being treated as dependencies that can be processed and have their [URLs hashed](/hashing/) for effective long-term caching.

# The Test

This test bundles a simple JavaScript module that imports an image file. Each build tool is configured to handle image imports by providing the image's generated asset URL as the result of the import statement.

**index.js**

```js
import imagePath from './image.png';
console.log(imagePath);
```

**image.png**

```
<binary data>
```

After bundling is complete, the result should be a bundled version of `index.js` in which `imagePath` now refers to the generated hashed URL for `image.png`, also be present in the output directory.
