---
title: CSS
shortDesc: 'Do CSS URL hashes reflect subresources changes?'
---

# Introduction

CSS can reference other CSS stylesheets via `@import`, font files via `@font-face` and image files with `background-image`, `mask-image`, `border-image` et al. When the URL hashes for these resourcess are changed, the hashed URLs of any CSS files referring to them must also change.

# The Test

This test runs repeated builds of a CSS stylesheet referencing an image, both of which receive hashes in their URLs. The contents of the SVG image are changed causing it to have a different URL hash in the final build build, which should also update the stylesheet's URL hash.

**styles.css**

```css
body {
  background-image: url(bg.svg);
}
```

In this example, when `bg.svg` changes, its hashed URL `bg.a1b2c.svg` will change. Since the built CSS has to be updated with the new image URL, its hashed URL `styles.9z8y7.css` should also change.

If the content of `bg.svg` is changed between two builds, the hash of _both_ output files must change compared to the previous build.
