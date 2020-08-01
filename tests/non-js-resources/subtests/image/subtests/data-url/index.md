---
title: Data URL
shortDesc: 'Can images be imported as data URLs?'
---

# Introduction

The smallest valid PNG image is [67 bytes](https://github.com/mathiasbynens/small/blob/master/png-transparent.png). While such an image is unlikely to be used in an application, there are real cases where images are small enough that fetching them in a separate HTTP request would be wasteful. In cases where images are trivially small, or where an image is critical for the rendering of an application, it can be necessary to embed the image into JavaScript as a [data URL].

Data URLs are a URLs that containing the mime type and data for a resource, typically encoded as Base64. The 67b PNG image above can be represented as the following 92b Data URL:

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==
```

# The Test

This test bundles a JavaScript module that imports an image. Each build tool is configured to encode images as Data URLs.

**index.js**

```js
import imagePath from './image.png';
console.log(imagePath);
```

**image.png**

```
<binary data>
```

The result of building `index.js` should be a corresponding JavaScript bundle that includes an inlined copy of `image.png` as a Data URL.

[data url]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
