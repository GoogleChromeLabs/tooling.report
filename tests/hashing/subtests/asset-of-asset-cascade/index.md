---
title: Asset-of-asset hash cascading
importance: 1
---

Some asset types can have their own dependencies, much like JavaScript modules can. It's common to treat CSS and SVGs as assets, but both formats can include references to images, fonts or stylesheets.

```css
body {
  /* an image "dependency": */
  background-image: url(background.jpg);
}
```

When bundling the above CSS and its referenced image with hashed URLs, any changes to `background.jpg` will also change its hash (`background.a1b2c.jpg`). Since the CSS must be updated to reference the image's new URL hash, the CSS file must also be given a new hashed URL now that its contents have changed.
