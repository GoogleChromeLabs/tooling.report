---
title: SVG
shortDesc: 'Do hashed SVG URLs change when subresources change?'
---

# Introduction

Much like HTML, SVG documents can contain references to external resources like stylesheets, scripts and images. When hashing generated URLs to enable long-term caching, changes to the hashed URLs of these subresources must also cause the URL hash of the SVG to change.

# The Test

In this test, the build tool processes one SVG image that references another SVG image, producing two SVGs with hashed URLs. The test is run multiple times, and in one of the runs the contents of the second image (`bg.svg`) are changed so that it generates a different hashed URL.

**img.svg**

```html
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <image href="bg.svg" height="200" width="200" />
</svg>
```

**bg.svg**

```html
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" />
</svg>
```

In this example, when `bg.svg` changes, its hashed URL `bg.a1b2c.svg` will change. Since the built SVG has to be updated with the new image URL, its hashed URL `img.9z8y7.svg` should also change.

If the content of `bg.svg` is changed between two builds, the hash of _both_ output files must change compared to the previous build.
