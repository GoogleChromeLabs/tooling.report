---
title: SVG
importance: 1
---

SVGs can reference stylesheets, scripts and images:

```html
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <image href="image.jpg" height="200" width="200" />
</svg>
```

In this example, if `image.jpg` changes, the hash of `imagee.jpg` needs to change and in consequence, the hash of the SVG file should change as well.
