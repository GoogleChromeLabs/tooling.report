---
title: SVG
importance: 1
shortDesc: 'Do hashed SVG URLs change when subresources change?'
---

## Introduction

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

In the build where the contents of `bg.svg` are changed and its hashed URL changes, the hashed URL of `img.svg` also needs to be changed. The result of running two builds with different content in `bg.svg` should be four files: two pairs of `img.<hash>.svg` and `bg.<hash>.svg`, each with different hashes.
