---
title: CSS
importance: 1
---

CSS can reference other CSS stylesheets via `@import`, font files via `@font-face` and image files with `background-image`, `mask-image`, `border-image` et al. When the URL hashes for these resources change, the hashed URLs of the CSS that refers to them must also change.

```css
body {
  background-image: url(background.jpg);
}
```

In this example, if `background.jpg` changes, the hash of `background.jpg` needs to change and in consequence, the hash of the CSS file should change as well.
